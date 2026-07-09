export type Student = {
  id: string;
  nama: string;
  progres: number; // 0-100
  skorTerakhir: number; // 0-100
  aktivitasTerakhir: string;
  perluPerhatian: boolean;
};

export type ClassRoom = {
  id: string;
  nama: string;
  tahunAjaran: string;
  kodeGabung: string;
  students: Student[];
};

export const classes: ClassRoom[] = [
  {
    id: "xi-farmasi-a",
    nama: "XI Farmasi A",
    tahunAjaran: "2025/2026",
    kodeGabung: "NAT-4821",
    students: [
      {
        id: "s1",
        nama: "Aisyah Rahma",
        progres: 82,
        skorTerakhir: 90,
        aktivitasTerakhir: "Kuis Dasar Simplisia · hari ini",
        perluPerhatian: false,
      },
      {
        id: "s2",
        nama: "Bagas Pratama",
        progres: 45,
        skorTerakhir: 60,
        aktivitasTerakhir: "AR Kunyit · kemarin",
        perluPerhatian: true,
      },
      {
        id: "s3",
        nama: "Citra Lestari",
        progres: 71,
        skorTerakhir: 85,
        aktivitasTerakhir: "Baca modul Ekstraksi · 2 hari lalu",
        perluPerhatian: false,
      },
      {
        id: "s4",
        nama: "Dimas Saputra",
        progres: 30,
        skorTerakhir: 50,
        aktivitasTerakhir: "Belum mengerjakan tugas",
        perluPerhatian: true,
      },
      {
        id: "s5",
        nama: "Eka Nur Fadhilah",
        progres: 95,
        skorTerakhir: 95,
        aktivitasTerakhir: "Simulasi Lab · hari ini",
        perluPerhatian: false,
      },
    ],
  },
];

export const getClass = (id: string) => classes.find((c) => c.id === id);

export const findStudent = (id: string) => {
  for (const c of classes) {
    const s = c.students.find((st) => st.id === id);
    if (s) return { student: s, kelas: c };
  }
  return undefined;
};

/** Ringkasan untuk kartu dashboard guru. */
export function dashboardSummary() {
  const all = classes.flatMap((c) => c.students);
  const rataSkor = Math.round(
    all.reduce((a, s) => a + s.skorTerakhir, 0) / all.length,
  );
  const rataProgres = Math.round(
    all.reduce((a, s) => a + s.progres, 0) / all.length,
  );
  return {
    totalSiswa: all.length,
    rataSkor,
    rataProgres,
    perluPerhatian: all.filter((s) => s.perluPerhatian).length,
  };
}
