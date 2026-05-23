# Scam Shield

Scam Shield is a Next.js app for checking suspicious chat text or screenshots with Gemini and showing an Indonesian risk report.

## Features

- OCR screenshot chat dengan `tesseract.js` sebelum analisis AI.
- Deteksi risiko `safe`, `low`, `medium`, dan `high` dengan evidence per temuan.
- Pemeriksaan awal nomor rekening 10-16 digit dan tautan mencurigakan sebelum dikirim sebagai konteks Gemini.
- Meter confidence 0-100 dengan warna hijau, kuning, dan merah.
- Riwayat analisis lokal untuk membuka kembali hasil terakhir dari browser yang sama.

## Setup

Copy the environment example and fill in your own Gemini key:

```bash
cp .env.example .env.local
```

Required variables:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Do not commit real `.env` files. They are ignored by Git.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

OCR uses `tesseract.js`. Install it if you set up dependencies manually:

```bash
npm install tesseract.js
```

Optional rekening check variables:

```bash
CEKREKENING_API_URL=https://your-check-api.example/check
CEKREKENING_API_KEY=optional_api_key
```

If the rekening API is not configured or unavailable, detected account numbers are treated as not flagged and the main analysis still runs.

## Production Checks

```bash
npm run lint
npm run build
```

## Rate Limiting

`src/app/api/analyze/route.ts` limits analysis requests to 1 request every 10 minutes per IP and browser device id. Adjust these constants if needed:

```ts
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 1;
```

The current limiter is in-memory. For multi-instance or serverless deployments, use shared storage such as Redis, Upstash, or another KV store.
