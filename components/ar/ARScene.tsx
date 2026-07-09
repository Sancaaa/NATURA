"use client";

import { useEffect, useRef, useState } from "react";

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("gagal memuat " + src));
    document.head.appendChild(s);
  });
}

/**
 * Mode AR memakai MindAR (image tracking) + A-Frame, dimuat dari CDN.
 * Perlu aset:
 *   - target image (.mind) di `targetSrc`
 *   - model 3D (.glb) di `modelSrc`
 * Lihat public/ar/README.md untuk cara membuat target.
 */
export default function ARScene({
  modelSrc = "/models/plant.glb",
  targetSrc = "/ar/targets.mind",
}: {
  modelSrc?: string;
  targetSrc?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await loadScript("https://aframe.io/releases/1.6.0/aframe.min.js");
        await loadScript(
          "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js",
        );
        if (!active || !ref.current) return;
        ref.current.innerHTML = `
          <a-scene
            mindar-image="imageTargetSrc: ${targetSrc}; autoStart: true; uiScanning: no; uiError: no;"
            embedded
            color-space="sRGB"
            renderer="colorManagement: true; physicallyCorrectLights: true;"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
            style="width:100%;height:100%;">
            <a-assets>
              <a-asset-item id="natura-model" src="${modelSrc}"></a-asset-item>
            </a-assets>
            <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
            <a-entity mindar-image-target="targetIndex: 0">
              <a-gltf-model src="#natura-model" position="0 0 0" scale="0.6 0.6 0.6"></a-gltf-model>
            </a-entity>
          </a-scene>`;
        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    })();

    return () => {
      active = false;
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [modelSrc, targetSrc]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
      <div ref={ref} className="h-full w-full" />
      {status !== "ready" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center p-6 text-center text-sm text-white/90">
          {status === "loading"
            ? "Memuat mesin AR…"
            : "Gagal memuat AR. Gunakan mode Lihat 3D."}
        </div>
      )}
    </div>
  );
}
