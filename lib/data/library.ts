export type LibraryItem = {
  id: string;
  judul: string;
  tipe: "Modul" | "Artikel" | "Buku";
  penulis: string;
  ringkasan: string;
  /** Konten sederhana (paragraf) untuk mode baca mockup. */
  konten: string[];
  offline: boolean;
};

export const library: LibraryItem[] = [
  {
    id: "pengantar-simplisia",
    judul: "Pengantar Simplisia",
    tipe: "Modul",
    penulis: "Tim Farmakognosi",
    ringkasan:
      "Definisi, penggolongan, dan tata nama simplisia nabati, hewani, dan mineral.",
    offline: true,
    konten: [
      "Simplisia adalah bahan alam yang digunakan sebagai obat dan belum mengalami pengolahan apa pun kecuali dinyatakan lain, umumnya berupa bahan yang dikeringkan.",
      "Berdasarkan asalnya, simplisia dibagi menjadi tiga: simplisia nabati (dari tumbuhan), simplisia hewani (dari hewan), dan simplisia mineral (dari bahan pelikan).",
      "Tata nama simplisia nabati umumnya menggabungkan nama genus/spesies dengan nama bagian tanaman, misalnya Curcumae Domesticae Rhizoma untuk rimpang kunyit.",
      "Mutu simplisia dipengaruhi oleh cara pengumpulan, pengeringan, dan penyimpanan. Simplisia bermutu memenuhi syarat organoleptis, kadar air, dan bebas cemaran.",
    ],
  },
  {
    id: "pembuatan-simplisia",
    judul: "Tahapan Pembuatan Simplisia",
    tipe: "Modul",
    penulis: "Tim Farmakognosi",
    ringkasan:
      "Alur dari pengumpulan bahan hingga penyimpanan simplisia kering.",
    offline: true,
    konten: [
      "Tahapan pembuatan simplisia: pengumpulan bahan, sortasi basah, pencucian, perajangan, pengeringan, sortasi kering, lalu pengepakan dan penyimpanan.",
      "Sortasi basah memisahkan kotoran dan bahan asing sebelum pencucian. Pencucian menggunakan air bersih dan tidak terlalu lama agar zat aktif tidak larut.",
      "Perajangan mempercepat pengeringan. Pengeringan dapat memakai sinar matahari (ditutup kain hitam) atau oven pada suhu terkontrol.",
      "Sortasi kering memisahkan simplisia dari benda asing. Penyimpanan pada wadah tertutup, kering, dan terlindung cahaya menjaga mutu.",
    ],
  },
  {
    id: "metode-ekstraksi",
    judul: "Metode Ekstraksi",
    tipe: "Artikel",
    penulis: "Tim Farmakognosi",
    ringkasan: "Perbandingan maserasi, perkolasi, sokletasi, infusa, dan dekokta.",
    offline: false,
    konten: [
      "Ekstraksi adalah proses penarikan zat aktif dari simplisia menggunakan pelarut yang sesuai.",
      "Maserasi: perendaman simplisia dalam pelarut pada suhu ruang, cocok untuk zat yang tidak tahan panas. Perkolasi: pelarut dialirkan melewati simplisia secara kontinu.",
      "Sokletasi: ekstraksi berulang dengan pelarut yang sama menggunakan alat soklet, efisien untuk pelarut terbatas. Infusa dan dekokta menggunakan air panas dengan lama pemanasan berbeda.",
      "Pemilihan metode bergantung pada sifat zat aktif, ketahanan terhadap panas, dan pelarut yang tersedia.",
    ],
  },
];

export const getLibraryItem = (id: string) =>
  library.find((i) => i.id === id);
