import { INSTRUMENTS } from '../data_store/instruments';

export function getInstrument(type = "csi") {
  return INSTRUMENTS[type] || INSTRUMENTS.csi;
}

export function flattenDimensions(dims) {
  const flat = [];
  dims.forEach(d => {
    if (d.children) {
      flat.push(...d.children);
    } else {
      flat.push(d);
    }
  });
  return flat;
}

export function getSectionInfo(questions) {
  const sections = [];
  let currentSection = null;
  let questionCount = 0;

  questions.forEach((q, idx) => {
    if (!currentSection || q.dimensionName !== currentSection.dimensionName) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        dimensionName: q.dimensionName,
        startIdx: idx,
        endIdx: idx,
        count: 1,
      };
    } else {
      currentSection.endIdx = idx;
      currentSection.count++;
    }
  });
  if (currentSection) sections.push(currentSection);

  return sections;
}

export function computeCSI(dims) {
  const sumMIS = dims.reduce((s, d) => s + d.importance, 0);
  const weighted = dims.reduce((s, d) => s + d.importance * d.performance, 0);
  return ((weighted / (5 * sumMIS)) * 100).toFixed(2);
}

export function csiCategory(score) {
  const s = parseFloat(score);
  if (s >= 81) return { label: "Sangat Puas", color: "#10b981" };
  if (s >= 66) return { label: "Puas", color: "#3b82f6" };
  if (s >= 51) return { label: "Cukup Puas", color: "#eab308" };
  if (s >= 35) return { label: "Kurang Puas", color: "#f97316" };
  return { label: "Tidak Puas", color: "#ef4444" };
}
