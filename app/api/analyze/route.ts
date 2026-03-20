import { NextRequest, NextResponse } from 'next/server'
import { AnalyzeRequest, AnalyzeResponse } from '@/lib/types'
import { scoreListings, sortListings } from '@/lib/valuation/index'
import { parseQuery } from '@/lib/queries'
import { buildResponseSummary } from '@/lib/valuation/explain'
import { textToSpeech } from '@/lib/voice/elevenlabs'
import { scrapeListings } from '@/lib/scrape/firecrawl'
import { MOCK_RAW_LISTINGS } from '@/lib/mock'

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json()
    const { query, sortMode = 'bestOpportunity', useMock = true } = body

    const parsed = parseQuery(query)

    let rawListings = body.listings ?? []

    if (rawListings.length === 0) {
      if (!useMock && process.env.FIRECRAWL_API_KEY) {
        const urls = [
          `https://www.propertyfinder.ae/en/search#locationIds=Dubai`,
          `https://www.sothebysrealty.ae/eng/sales/dubai`,
        ]
        rawListings = await scrapeListings({
          urls,
          location: parsed.location,
          propertyType: parsed.propertyType,
        })
      }

      if (rawListings.length === 0) {
        rawListings = MOCK_RAW_LISTINGS
      }
    }

    const scored = scoreListings(rawListings)
    const sorted = sortListings(scored, sortMode)

    const undervalued = sorted.filter((l) => l.valuationLabel === 'Undervalued')
    const avgDev =
      undervalued.length > 0
        ? undervalued.reduce((acc, l) => acc + (l.deviationPct ?? 0), 0) / undervalued.length
        : null

    const summary = buildResponseSummary(parsed.location, undervalued.length, sorted.length, avgDev)

    const listingsWithPpsf = sorted.filter((l) => l.marketAvgPpsf !== null)
    const marketAvgPpsf =
      listingsWithPpsf.length > 0
        ? listingsWithPpsf.reduce((acc, l) => acc + (l.marketAvgPpsf ?? 0), 0) / listingsWithPpsf.length
        : 0

    const marketContext = `Market avg PPSF in ${parsed.location}: $${marketAvgPpsf.toFixed(0)}/sqft`

    let audioBase64: string | null = null
    if (process.env.ELEVENLABS_API_KEY) {
      const audioBuffer = await textToSpeech(summary)
      if (audioBuffer) {
        audioBase64 = Buffer.from(audioBuffer).toString('base64')
      }
    }

    const response: AnalyzeResponse & { audioBase64?: string | null } = {
      query: parsed,
      listings: sorted,
      summary,
      totalFound: sorted.length,
      marketContext,
      audioBase64,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[analyze]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
