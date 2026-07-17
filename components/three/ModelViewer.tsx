"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Viewer 3D memakai three.js murni (tanpa GPU/library berat).
 * Jika `src` (GLB) tersedia akan dimuat; jika tidak / gagal, memakai
 * model tanaman prosedural sederhana agar tetap ada yang tampil.
 */
export default function ModelViewer({
  src,
  className,
}: {
  src?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eef1fb");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4);

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
    controls.target.set(0, 0.8, 0);
    controls.minDistance = 2;
    controls.maxDistance = 8;

    const group = new THREE.Group();
    scene.add(group);

    const buildProcedural = () => {
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.5, 0.7, 24),
        new THREE.MeshStandardMaterial({ color: "#c1683c", roughness: 0.85 }),
      );
      pot.position.y = 0.35;
      group.add(pot);

      const soil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.66, 0.66, 0.1, 24),
        new THREE.MeshStandardMaterial({ color: "#3b2a1e" }),
      );
      soil.position.y = 0.68;
      group.add(soil);

      // Batang & daun tetap hijau: ini realisme model tanaman, bukan warna
      // brand — jangan ikut diubah saat palet UI berganti.
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.07, 1.1, 12),
        new THREE.MeshStandardMaterial({ color: "#2e7d4f" }),
      );
      stem.position.y = 1.25;
      group.add(stem);

      const leafGeo = new THREE.SphereGeometry(0.42, 16, 16);
      const leafMat = new THREE.MeshStandardMaterial({
        color: "#3f9b63",
        roughness: 0.6,
      });
      const positions: [number, number, number][] = [
        [0.35, 1.5, 0],
        [-0.35, 1.7, 0.1],
        [0.1, 2.0, -0.2],
        [-0.15, 1.35, 0.25],
      ];
      for (const [x, y, z] of positions) {
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(x, y, z);
        leaf.scale.set(1, 0.35, 0.7);
        leaf.rotation.z = x > 0 ? -0.5 : 0.5;
        group.add(leaf);
      }
    };

    let disposed = false;
    if (src) {
      new GLTFLoader().load(
        src,
        (gltf) => {
          if (!disposed) group.add(gltf.scene);
        },
        undefined,
        () => {
          if (!disposed && group.children.length === 0) buildProcedural();
        },
      );
    } else {
      buildProcedural();
    }

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      group.rotation.y += clock.getDelta() * 0.5;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth || 320;
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
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [src]);

  return <div ref={ref} className={className} />;
}
