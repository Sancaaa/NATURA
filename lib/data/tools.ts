export type LabTool = {
  id: string;
  nama: string;
  fungsi: string;
  caraPakai: string;
  keselamatan: string;
  model3dUrl?: string;
  /** Target MindAR (.mind) untuk mode AR kamera. */
  arTargetUrl?: string;
  /** Paragraf intro yang tampil di overlay AR saat model pertama diketuk. */
  arIntro?: string;
  /** Foto preview untuk kartu jelajah (fallback emoji bila kosong). */
  gambarUrl?: string;
};

export const tools: LabTool[] = [
  {
    id: "mikroskop",
    nama: "Mikroskop",
    fungsi:
      "Mengamati fragmen pengenal simplisia secara mikroskopik untuk identifikasi.",
    caraPakai:
      "Letakkan preparat, atur pembesaran dari perbesaran rendah, fokuskan dengan makro lalu mikrometer.",
    keselamatan:
      "Bawa dengan dua tangan, jaga lensa tetap bersih, jangan menyentuh lensa dengan jari.",
  },
  {
    id: "mortar-stamper",
    nama: "Mortar & Stamper",
    fungsi: "Menghaluskan dan mencampur simplisia atau bahan.",
    caraPakai:
      "Masukkan bahan sedikit demi sedikit, gerus melingkar dengan tekanan merata.",
    keselamatan:
      "Pastikan kering dan bersih; hindari benturan keras yang dapat memecahkan porselen.",
  },
  {
    id: "timbangan-analitik",
    nama: "Timbangan Analitik",
    fungsi: "Menimbang bahan dengan ketelitian tinggi (hingga 0,0001 g).",
    caraPakai:
      "Kalibrasi/nol-kan, gunakan kertas atau wadah timbang, baca setelah angka stabil.",
    keselamatan:
      "Letakkan di meja bebas getaran, tutup kaca saat menimbang, jangan menimbang bahan panas.",
  },
];
