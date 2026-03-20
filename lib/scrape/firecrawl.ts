import { RawListing } from '../types'

const FIRECRAWL_BASE = 'https://api.firecrawl.dev/v1'

export interface FirecrawlScrapeOptions {
  urls: string[]
  location: string
  propertyType?: string
}

interface FirecrawlResult {
  url: string
  markdown?: string
  metadata?: Record<string, unknown>
}

async function scrapeUrl(url: string, apiKey: string): Promise<FirecrawlResult | null> {
  try {
    const response = await fetch(`${FIRECRAWL_BASE}/scrape`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    })
    if (!response.ok) return null
    const data = await response.json()
    return { url, markdown: data.data?.markdown, metadata: data.data?.metadata }
  } catch {
    return null
  }
}

function parseListingsFromMarkdown(markdown: string, source: string, baseUrl: string): RawListing[] {
  const listings: RawListing[] = []
  const lines = markdown.split('\n')

  const pricePattern = /(?:AED|USD|\$)\s*[\d,]+(?:\.\d+)?(?:\s*[Mm])?/gi
  const sqftPattern = /(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft|SF)/gi

  let currentTitle = ''
  let currentPrice: string = ''
  let currentSqft: string = ''
  let currentLocation = ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('#')) {
      if (currentTitle && currentPrice) {
        listings.push({
          id: `${source}-${listings.length}`,
          title: currentTitle,
          location: currentLocation || 'Dubai',
          source,
          url: baseUrl,
          price: currentPrice,
          currency: currentPrice.includes('AED') ? 'AED' : 'USD',
          sqft: currentSqft || undefined,
        })
      }
      currentTitle = trimmed.replace(/^#+\s*/, '')
      currentPrice = ''
      currentSqft = ''
      currentLocation = ''
    }

    const priceMatch = trimmed.match(pricePattern)
    if (priceMatch && !currentPrice) currentPrice = priceMatch[0]

    const sqftMatch = trimmed.match(sqftPattern)
    if (sqftMatch && !currentSqft) currentSqft = sqftMatch[0]

    if (/dubai|jumeirah|marina|downtown/i.test(trimmed) && !currentLocation) {
      currentLocation = trimmed.split('|')[0].trim()
    }
  }

  if (currentTitle && currentPrice) {
    listings.push({
      id: `${source}-${listings.length}`,
      title: currentTitle,
      location: currentLocation || 'Dubai',
      source,
      url: baseUrl,
      price: currentPrice,
      currency: currentPrice.includes('AED') ? 'AED' : 'USD',
      sqft: currentSqft || undefined,
    })
  }

  return listings
}

export async function scrapeListings(options: FirecrawlScrapeOptions): Promise<RawListing[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) {
    console.warn('[Firecrawl] API key not set. Skipping scrape.')
    return []
  }

  const results = await Promise.all(options.urls.map((url) => scrapeUrl(url, apiKey)))
  const listings: RawListing[] = []

  for (const result of results) {
    if (!result?.markdown) continue
    const source = new URL(result.url).hostname.replace('www.', '')
    const parsed = parseListingsFromMarkdown(result.markdown, source, result.url)
    listings.push(...parsed)
  }

  return listings
}
