// ============================================================
// NATURA - Skenario Praktikum (kontrak tipe)
//
// Prinsip: SKENARIO = DATA, bukan kode. Satu skenario adalah daftar
// "langkah" (step). Tiap langkah punya `tipe` yang menunjuk ke satu
// PRIMITIF INTERAKSI yang ditulis SEKALI (lihat components/praktikum).
// Skenario baru = data baru → 0 baris kode baru selama hanya memakai
// primitif yang sudah terdaftar.
//
// Hybrid sejak awal: primitif 2D (tap/drag/slider) dan primitif 3D/AR
// (`model-3d`) hidup di union yang sama. Runner tidak peduli 2D vs 3D -
// ia hanya melihat `tipe` lalu menyerahkannya ke komponen di registry.
// ============================================================

/** Semua jenis interaksi yang dikenal engine. Tambah entri di sini +
 *  daftarkan komponennya di registry untuk memperluas kemampuan. */
export type StepKind =
  | "info" // layar penjelasan / hasil, tombol lanjut
  | "tap-target" // ketuk satu titik benar pada scene (mis. teteskan pipet)
  | "drag-drop" // seret objek A ke zona B (mis. spatula → tetesan)
  | "slider-reveal" // geser slider ke rentang target (mis. fokus mikroskop)
  | "observe" // amati hasil (gambar/animasi), lalu lanjut
  | "model-3d"; // [hybrid] amati objek 3D / marker-AR sebagai satu langkah

interface BaseStep {
  /** unik dalam satu skenario; dipakai untuk menyimpan progres per langkah. */
  id: string;
  tipe: StepKind;
  /** kalimat instruksi yang ditampilkan ke siswa. */
  instruksi: string;
  /** umpan balik singkat saat langkah berhasil (opsional). */
  feedbackBenar?: string;
}

/** Layar teks sederhana (intro, transisi, atau ringkasan hasil). */
export interface InfoStep extends BaseStep {
  tipe: "info";
  body?: string;
  /** label tombol lanjut; default "Lanjut". */
  lanjutLabel?: string;
}

/** Fokus mikroskop: geser slider hingga nilainya masuk `target`,
 *  spesimen berubah dari buram → tajam. */
export interface SliderRevealStep extends BaseStep {
  tipe: "slider-reveal";
  min: number;
  max: number;
  /** rentang [lo, hi] yang dianggap "fokus / tajam". */
  target: [number, number];
  /** URL gambar spesimen. Kosong = pakai placeholder SVG bawaan
   *  (berguna untuk prototype tanpa aset). */
  specimen?: string;
  /** keterangan yang muncul begitu gambar tajam. */
  caption?: string;
}

// --- Primitif lain: kontrak sudah didefinisikan (hybrid), komponennya
// menyusul. Runner akan menampilkan status "belum didukung" dengan rapi
// bila `tipe`-nya belum ada di registry. ---

export interface TapTargetStep extends BaseStep {
  tipe: "tap-target";
  scene: string; // gambar background
  hotspot: { x: number; y: number; r: number }; // persen 0-100
}

export interface DragDropStep extends BaseStep {
  tipe: "drag-drop";
  scene?: string;
  draggable: string;
  zone: { x: number; y: number; w: number; h: number }; // persen 0-100
}

export interface ObserveStep extends BaseStep {
  tipe: "observe";
  media: string;
}

export interface Model3DStep extends BaseStep {
  tipe: "model-3d";
  /** membungkus ModelViewer.tsx yang sudah ada (3D), atau viewer AR marker. */
  modelUrl: string;
  arTargetUrl?: string;
}

/** Union semua langkah - inilah "bahasa" skenario. */
export type ScenarioStep =
  | InfoStep
  | SliderRevealStep
  | TapTargetStep
  | DragDropStep
  | ObserveStep
  | Model3DStep;

/** Dokumen skenario utuh. Di produksi ini disimpan sebagai kolom
 *  `scenarios.definition` (jsonb). Untuk prototype: literal di samples.ts. */
export interface ScenarioDefinition {
  id: string;
  judul: string;
  deskripsi?: string;
  thumbnail?: string;
  steps: ScenarioStep[];
}

/** Kontrak yang dipenuhi SETIAP primitif interaksi. Satu-satunya cara
 *  komponen langkah berbicara ke runner: panggil `onComplete()` saat
 *  syarat lulus terpenuhi. */
export interface StepProps<T extends ScenarioStep = ScenarioStep> {
  step: T;
  onComplete: () => void;
}
