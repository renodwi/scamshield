# Scam Shield

Scam Shield is a Next.js app for checking suspicious chat text or screenshots with Gemini and showing an Indonesian risk report.

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
