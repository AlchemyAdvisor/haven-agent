export interface RawListing {
  id: string
  title: string
  location: string
  neighborhood?: string
  source: string
  url: string
  price: number | string
  currency?: string
  beds?: number
  baths?: number
  sqft?: number | string
  propertyType?: string
}

export interface NormalizedListing extends RawListing {
  priceUSD: number
  sqftNormalized: number | null
  pricePerSqft: number | null
  confidence: number
}

export interface ScoredListing extends NormalizedListing {
  marketAvgPpsf: number | null
  comparableCount: number
  deviationPct: number | null
  valuationScore: number
  valuationLabel: ValuationLabel
  valuationBand: ValuationBand
  summaryReason: string
}

export type ValuationLabel = 'Undervalued' | 'Fairly Priced' | 'Overvalued'
export type ValuationBand =
  | 'Deep Undervalued'
  | 'Undervalued'
  | 'Fair'
  | 'Overvalued'
  | 'Deep Overvalued'

export type SortMode = 'bestOpportunity' | 'mostOvervalued' | 'neutral' | 'lowestPrice' | 'highestPrice'
export type FilterMode = 'all' | 'undervalued' | 'fair' | 'overvalued'

export interface AnalyzeRequest {
  query: string
  listings?: RawListing[]
  sortMode?: SortMode
  useMock?: boolean
}

export interface ParsedQuery {
  location: string
  budget?: number
  propertyType?: string
  raw: string
}

export interface AnalyzeResponse {
  query: ParsedQuery
  listings: ScoredListing[]
  summary: string
  totalFound: number
  marketContext: string
}
