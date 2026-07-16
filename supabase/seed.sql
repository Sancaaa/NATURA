-- ============================================================
-- NATURA — Data awal (konten master)
-- Jalankan setelah schema.sql. Aman diulang (on conflict do nothing).
-- ============================================================

-- Tanaman -------------------------------------------------------
insert into public.plants
  (id, nama_lokal, nama_latin, familia, bagian_digunakan, nama_simplisia, kandungan, khasiat, makroskopik, mikroskopik, model_3d_url, ar_target_url)
values
  ('sambiloto', 'Sambiloto', 'Andrographis paniculata (Burm.f.) Wall. ex Nees', 'Acanthaceae', 'Herba (bagian di atas tanah)', 'Andrographidis Herba',
    ARRAY['Andrografolid','Flavonoid','Lakton diterpen'],
    'Imunomodulator, antipiretik, antiinflamasi, dan membantu daya tahan tubuh.',
    'Herba kering, batang persegi, daun kecil bertangkai pendek, rasa sangat pahit khas.',
    'Fragmen pengenal: sistolit pada epidermis, stomata tipe diasitik, dan rambut kelenjar.',
    '/models/samiloto.glb', '/ar/samiloto.mind'),
  ('kunyit', 'Kunyit', 'Curcuma longa L.', 'Zingiberaceae', 'Rimpang', 'Curcumae Domesticae Rhizoma',
    ARRAY['Kurkuminoid','Minyak atsiri','Pati','Tanin'],
    'Antiinflamasi, hepatoprotektor, karminatif, dan antioksidan.',
    'Potongan rimpang berwarna jingga kekuningan, keras, bau khas aromatik, rasa agak pahit dan pedas.',
    'Fragmen pengenal: butir pati, jaringan gabus, sel minyak berwarna kuning, dan berkas pembuluh.',
    null, null),
  ('jahe', 'Jahe', 'Zingiber officinale Roscoe', 'Zingiberaceae', 'Rimpang', 'Zingiberis Rhizoma',
    ARRAY['Gingerol','Shogaol','Minyak atsiri (zingiberen)'],
    'Karminatif, antiemetik, dan menghangatkan badan.',
    'Rimpang pipih, warna kuning pucat, bau khas, rasa pedas menghangatkan.',
    'Fragmen pengenal: butir pati besar, sel sekresi minyak, dan serabut sklerenkim.',
    null, null),
  ('kumis-kucing', 'Kumis Kucing', 'Orthosiphon aristatus (Blume) Miq.', 'Lamiaceae', 'Daun', 'Orthosiphonis Folium',
    ARRAY['Flavonoid (sinensetin)','Kalium','Minyak atsiri'],
    'Diuretik dan membantu mengatasi batu saluran kemih.',
    'Daun tunggal, tepi bergerigi, permukaan agak kasar, warna hijau kecokelatan setelah kering.',
    'Fragmen pengenal: rambut penutup, stomata tipe diasitik, dan kristal kalsium oksalat.',
    null, null),
  ('sirih', 'Sirih', 'Piper betle L.', 'Piperaceae', 'Daun', 'Piperis Folium',
    ARRAY['Minyak atsiri (kavikol, eugenol)','Tanin','Flavonoid'],
    'Antiseptik, antibakteri, dan astringen.',
    'Daun berbentuk jantung, ujung meruncing, bau khas aromatik, rasa agak pedas.',
    'Fragmen pengenal: sel minyak, epidermis dengan stomata, dan berkas pembuluh.',
    null, null)
on conflict (id) do nothing;

