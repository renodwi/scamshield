import type { AnalysisResult, RiskLevel } from "@/app/_lib/analysis-result-store";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILE_COUNT = 5;
const allowedTypes = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

const analysisSchema = {
  type: "object",
  properties: {
    riskLevel: {
      type: "string",
      enum: ["low", "medium", "high"],
      description: "Overall scam risk level.",
    },
    riskLabel: {
      type: "string",
      description: "Short Indonesian label, for example Risiko Rendah, Risiko Sedang, or Risiko Tinggi.",
    },
    confidence: {
      type: "integer",
      description: "Model confidence percentage from 0 to 100.",
    },
    summary: {
      type: "string",
      description: "One short Indonesian summary sentence for the risk card.",
    },
    aiExplanation: {
      type: "string",
      description: "Clear Indonesian explanation of why the conversation is risky or safe.",
    },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Short Indonesian title of the finding.",
          },
          description: {
            type: "string",
            description: "One Indonesian sentence explaining the finding.",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Finding severity.",
          },
        },
        required: ["title", "description", "severity"],
      },
      description: "Three to five concrete findings.",
    },
    recommendation: {
      type: "string",
      description: "Practical Indonesian recommendation for the user.",
    },
  },
  required: ["riskLevel", "riskLabel", "confidence", "summary", "aiExplanation", "findings", "recommendation"],
};

type GeminiPart =
  | {
      text: string;
    }
  | {
      inlineData: {
        mimeType: string;
        data: string;
      };
    };

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
  error?: {
    message?: string;
  };
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    return Response.json(
      {
        error: "GEMINI_API_KEY belum diatur. Salin .env.example ke .env.local lalu isi API key Gemini Anda.",
      },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const chatText = String(formData.get("chatText") ?? "").trim();
  const files = formData.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);

  if (!chatText && files.length === 0) {
    return Response.json({ error: "Masukkan teks percakapan atau upload gambar terlebih dahulu." }, { status: 400 });
  }

  if (files.length > MAX_FILE_COUNT) {
    return Response.json({ error: "Maksimal upload 5 gambar." }, { status: 400 });
  }

  for (const file of files) {
    if (!allowedTypes.has(file.type)) {
      return Response.json({ error: "Format gambar harus PNG, JPG, JPEG, atau WebP." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "Ukuran tiap gambar maksimal 10MB." }, { status: 400 });
    }
  }

  const parts: GeminiPart[] = [
    {
      text: [
        "Analisis percakapan berikut untuk mendeteksi potensi scam, penipuan, phishing, social engineering, tekanan pembayaran, tautan berbahaya, atau permintaan data pribadi.",
        "Kembalikan hanya JSON yang sesuai schema. Gunakan bahasa Indonesia yang ringkas dan mudah dipahami.",
        chatText ? `Teks percakapan:\n${chatText}` : "Percakapan tersedia sebagai screenshot yang dilampirkan.",
      ].join("\n\n"),
    },
  ];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    parts.push({
      inlineData: {
        mimeType: file.type,
        data: buffer.toString("base64"),
      },
    });
  }

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "Anda adalah analis keamanan digital untuk Scam Shield. Tugas Anda adalah memberi laporan risiko percakapan secara hati-hati, tidak mengada-ada, dan selalu berbentuk JSON.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts,
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseJsonSchema: analysisSchema,
        },
      }),
    },
  );

  const responseBody = (await geminiResponse.json()) as GeminiResponse;

  if (!geminiResponse.ok) {
    return Response.json(
      {
        error: responseBody.error?.message ?? "Gemini gagal memproses analisis.",
      },
      { status: geminiResponse.status },
    );
  }

  const text = responseBody.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;

  if (!text) {
    return Response.json({ error: "Gemini tidak mengembalikan hasil analisis." }, { status: 502 });
  }

  try {
    const parsed = JSON.parse(text) as AnalysisResult;
    return Response.json({ result: normalizeResult(parsed) });
  } catch {
    return Response.json({ error: "Output Gemini bukan JSON valid." }, { status: 502 });
  }
}

function normalizeResult(result: AnalysisResult): AnalysisResult {
  return {
    riskLevel: normalizeRiskLevel(result.riskLevel),
    riskLabel: result.riskLabel || "Risiko Tidak Diketahui",
    confidence: clampConfidence(result.confidence),
    summary: result.summary || "Analisis selesai, tetapi ringkasan belum tersedia.",
    aiExplanation: result.aiExplanation || "AI belum memberikan penjelasan rinci.",
    findings: Array.isArray(result.findings) ? result.findings.slice(0, 5).map(normalizeFinding) : [],
    recommendation: result.recommendation || "Lakukan verifikasi tambahan sebelum melanjutkan percakapan atau transaksi.",
  };
}

function normalizeFinding(finding: AnalysisResult["findings"][number]) {
  return {
    title: finding.title || "Temuan risiko",
    description: finding.description || "Detail temuan belum tersedia.",
    severity: normalizeRiskLevel(finding.severity),
  };
}

function normalizeRiskLevel(value: string): RiskLevel {
  if (value === "low" || value === "medium" || value === "high") return value;

  return "medium";
}

function clampConfidence(value: number) {
  if (!Number.isFinite(value)) return 0;

  return Math.max(0, Math.min(100, Math.round(value)));
}
