const CSI_DIMENSIONS = [
  { id: "tangibles", name: "Tangibles", desc: "Bukti fisik & fasilitas" },
  { id: "reliability", name: "Reliability", desc: "Keandalan layanan" },
  { id: "responsiveness", name: "Responsiveness", desc: "Daya tanggap layanan" },
  { id: "assurance", name: "Assurance", desc: "Jaminan & kepercayaan" },
  { id: "empathy", name: "Empathy", desc: "Empati & perhatian" },
];

const CSI_QUESTIONS = [
  { dimensionId: "tangibles", dimensionName: "Tangibles", text: "Tampilan aplikasi terlihat profesional dan modern", importance: 4.6 },
  { dimensionId: "reliability", dimensionName: "Reliability", text: "Sistem berjalan stabil tanpa error", importance: 4.5 },
].map((q, i) => ({ ...q, id: `csi-${i}` }));

const YES_DIMENSIONS = [
  { id: "tangibles", name: "Tangibles", desc: "Bukti Fisik (Lokasi, Fasilitas, Materi, Atribut, Dana)" },
  { id: "reliability", name: "Reliability", desc: "Keandalan (Jadwal, Dana, Administrasi, Sistem)" },
  { id: "responsiveness", name: "Responsiveness", desc: "Ketanggapan (Mentor, Pengelola, Support)" },
  { id: "assurance", name: "Assurance", desc: "Jaminan (Seleksi, Kompetensi, Privasi, Metode)" },
  { id: "empathy", name: "Empathy", desc: "Empati (Kepedulian, Kenyamanan, Monitoring, Home Visit)" },
];

const YES_QUESTIONS = [
  { dimensionId: "tangibles", dimensionName: "Tangibles", text: "Lokasi kegiatan pembinaan reguler sangat mudah untuk dijangkau.", importance: 4.3 },
  { dimensionId: "reliability", dimensionName: "Reliability", text: "Seluruh jadwal kegiatan program dilaksanakan secara tepat waktu.", importance: 4.5 },
].map((q, i) => ({ ...q, id: `yes-${i}` }));

export const INSTRUMENTS = {
  csi: {
    id: "csi",
    name: "CSI Standard",
    description: "Customer Satisfaction Index - Standar",
    dimensions: CSI_DIMENSIONS,
    questions: CSI_QUESTIONS,
  },
  yes: {
    id: "yes",
    name: "CSI YES",
    description: "Customer Satisfaction Index - Youth Ekselensia Scholarship",
    dimensions: YES_DIMENSIONS,
    questions: YES_QUESTIONS,
  },
};

export const DIMENSIONS = CSI_DIMENSIONS;
export const QUESTIONS = CSI_QUESTIONS;

export const LIKERT_PERFORMANCE = [
  { value: 1, label: "Sangat Tidak Puas", emoji: "😠", color: "#ef4444" },
  { value: 2, label: "Tidak Puas", emoji: "😟", color: "#f97316" },
  { value: 3, label: "Cukup", emoji: "😐", color: "#a3a3a3" },
  { value: 4, label: "Puas", emoji: "🙂", color: "#3b82f6" },
  { value: 5, label: "Sangat Puas", emoji: "😄", color: "#10b981" },
];

export const LIKERT_IMPORTANCE = [
  { value: 1, label: "Sangat Tidak Penting", emoji: "😒", color: "#ef4444" },
  { value: 2, label: "Tidak Penting", emoji: "🙁", color: "#f97316" },
  { value: 3, label: "Cukup Penting", emoji: "😐", color: "#a3a3a3" },
  { value: 4, label: "Penting", emoji: "🙂", color: "#3b82f6" },
  { value: 5, label: "Sangat Penting", emoji: "😍", color: "#10b981" },
];

export const LIKERT_YES = [
  { value: 1, label: "Sangat Tidak Setuju", emoji: "😠", color: "#ef4444" },
  { value: 2, label: "Tidak Setuju", emoji: "😟", color: "#f97316" },
  { value: 3, label: "Setuju", emoji: "😐", color: "#a3a3a3" },
  { value: 4, label: "Sangat Setuju", emoji: "🙂", color: "#3b82f6" },
  { value: 5, label: "Tidak Tahu / Belum Mengalami", emoji: "🤔", color: "#8b5cf6" },
];

export const LIKERT_YES_PERFORMANCE = [
  { value: 1, label: "Sangat Tidak Setuju", emoji: "😠", color: "#ef4444" },
  { value: 2, label: "Tidak Setuju", emoji: "😟", color: "#f97316" },
  { value: 3, label: "Setuju", emoji: "😐", color: "#a3a3a3" },
  { value: 4, label: "Sangat Setuju", emoji: "🙂", color: "#3b82f6" },
  { value: 5, label: "Sangat Setuju Sekali", emoji: "😄", color: "#10b981" },
];

export const LIKERT_YES_IMPORTANCE = [
  { value: 1, label: "Sangat Tidak Penting", emoji: "😒", color: "#ef4444" },
  { value: 2, label: "Tidak Penting", emoji: "🙁", color: "#f97316" },
  { value: 3, label: "Cukup Penting", emoji: "😐", color: "#a3a3a3" },
  { value: 4, label: "Penting", emoji: "🙂", color: "#3b82f6" },
  { value: 5, label: "Sangat Penting", emoji: "😍", color: "#10b981" },
];

export const LIKERT = LIKERT_PERFORMANCE;

export const DEVICE_SIZES = {
  desktop: { width: "100%", label: "Desktop", icon: "🖥️" },
  tablet: { width: "768px", label: "Tablet", icon: "📱" },
  mobile: { width: "375px", label: "Mobile", icon: "📲" },
};
