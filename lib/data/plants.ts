export type Plant = {
  id: string;
  namaLokal: string;
  namaLatin: string;
  familia: string;
  bagianDigunakan: string;
  namaSimplisia: string;
  kandungan: string[];
  khasiat: string;
  makroskopik: string;
  mikroskopik: string;
  /** GLB opsional untuk mode 3D; jika kosong, viewer memakai model prosedural. */
  model3dUrl?: string;
  /** Target MindAR (.mind) untuk mode AR kamera. */
  arTargetUrl?: string;
  /** Paragraf intro yang tampil di overlay AR saat model pertama diketuk. */
  arIntro?: string;
};

export const plants: Plant[] = [
  {
    id: "sambiloto",
    namaLokal: "Sambiloto",
    namaLatin: "Andrographis paniculata (Burm.f.) Wall. ex Nees",
    familia: "Acanthaceae",
    bagianDigunakan: "Herba (bagian di atas tanah)",
    namaSimplisia: "Andrographidis Herba",
    kandungan: ["Andrografolid", "Flavonoid", "Lakton diterpen"],
    khasiat:
      "Imunomodulator, antipiretik, antiinflamasi, dan membantu daya tahan tubuh.",
    makroskopik:
      "Herba kering, batang persegi, daun kecil bertangkai pendek, rasa sangat pahit khas.",
    mikroskopik:
      "Fragmen pengenal: sistolit pada epidermis, stomata tipe diasitik, dan rambut kelenjar.",
    model3dUrl: "/models/samiloto.glb",
    arTargetUrl: "/ar/samiloto.mind",
    arIntro:
      "Herba berasa sangat pahit dari famili Acanthaceae. Simplisianya (Andrographidis Herba) mengandung andrografolid dan dikenal sebagai imunomodulator, antipiretik, serta antiinflamasi. Ketuk label bagian pada model untuk penjelasannya.",
  },
  {
    id: "kunyit",
    namaLokal: "Kunyit",
    namaLatin: "Curcuma longa L.",
    familia: "Zingiberaceae",
    bagianDigunakan: "Rimpang",
    namaSimplisia: "Curcumae Domesticae Rhizoma",
    kandungan: ["Kurkuminoid", "Minyak atsiri", "Pati", "Tanin"],
    khasiat: "Antiinflamasi, hepatoprotektor, karminatif, dan antioksidan.",
    makroskopik:
      "Potongan rimpang berwarna jingga kekuningan, keras, bau khas aromatik, rasa agak pahit dan pedas.",
    mikroskopik:
      "Fragmen pengenal: butir pati, jaringan gabus, sel minyak berwarna kuning, dan berkas pembuluh.",
  },
  {
    id: "jahe",
    namaLokal: "Jahe",
    namaLatin: "Zingiber officinale Roscoe",
    familia: "Zingiberaceae",
    bagianDigunakan: "Rimpang",
    namaSimplisia: "Zingiberis Rhizoma",
    kandungan: ["Gingerol", "Shogaol", "Minyak atsiri (zingiberen)"],
    khasiat: "Karminatif, antiemetik, dan menghangatkan badan.",
    makroskopik:
      "Rimpang pipih, warna kuning pucat, bau khas, rasa pedas menghangatkan.",
    mikroskopik:
      "Fragmen pengenal: butir pati besar, sel sekresi minyak, dan serabut sklerenkim.",
  },
  {
    id: "kumis-kucing",
    namaLokal: "Kumis Kucing",
    namaLatin: "Orthosiphon aristatus (Blume) Miq.",
    familia: "Lamiaceae",
    bagianDigunakan: "Daun",
    namaSimplisia: "Orthosiphonis Folium",
    kandungan: ["Flavonoid (sinensetin)", "Kalium", "Minyak atsiri"],
    khasiat: "Diuretik dan membantu mengatasi batu saluran kemih.",
    makroskopik:
      "Daun tunggal, tepi bergerigi, permukaan agak kasar, warna hijau kecokelatan setelah kering.",
    mikroskopik:
      "Fragmen pengenal: rambut penutup, stomata tipe diasitik, dan kristal kalsium oksalat.",
  },
  {
    id: "sirih",
    namaLokal: "Sirih",
    namaLatin: "Piper betle L.",
    familia: "Piperaceae",
    bagianDigunakan: "Daun",
    namaSimplisia: "Piperis Folium",
    kandungan: ["Minyak atsiri (kavikol, eugenol)", "Tanin", "Flavonoid"],
    khasiat: "Antiseptik, antibakteri, dan astringen.",
    makroskopik:
      "Daun berbentuk jantung, ujung meruncing, bau khas aromatik, rasa agak pedas.",
    mikroskopik:
      "Fragmen pengenal: sel minyak, epidermis dengan stomata, dan berkas pembuluh.",
  },
];
