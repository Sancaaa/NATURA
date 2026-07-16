export type Annotation = {
  partKey: string;
  label: string;
  /** Titik pada model (koordinat objek-lokal 3D). */
  pos: [number, number, number];
  /** Ujung garis / posisi label. */
  labelPos: [number, number, number];
  body: string[];
};

/**
 * Anotasi contoh (mode demo / fallback bila DB kosong). Dipindahkan dari
 * viewer.html yang dulu di-hardcode ke sambiloto. Kunci: `${type}:${id}`.
 */
export const seedAnnotations: Record<string, Annotation[]> = {
  "plant:sambiloto": [
    {
      partKey: "daun",
      label: "Daun",
      pos: [0.18, 0.28, 0.1],
      labelPos: [0.22, 0.28, 0],
      body: [
        "Kandungan andrografolid tertinggi — bagian paling berkhasiat.",
        "Berperan sebagai imunomodulator dan penurun demam (antipiretik).",
        "Rasa sangat pahit, ciri khas sambiloto.",
      ],
    },
    {
      partKey: "batang",
      label: "Batang",
      pos: [0, 0.05, 0.1],
      labelPos: [0, 0.5, 0],
      body: [
        "Berbentuk persegi, ciri khas famili Acanthaceae.",
        "Turut mengandung senyawa aktif dengan kadar lebih rendah dari daun.",
      ],
    },
    {
      partKey: "bunga",
      label: "Bunga",
      pos: [-0.16, 0.32, 0.1],
      labelPos: [-0.22, 0.24, 0],
      body: [
        "Bunga kecil berwarna putih keunguan.",
        "Menandai fase generatif (pembungaan) tanaman.",
      ],
    },
  ],
};

export const getSeedAnnotations = (
  type: string,
  id: string,
): Annotation[] => seedAnnotations[`${type}:${id}`] ?? [];
