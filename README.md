# Haven Agent

Voice-Driven Market Intelligence for Luxury Real Estate

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo (no API keys needed)

The app runs fully on mock data by default. Just run `npm run dev` and click a demo query pill.

## Architecture

```
/app/api/analyze/route.ts  — backend analyze endpoint
/lib/valuation/            — pricing engine (pure functions)
/lib/scrape/firecrawl.ts   — Firecrawl scraping (requires key)
/lib/voice/elevenlabs.ts   — ElevenLabs TTS (requires key)
/components/               — UI components
/lib/mock.ts               — demo data
```

## Valuation Formula

```
pricePerSqft = price / sqft
deviationPct = ((listing_ppsf - market_avg_ppsf) / market_avg_ppsf) * 100
valuationScore = clamp((deviationPct / 25) * 100, -100, 100)
```

**Labels:**
- Undervalued: deviationPct ≤ −12%
- Fair: −12% < deviationPct < 12%
- Overvalued: deviationPct ≥ 12%

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ELEVENLABS_API_KEY` | No | Voice output |
| `ELEVENLABS_VOICE_ID` | No | ElevenLabs voice ID |
| `FIRECRAWL_API_KEY` | No | Live web scraping |
| `OPENAI_API_KEY` | No | Whisper transcription |
