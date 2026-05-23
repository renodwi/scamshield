import { createWorker } from "tesseract.js";

// Menjalankan OCR di browser agar teks screenshot bisa ikut dianalisis oleh API.
export async function extractTextFromImage(file: File): Promise<string> {
  const worker = await createWorker("ind+eng");

  try {
    const result = await worker.recognize(file);

    return result.data.text.trim();
  } finally {
    await worker.terminate();
  }
}
