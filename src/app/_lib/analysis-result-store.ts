export type RiskLevel = "low" | "medium" | "high";

export type AnalysisFinding = {
  title: string;
  description: string;
  severity: RiskLevel;
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

export const ANALYSIS_RESULT_STORAGE_KEY = "scamShieldAnalysisResult";
const DEVICE_ID_STORAGE_KEY = "scamShieldDeviceId";

export function saveAnalysisResult(result: AnalysisResult) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ANALYSIS_RESULT_STORAGE_KEY, JSON.stringify(result));
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
