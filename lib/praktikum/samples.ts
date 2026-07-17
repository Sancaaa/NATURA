import type { ScenarioDefinition } from "./types";

// Skenario contoh — 100% DATA. Perhatikan: tak ada satu pun kode React di sini.
// Di produksi, dokumen seperti ini disimpan di kolom `scenarios.definition`
// (jsonb) dan disusun guru/admin lewat editor visual.
//
// Prototype ini menjalankan langkah `info` + `slider-reveal` end-to-end.
// Langkah `drag-drop` disertakan untuk MEMBUKTIKAN degradasi anggun:
// primitifnya belum ada di registry, runner melewatinya dengan rapi.
export const SAMPLE_SCENARIOS: Record<string, ScenarioDefinition> = {
  "mikroskopis-amilum": {
    id: "mikroskopis-amilum",
    judul: "Identifikasi Mikroskopis Serbuk Pati",
    deskripsi:
      "Uji kemurnian serbuk amilum di bawah mikroskop virtual — dari preparat hingga fokus.",
    steps: [
      {
        id: "intro",
        tipe: "info",
        instruksi: "Uji Kemurnian: Mikroskopis Serbuk Pati (Amilum)",
        body: "Sebelum jadi obat, serbuk harus dicek keasliannya di bawah mikroskop. Kamu akan menyiapkan preparat lalu mengamati bentuk khas sel amilum.",
        lanjutLabel: "Mulai praktikum",
      },
      {
        id: "kenali-mikroskop",
        tipe: "model-3d",
        instruksi:
          "Kenali alatnya dulu. Seret untuk memutar model 3D dan amati bagian-bagian mikroskop.",
        modelUrl: "/models/mikroskop.glb", // GLB nyata di public/models
        feedbackBenar: "",
      },
      {
        id: "tetes-air",
        tipe: "tap-target",
        instruksi:
          "Teteskan 1 tetes aquadest ke kaca preparat: ketuk ujung pipet pada titik yang berdenyut.",
        scene: "",
        hotspot: { x: 50, y: 38, r: 9 },
        feedbackBenar: "Setetes aquadest jatuh di kaca preparat.",
      },
      {
        id: "taruh-serbuk",
        tipe: "drag-drop",
        instruksi:
          "Ambil sedikit serbuk pati dengan spatula, lalu seret dan letakkan tepat di atas tetesan air.",
        draggable: "Spatula + serbuk",
        zone: { x: 40, y: 30, w: 20, h: 18 },
        feedbackBenar: "Serbuk menempel di tetesan air.",
      },
      {
        id: "fokus",
        tipe: "slider-reveal",
        instruksi:
          "Preparat sudah di meja mikroskop. Putar pemutar fokus hingga bentuk sel amilum terlihat tajam.",
        min: 0,
        max: 100,
        target: [68, 80],
        caption: "Butir pati: elips konsentris dengan hilus di tengah.",
        feedbackBenar: "Fokus tepat — lanjut",
      },
      {
        id: "amati-amilum",
        tipe: "observe",
        instruksi:
          "Amati bentuk khas butir amilum: butir tunggal dengan lamela konsentris dan hilus. Bandingkan dengan gambar acuan.",
        media: "", // kosong → placeholder; ganti gambar mikroskopis di produksi
        feedbackBenar: "Ciri butir pati asli teramati.",
      },
      {
        id: "hasil",
        tipe: "info",
        instruksi: "Pengamatan selesai.",
        body: "Bentuk butir pati konsentris menandakan serbuk asli dan tidak dicampur bahan lain. Uji kemurnian lulus.",
        lanjutLabel: "Selesai",
      },
    ],
  },
};