-- Alat lab ------------------------------------------------------
insert into public.lab_tools (id, nama, fungsi, cara_pakai, keselamatan)
values
  ('mikroskop', 'Mikroskop',
    'Mengamati fragmen pengenal simplisia secara mikroskopik untuk identifikasi.',
    'Letakkan preparat, atur pembesaran dari perbesaran rendah, fokuskan dengan makro lalu mikrometer.',
    'Bawa dengan dua tangan, jaga lensa tetap bersih, jangan menyentuh lensa dengan jari.'),
  ('mortar-stamper', 'Mortar & Stamper',
    'Menghaluskan dan mencampur simplisia atau bahan.',
    'Masukkan bahan sedikit demi sedikit, gerus melingkar dengan tekanan merata.',
    'Pastikan kering dan bersih; hindari benturan keras yang dapat memecahkan porselen.'),
  ('timbangan-analitik', 'Timbangan Analitik',
    'Menimbang bahan dengan ketelitian tinggi (hingga 0,0001 g).',
    'Kalibrasi/nol-kan, gunakan kertas atau wadah timbang, baca setelah angka stabil.',
    'Letakkan di meja bebas getaran, tutup kaca saat menimbang, jangan menimbang bahan panas.')
on conflict (id) do nothing;

-- Library -------------------------------------------------------
insert into public.library_items (id, judul, tipe, penulis, ringkasan, konten, offline)
values
  ('pengantar-simplisia', 'Pengantar Simplisia', 'Modul', 'Tim Farmakognosi',
    'Definisi, penggolongan, dan tata nama simplisia nabati, hewani, dan mineral.',
    ARRAY[
      'Simplisia adalah bahan alam yang digunakan sebagai obat dan belum mengalami pengolahan apa pun kecuali dinyatakan lain, umumnya berupa bahan yang dikeringkan.',
      'Berdasarkan asalnya, simplisia dibagi menjadi tiga: simplisia nabati (dari tumbuhan), simplisia hewani (dari hewan), dan simplisia mineral (dari bahan pelikan).',
      'Tata nama simplisia nabati umumnya menggabungkan nama genus/spesies dengan nama bagian tanaman, misalnya Curcumae Domesticae Rhizoma untuk rimpang kunyit.',
      'Mutu simplisia dipengaruhi oleh cara pengumpulan, pengeringan, dan penyimpanan.'
    ], true),
  ('pembuatan-simplisia', 'Tahapan Pembuatan Simplisia', 'Modul', 'Tim Farmakognosi',
    'Alur dari pengumpulan bahan hingga penyimpanan simplisia kering.',
    ARRAY[
      'Tahapan pembuatan simplisia: pengumpulan bahan, sortasi basah, pencucian, perajangan, pengeringan, sortasi kering, lalu pengepakan dan penyimpanan.',
      'Sortasi basah memisahkan kotoran dan bahan asing sebelum pencucian. Pencucian menggunakan air bersih dan tidak terlalu lama agar zat aktif tidak larut.',
      'Perajangan mempercepat pengeringan. Pengeringan dapat memakai sinar matahari (ditutup kain hitam) atau oven pada suhu terkontrol.',
      'Sortasi kering memisahkan simplisia dari benda asing. Penyimpanan pada wadah tertutup, kering, dan terlindung cahaya menjaga mutu.'
    ], true),
  ('metode-ekstraksi', 'Metode Ekstraksi', 'Artikel', 'Tim Farmakognosi',
    'Perbandingan maserasi, perkolasi, sokletasi, infusa, dan dekokta.',
    ARRAY[
      'Ekstraksi adalah proses penarikan zat aktif dari simplisia menggunakan pelarut yang sesuai.',
      'Maserasi: perendaman simplisia dalam pelarut pada suhu ruang. Perkolasi: pelarut dialirkan melewati simplisia secara kontinu.',
      'Sokletasi: ekstraksi berulang dengan pelarut yang sama menggunakan alat soklet. Infusa dan dekokta menggunakan air panas dengan lama pemanasan berbeda.',
      'Pemilihan metode bergantung pada sifat zat aktif, ketahanan terhadap panas, dan pelarut yang tersedia.'
    ], false)
on conflict (id) do nothing;

