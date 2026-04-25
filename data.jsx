// Shared data for Sistem CSI prototype

const DIMENSIONS = [
  {
    id: "tangibles",
    name: "Tangibles",
    desc: "Bukti fisik & fasilitas",
    questions: [
      "Tampilan aplikasi terlihat profesional dan modern",
      "Navigasi mudah dipahami dan jelas",
      "Tata letak informasi rapi dan teratur",
    ],
  },
  {
    id: "reliability",
    name: "Reliability",
    desc: "Keandalan layanan",
    questions: [
      "Sistem berjalan stabil tanpa error",
      "Data yang ditampilkan akurat dan konsisten",
      "Hasil perhitungan dapat dipercaya",
    ],
  },
  {
    id: "responsiveness",
    name: "Responsiveness",
    desc: "Daya tanggap layanan",
    questions: [
      "Aplikasi merespon cepat saat digunakan",
      "Notifikasi muncul tepat waktu",
    ],
  },
  {
    id: "assurance",
    name: "Assurance",
    desc: "Jaminan & kepercayaan",
    questions: [
      "Data pribadi terjamin keamanannya",
      "Kebijakan privasi jelas dan transparan",
    ],
  },
  {
    id: "empathy",
    name: "Empathy",
    desc: "Empati & perhatian",
    questions: [
      "Bantuan tersedia ketika dibutuhkan",
      "Pertanyaan saya dijawab dengan ramah",
    ],
  },
];

// Flatten into 12 questions with weights (importance) — used by survey, admin, dashboard
const QUESTIONS = DIMENSIONS.flatMap((dim, di) =>
  dim.questions.map((q, qi) => ({
    id: `${dim.id}-${qi}`,
    dimensionId: dim.id,
    dimensionName: dim.name,
    text: q,
    importance: [4.6, 4.4, 4.2, 4.5, 4.3, 4.7, 4.1, 4.8, 4.6, 4.4, 4.5, 4.3][di * 3 + qi] || 4.4,
  }))
);

const LIKERT = [
  { value: 1, label: "Sangat Tidak Puas", emoji: "😠", color: "#ef4444" },
  { value: 2, label: "Tidak Puas", emoji: "😟", color: "#f97316" },
  { value: 3, label: "Cukup", emoji: "😐", color: "#a3a3a3" },
  { value: 4, label: "Puas", emoji: "🙂", color: "#3b82f6" },
  { value: 5, label: "Sangat Puas", emoji: "😄", color: "#10b981" },
];

// Dashboard mock data — performance scores per dimension (already aggregated)
const DIM_SCORES = [
  { id: "tangibles", name: "Tangibles", performance: 4.32, importance: 4.40, responses: 312 },
  { id: "reliability", name: "Reliability", performance: 4.55, importance: 4.50, responses: 312 },
  { id: "responsiveness", name: "Responsiveness", performance: 4.18, importance: 4.40, responses: 312 },
  { id: "assurance", name: "Assurance", performance: 4.61, importance: 4.70, responses: 312 },
  { id: "empathy", name: "Empathy", performance: 4.05, importance: 4.40, responses: 312 },
];

// Likert distribution (count of responses by score 1..5)
const SCORE_DISTRIBUTION = [8, 17, 41, 124, 122];

// Realistic Indonesian respondent feedback
const FEEDBACK = [
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

// Word cloud — extracted keywords with frequency
const WORDS = [
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

// Compute CSI score
// CSI = (Σ MIS × MSS) / (5 × Σ MIS) × 100
function computeCSI(dims) {
  const sumMIS = dims.reduce((s, d) => s + d.importance, 0);
  const weighted = dims.reduce((s, d) => s + d.importance * d.performance, 0);
  return ((weighted / (5 * sumMIS)) * 100).toFixed(2);
}

const CSI_SCORE = computeCSI(DIM_SCORES); // ~ 87.x

function csiCategory(score) {
  const s = parseFloat(score);
  if (s >= 81) return { label: "Sangat Puas", color: "#10b981" };
  if (s >= 66) return { label: "Puas", color: "#3b82f6" };
  if (s >= 51) return { label: "Cukup Puas", color: "#eab308" };
  if (s >= 35) return { label: "Kurang Puas", color: "#f97316" };
  return { label: "Tidak Puas", color: "#ef4444" };
}

Object.assign(window, {
  DIMENSIONS, QUESTIONS, LIKERT, DIM_SCORES, SCORE_DISTRIBUTION,
  FEEDBACK, WORDS, CSI_SCORE, csiCategory, computeCSI,
});
