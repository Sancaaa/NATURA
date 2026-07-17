"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type PickPoint = {
  pos: [number, number, number];
  labelPos: [number, number, number];
};

/** Offset model di frame .content (samakan dengan viewer AR). */
const MODEL_OFFSET = new THREE.Vector3(0, 0, 0.1);

/**
 * Penampil 3D untuk menempatkan titik highlight. Model dimuat pada frame yang
 * sama dengan viewer AR (offset 0,0,0.1) sehingga titik hasil klik (world)
 * = koordinat `pos` yang dipakai AR.
 * - Klik model → onPick(pos) menaruh titik terpilih.
 * - Seret label titik terpilih → onLabelMove(labelPos) memindah posisi label.
 */
export default function AnnotationPicker({
  src,
  points,
  selected,
  onPick,
  onLabelMove,
  className,
}: {
  src?: string;
  points: PickPoint[];
  selected: number;
  onPick: (pos: [number, number, number]) => void;
  onLabelMove: (labelPos: [number, number, number]) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const markersRef = useRef<THREE.Group | null>(null);
  const targetsRef = useRef<THREE.Object3D[]>([]);
  // Sasaran genggam label (hanya untuk anotasi terpilih).
  const grabRef = useRef<THREE.Object3D[]>([]);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;
  const onLabelMoveRef = useRef(onLabelMove);
  onLabelMoveRef.current = onLabelMove;
  const dataRef = useRef({ points, selected });
  dataRef.current = { points, selected };

  // --- Scene (dibangun sekali per model) ---
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eef1fb");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100);
    camera.position.set(0, 0.4, 1.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 5, 2);
    scene.add(dir);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Frame .content: model diletakkan pada offset yang sama dengan AR.
    const content = new THREE.Group();
    scene.add(content);
    const modelGroup = new THREE.Group();
    modelGroup.position.copy(MODEL_OFFSET);
    content.add(modelGroup);

    const markers = new THREE.Group();
    content.add(markers);
    markersRef.current = markers;

    function frameTo(obj: THREE.Object3D) {
      const box = new THREE.Box3().setFromObject(obj);
      if (box.isEmpty()) return;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3()).length() || 1;
      controls.target.copy(center);
      camera.position.set(center.x, center.y + size * 0.15, center.z + size * 1.4);
      camera.near = size / 100;
      camera.far = size * 100;
      camera.updateProjectionMatrix();
      controls.update();
    }

    function buildProcedural() {
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.14, 0.5, 20),
        new THREE.MeshStandardMaterial({ color: "#99a3c0", roughness: 0.8 }),
      );
      body.position.y = 0.25;
      modelGroup.add(body);
      targetsRef.current = [body];
      frameTo(content);
    }

    let disposed = false;
    if (src) {
      new GLTFLoader().load(
        src,
        (gltf) => {
          if (disposed) return;
          modelGroup.add(gltf.scene);
          const meshes: THREE.Object3D[] = [];
          gltf.scene.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) meshes.push(o);
          });
          targetsRef.current = meshes;
          frameTo(content);
        },
        undefined,
        () => {
          if (!disposed) buildProcedural();
        },
      );
    } else {
      buildProcedural();
    }

    // --- Interaksi: klik (taruh titik) vs seret label vs orbit ---
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down: { x: number; y: number } | null = null;
    let moved = false;
    let draggingLabel = false;
    const dragPlane = new THREE.Plane();
    const hitPoint = new THREE.Vector3();
    const camDir = new THREE.Vector3();

    function setNdc(clientX: number, clientY: number) {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY };
      moved = false;
      // Cek apakah menggenggam label terpilih.
      setNdc(e.clientX, e.clientY);
      raycaster.setFromCamera(ndc, camera);
      const g = raycaster.intersectObjects(grabRef.current, true);
      if (g.length) {
        draggingLabel = true;
        controls.enabled = false; // hentikan orbit selama menyeret
        // Bidang seret: menghadap kamera, melewati posisi label saat ini.
        camera.getWorldDirection(camDir);
        dragPlane.setFromNormalAndCoplanarPoint(camDir, g[0].object.position);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6)
        moved = true;
      if (!draggingLabel) return;
      const { points: pts, selected: si } = dataRef.current;
      if (si < 0 || !pts[si]) return;
      setNdc(e.clientX, e.clientY);
      raycaster.setFromCamera(ndc, camera);
      if (!raycaster.ray.intersectPlane(dragPlane, hitPoint)) return;
      const pos = pts[si].pos;
      onLabelMoveRef.current([
        +(hitPoint.x - pos[0]).toFixed(3),
        +(hitPoint.y - pos[1]).toFixed(3),
        +(hitPoint.z - pos[2]).toFixed(3),
      ]);
    };

    const onUp = (e: PointerEvent) => {
      if (draggingLabel) {
        draggingLabel = false;
        controls.enabled = true;
        down = null;
        return;
      }
      if (!down || moved) {
        down = null;
        return;
      }
      down = null;
      setNdc(e.clientX, e.clientY);
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(targetsRef.current, true);
      if (hits.length) {
        const p = hits[0].point; // world = koordinat .content
        onPickRef.current([
          +p.x.toFixed(3),
          +p.y.toFixed(3),
          +p.z.toFixed(3),
        ]);
      }
    };
    const el = renderer.domElement;
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      controls.dispose();
      renderer.dispose();
      markersRef.current = null;
      grabRef.current = [];
      if (renderer.domElement.parentNode === container)
        container.removeChild(renderer.domElement);
    };
  }, [src]);

  // --- Marker titik + garis label (perbarui saat data berubah) ---
  useEffect(() => {
    const markers = markersRef.current;
    if (!markers) return;
    while (markers.children.length) {
      const c = markers.children.pop()!;
      (c as THREE.Mesh).geometry?.dispose?.();
    }
    const grabs: THREE.Object3D[] = [];

    points.forEach((pt, i) => {
      const isSel = i === selected;
      const color = isSel ? "#1537F9" : "#D98A3D";
      const pos = new THREE.Vector3(...pt.pos);
      const labelEnd = pos.clone().add(new THREE.Vector3(...pt.labelPos));

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(isSel ? 0.02 : 0.014, 16, 16),
        new THREE.MeshBasicMaterial({ color }),
      );
      dot.position.copy(pos);
      markers.add(dot);

      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([pos, labelEnd]),
        new THREE.LineBasicMaterial({ color }),
      );
      markers.add(line);

      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.02, 0.006),
        new THREE.MeshBasicMaterial({ color }),
      );
      cap.position.copy(labelEnd);
      markers.add(cap);

      // Sasaran genggam (bola transparan lebih besar) hanya untuk terpilih.
      if (isSel) {
        const grab = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 12, 12),
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
        );
        grab.position.copy(labelEnd);
        markers.add(grab);
        grabs.push(grab);
      }
    });

    grabRef.current = grabs;
  }, [points, selected]);

  return <div ref={ref} className={className} />;
}