-- Kuis + soal ---------------------------------------------------
insert into public.quizzes (id, judul, topik, sumber) values
  ('dasar-simplisia', 'Kuis: Dasar-Dasar Simplisia', 'Pengantar Simplisia', 'Latihan Mandiri'),
  ('pembuatan-simplisia-kuis', 'Tugas: Tahapan Pembuatan Simplisia', 'Pembuatan Simplisia', 'Tugas Guru')
on conflict (id) do nothing;

insert into public.questions (quiz_id, urutan, pertanyaan, opsi, kunci, pembahasan) values
  ('dasar-simplisia', 1, 'Simplisia nabati berasal dari...',
    '["Tumbuhan","Hewan","Bahan mineral","Sintesis kimia"]'::jsonb, 0,
    'Simplisia nabati adalah simplisia yang berasal dari tumbuhan.'),
  ('dasar-simplisia', 2, 'Nama simplisia untuk rimpang kunyit adalah...',
    '["Zingiberis Rhizoma","Curcumae Domesticae Rhizoma","Orthosiphonis Folium","Piperis Folium"]'::jsonb, 1,
    'Rimpang kunyit memiliki nama simplisia Curcumae Domesticae Rhizoma.'),
  ('dasar-simplisia', 3, 'Kandungan utama yang memberi warna kuning pada kunyit adalah...',
    '["Tanin","Kurkuminoid","Saponin","Alkaloid"]'::jsonb, 1,
    'Kurkuminoid adalah pigmen kuning sekaligus senyawa aktif utama pada kunyit.'),
  ('pembuatan-simplisia-kuis', 1, 'Tahap yang memisahkan kotoran sebelum pencucian disebut...',
    '["Sortasi kering","Perajangan","Sortasi basah","Pengepakan"]'::jsonb, 2,
    'Sortasi basah dilakukan sebelum pencucian untuk memisahkan bahan asing.'),
  ('pembuatan-simplisia-kuis', 2, 'Tujuan perajangan pada pembuatan simplisia adalah...',
    '["Menambah kadar air","Mempercepat pengeringan","Menghilangkan warna","Menambah berat"]'::jsonb, 1,
    'Perajangan memperluas permukaan sehingga mempercepat proses pengeringan.')
on conflict do nothing;

-- Intro AR (paragraf overlay) — contoh untuk Sambiloto -----------
update public.plants set ar_intro =
  'Herba berasa sangat pahit dari famili Acanthaceae. Simplisianya (Andrographidis Herba) mengandung andrografolid dan dikenal sebagai imunomodulator, antipiretik, serta antiinflamasi. Ketuk label bagian pada model untuk penjelasannya.'
  where id = 'sambiloto';

-- Titik highlight (anotasi) AR — contoh untuk Sambiloto ----------
-- Idempoten: bersihkan lalu isi ulang agar aman dijalankan berulang.
delete from public.content_annotations
  where subject_type = 'plant' and subject_id = 'sambiloto';
insert into public.content_annotations
  (subject_type, subject_id, urutan, part_key, label,
   pos_x, pos_y, pos_z, label_x, label_y, label_z, body)
values
  ('plant', 'sambiloto', 1, 'daun', 'Daun',
    0.18, 0.28, 0.1, 0.22, 0.28, 0,
    ARRAY[
      'Kandungan andrografolid tertinggi — bagian paling berkhasiat.',
      'Berperan sebagai imunomodulator dan penurun demam (antipiretik).',
      'Rasa sangat pahit, ciri khas sambiloto.'
    ]),
  ('plant', 'sambiloto', 2, 'batang', 'Batang',
    0, 0.05, 0.1, 0, 0.5, 0,
    ARRAY[
      'Berbentuk persegi, ciri khas famili Acanthaceae.',
      'Turut mengandung senyawa aktif dengan kadar lebih rendah dari daun.'
    ]),
  ('plant', 'sambiloto', 3, 'bunga', 'Bunga',
    -0.16, 0.32, 0.1, -0.22, 0.24, 0,
    ARRAY[
      'Bunga kecil berwarna putih keunguan.',
      'Menandai fase generatif (pembungaan) tanaman.'
    ]);
