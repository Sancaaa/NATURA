export type Question = {
  id: string;
  pertanyaan: string;
  opsi: string[];
  kunci: number; // index opsi yang benar
  pembahasan: string;
};

export type Quiz = {
  id: string;
  judul: string;
  topik: string;
  sumber: "Latihan Mandiri" | "Tugas Guru";
  deadline?: string;
  questions: Question[];
};

export const quizzes: Quiz[] = [
  {
    id: "dasar-simplisia",
    judul: "Kuis: Dasar-Dasar Simplisia",
    topik: "Pengantar Simplisia",
    sumber: "Latihan Mandiri",
    questions: [
      {
        id: "q1",
        pertanyaan: "Simplisia nabati berasal dari...",
        opsi: ["Tumbuhan", "Hewan", "Bahan mineral", "Sintesis kimia"],
        kunci: 0,
        pembahasan:
          "Simplisia nabati adalah simplisia yang berasal dari tumbuhan, baik berupa tanaman utuh maupun bagiannya.",
      },
      {
        id: "q2",
        pertanyaan: "Nama simplisia untuk rimpang kunyit adalah...",
        opsi: [
          "Zingiberis Rhizoma",
          "Curcumae Domesticae Rhizoma",
          "Orthosiphonis Folium",
          "Piperis Folium",
        ],
        kunci: 1,
        pembahasan:
          "Rimpang kunyit (Curcuma longa) memiliki nama simplisia Curcumae Domesticae Rhizoma.",
      },
      {
        id: "q3",
        pertanyaan: "Kandungan utama yang memberi warna kuning pada kunyit adalah...",
        opsi: ["Tanin", "Kurkuminoid", "Saponin", "Alkaloid"],
        kunci: 1,
        pembahasan:
          "Kurkuminoid adalah pigmen kuning sekaligus senyawa aktif utama pada kunyit.",
      },
    ],
  },
  {
    id: "pembuatan-simplisia-kuis",
    judul: "Tugas: Tahapan Pembuatan Simplisia",
    topik: "Pembuatan Simplisia",
    sumber: "Tugas Guru",
    deadline: "3 hari lagi",
    questions: [
      {
        id: "q1",
        pertanyaan:
          "Tahap yang memisahkan kotoran sebelum pencucian disebut...",
        opsi: ["Sortasi kering", "Perajangan", "Sortasi basah", "Pengepakan"],
        kunci: 2,
        pembahasan:
          "Sortasi basah dilakukan sebelum pencucian untuk memisahkan bahan asing dan kotoran.",
      },
      {
        id: "q2",
        pertanyaan: "Tujuan perajangan pada pembuatan simplisia adalah...",
        opsi: [
          "Menambah kadar air",
          "Mempercepat pengeringan",
          "Menghilangkan warna",
          "Menambah berat",
        ],
        kunci: 1,
        pembahasan:
          "Perajangan memperluas permukaan sehingga mempercepat proses pengeringan.",
      },
    ],
  },
];

export const getQuiz = (id: string) => quizzes.find((q) => q.id === id);
