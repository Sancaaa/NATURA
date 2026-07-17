/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Menu siswa direstrukturisasi jadi NatuLab / NatuLearn / NatuBot.
  // Tautan & bookmark lama diteruskan agar tidak mati.
  // Catatan: `/pindai` cocok PERSIS — `/pindai/:id` sengaja tidak diredirect
  // di sini karena id tidak menyiratkan jenis (tanaman vs alat); resolver di
  // app/(student)/pindai/[id]/page.tsx yang menentukan tujuannya.
  async redirects() {
    return [
      { source: "/pindai", destination: "/natulab", permanent: false },
      { source: "/library", destination: "/natulearn/modul", permanent: false },
      {
        source: "/library/:id",
        destination: "/natulearn/modul/:id",
        permanent: false,
      },
      { source: "/kuis", destination: "/natulearn", permanent: false },
      {
        source: "/kuis/:id",
        destination: "/natulearn/kuis/:id",
        permanent: false,
      },
      { source: "/tutor", destination: "/natubot", permanent: false },
      {
        source: "/praktikum/:id",
        destination: "/natulab/praktikum/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
