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

const STORAGE_KEY = "scamShieldAnalysisResult";

export function saveAnalysisResult(result: AnalysisResult) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function getAnalysisResult() {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as AnalysisResult;
  } catch {
    return null;
  }
}
