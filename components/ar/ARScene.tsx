"use client";

/**
 * Mode AR: memuat halaman AR mandiri (public/ar/viewer.html) di dalam iframe.
 * Pendekatan iframe mengisolasi A-Frame + MindAR dari siklus hidup React
 * (StrictMode/hydration) dan memakai versi yang terbukti bekerja (A-Frame 1.5.0).
 *
 * `allow="camera"` wajib agar iframe boleh mengakses kamera.
 * Aset (target .mind & model .glb) dikirim lewat query string.
 */
export default function ARScene({
  modelSrc = "/models/samiloto.glb",
  targetSrc = "/ar/samiloto.mind",
}: {
  modelSrc?: string;
  targetSrc?: string;
}) {
  const src = `/ar/viewer.html?target=${encodeURIComponent(
    targetSrc,
  )}&model=${encodeURIComponent(modelSrc)}`;

  return (
    <iframe
      src={src}
      title="AR NATURA"
      allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking"
      className="h-full w-full rounded-2xl border-0 bg-black"
    />
  );
}
