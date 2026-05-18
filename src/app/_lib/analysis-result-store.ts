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

export const fallbackAnalysisResult: AnalysisResult = {
  riskLevel: "medium",
  riskLabel: "Risiko Sedang",
  confidence: 78,
  summary: "Percakapan ini memiliki beberapa indikasi yang perlu diwaspadai.",
  aiExplanation:
    "AI menemukan kombinasi sinyal risiko: instruksi pembayaran di luar kanal resmi, dorongan untuk segera transfer, dan informasi akun yang tidak konsisten. Risiko belum berada di tingkat tertinggi, tetapi transaksi sebaiknya ditunda sampai sumber dan metode pembayaran diverifikasi.",
  findings: [
    {
      title: "Permintaan pembayaran mencurigakan",
      description: "Penjual mengarahkan ke link pembayaran eksternal yang tidak sesuai dengan platform resmi.",
      severity: "high",
    },
    {
      title: "Bahasa urgensi / tekanan",
      description: "Ada indikasi mendorong untuk transfer cepat dengan alasan harga akan naik.",
      severity: "medium",
    },
    {
      title: "Ketidakkonsistenan akun",
      description: "Penolakan COD tanpa alasan jelas dapat menjadi indikasi risiko.",
      severity: "medium",
    },
  ],
  recommendation:
    "Sebaiknya tunda transaksi dan lakukan verifikasi tambahan. Gunakan platform resmi atau metode pembayaran aman, hindari tautan eksternal, dan jangan bagikan data pribadi sebelum identitas pihak lain jelas.",
};

const STORAGE_KEY = "scamShieldAnalysisResult";

export function saveAnalysisResult(result: AnalysisResult) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function getAnalysisResult() {
  if (typeof window === "undefined") return fallbackAnalysisResult;

  const stored = sessionStorage.getItem(STORAGE_KEY);

  if (!stored) return fallbackAnalysisResult;

  try {
    return JSON.parse(stored) as AnalysisResult;
  } catch {
    return fallbackAnalysisResult;
  }
}
