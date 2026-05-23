export type RiskLevel = "safe" | "low" | "medium" | "high";

export type AnalysisFinding = {
  title: string;
  description: string;
  severity: RiskLevel;
  evidence: string;
};

export type AnalysisResult = {
  riskLevel: RiskLevel;
  riskLabel: string;
  confidence: number;
  summary: string;
  aiExplanation: string;
  findings: AnalysisFinding[];
  recommendation: string;
};

export type AnalysisHistoryEntry = {
  id: string;
  createdAt: string;
  sourceExcerpt: string;
  result: AnalysisResult;
};

export const ANALYSIS_RESULT_STORAGE_KEY = "scamShieldAnalysisResult";
const ANALYSIS_HISTORY_STORAGE_KEY = "scamShieldAnalysisHistory";
const DEVICE_ID_STORAGE_KEY = "scamShieldDeviceId";
const MAX_HISTORY_ENTRIES = 20;

export function saveAnalysisResult(result: AnalysisResult, sourceText = "") {
  if (typeof window === "undefined") return;

  localStorage.setItem(ANALYSIS_RESULT_STORAGE_KEY, JSON.stringify(result));
  saveAnalysisHistoryEntry(result, sourceText);
}

export function getAnalysisResult() {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(ANALYSIS_RESULT_STORAGE_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as AnalysisResult;
  } catch {
    return null;
  }
}

export function getAnalysisHistory() {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(ANALYSIS_HISTORY_STORAGE_KEY);

  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as AnalysisHistoryEntry[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function activateAnalysisHistoryEntry(entry: AnalysisHistoryEntry) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ANALYSIS_RESULT_STORAGE_KEY, JSON.stringify(entry.result));
}

export function deleteAnalysisHistoryEntry(id: string) {
  if (typeof window === "undefined") return;

  const entries = getAnalysisHistory().filter((entry) => entry.id !== id);

  localStorage.setItem(ANALYSIS_HISTORY_STORAGE_KEY, JSON.stringify(entries));
}

export function getAnalysisDeviceId() {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem(DEVICE_ID_STORAGE_KEY);

  if (stored) return stored;

  const generated =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(DEVICE_ID_STORAGE_KEY, generated);

  return generated;
}

function saveAnalysisHistoryEntry(result: AnalysisResult, sourceText: string) {
  const entries = getAnalysisHistory();
  const entry: AnalysisHistoryEntry = {
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    sourceExcerpt: normalizeExcerpt(sourceText),
    result,
  };

  localStorage.setItem(ANALYSIS_HISTORY_STORAGE_KEY, JSON.stringify([entry, ...entries].slice(0, MAX_HISTORY_ENTRIES)));
}

function normalizeExcerpt(value: string) {
  const excerpt = value.replace(/\s+/g, " ").trim();

  return excerpt.slice(0, 180) || "Analisis dari screenshot atau gambar percakapan.";
}
