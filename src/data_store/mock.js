import { computeCSI } from '../utils/calculator';

export const DIM_SCORES = [
  { id: "tangibles", name: "Tangibles", performance: 4.32, importance: 4.40, responses: 312 },
  { id: "reliability", name: "Reliability", performance: 4.55, importance: 4.50, responses: 312 },
  { id: "responsiveness", name: "Responsiveness", performance: 4.18, importance: 4.40, responses: 312 },
  { id: "assurance", name: "Assurance", performance: 4.61, importance: 4.70, responses: 312 },
  { id: "empathy", name: "Empathy", performance: 4.05, importance: 4.40, responses: 312 },
];

export const SCORE_DISTRIBUTION = [8, 17, 41, 124, 122];

export const FEEDBACK = [
  { name: "Budi Santoso", role: "Mahasiswa, Bandung", score: 5, text: "Aplikasi sangat membantu! Tampilan modern dan mudah digunakan. Datanya juga lengkap." },
  { name: "Siti Nurhaliza", role: "Dosen, Yogyakarta", score: 4, text: "Visualisasi dashboard-nya keren. Tapi load awalnya agak lama, mungkin bisa dioptimalkan." },
  { name: "Ahmad Rizky Pratama", role: "Peneliti, Jakarta", score: 5, text: "Akhirnya ada tools CSI yang user-friendly. Bobot importance bisa diatur, mantap." },
  { name: "Dewi Lestari", role: "Konsultan, Surabaya", score: 4, text: "Bagus untuk laporan klien. Mungkin tambahkan export ke PowerPoint juga?" },
  { name: "Rendi Kurniawan", role: "Mahasiswa S2, Malang", score: 5, text: "Hasil perhitungannya valid, sudah saya cocokkan dengan SPSS. Recommended!" },
  { name: "Putri Maharani", role: "Marketing, Bali", score: 3, text: "Cukup oke, tapi UI form survey-nya bisa lebih responsive di HP." },
  { name: "Joko Widodo", role: "Analis Data, Semarang", score: 5, text: "Diagram dimensi sangat informatif. Saya pakai untuk riset internal kantor." },
  { name: "Maya Anggraini", role: "QA Lead, Tangerang", score: 4, text: "Suka banget sama efek glass-nya. Smooth dan tidak berat di laptop saya." },
  { name: "Bagus Setiawan", role: "Mahasiswa, Depok", score: 4, text: "Fitur drag & drop di admin keren. Cuma typo di beberapa label." },
  { name: "Indah Permata Sari", role: "HR Manager, Bekasi", score: 5, text: "Cocok dipakai untuk survey kepuasan karyawan juga. Fleksibel!" },
];

export const WORDS = [
  { w: "mudah", n: 48 },
  { w: "modern", n: 42 },
  { w: "informatif", n: 36 },
  { w: "akurat", n: 33 },
  { w: "responsif", n: 28 },
  { w: "lengkap", n: 24 },
  { w: "smooth", n: 22 },
  { w: "user-friendly", n: 21 },
  { w: "valid", n: 19 },
  { w: "fleksibel", n: 17 },
  { w: "rapi", n: 15 },
  { w: "stabil", n: 14 },
  { w: "intuitif", n: 13 },
  { w: "profesional", n: 12 },
  { w: "ringan", n: 10 },
  { w: "jelas", n: 18 },
  { w: "lambat", n: 8 },
  { w: "typo", n: 5 },
  { w: "bug", n: 4 },
  { w: "rekomendasi", n: 11 },
];

export const CSI_SCORE = computeCSI(DIM_SCORES);
