import { RawListing, NormalizedListing, ScoredListing, SortMode } from '../types'
import { normalizeListings } from './normalize'
import { findComparables, computeMarketAvg } from './comparables'
import {
  computeDeviationPct,
  computeValuationScore,
  getValuationLabel,
  getValuationBand,
  adjustConfidence,
} from './score'
import { buildSummaryReason } from './explain'

export function scoreListing(
  listing: NormalizedListing,
  allListings: NormalizedListing[]
): ScoredListing {
  const { comps, comparableCount } = findComparables(listing, allListings)
  const marketAvgPpsf = computeMarketAvg(comps)

  if (listing.pricePerSqft === null || marketAvgPpsf === null) {
    const confidence = adjustConfidence(listing.confidence, comparableCount)
    const label = 'Fairly Priced'
    return {
      ...listing,
      marketAvgPpsf,
      comparableCount,
      deviationPct: null,
      valuationScore: 0,
      valuationLabel: label,
      valuationBand: 'Fair',
      confidence,
      summaryReason: buildSummaryReason(listing, null, label, comparableCount),
    }
  }

  const deviationPct = computeDeviationPct(listing.pricePerSqft, marketAvgPpsf)
  const valuationScore = computeValuationScore(deviationPct)
  const valuationLabel = getValuationLabel(deviationPct)
  const valuationBand = getValuationBand(deviationPct)
  const confidence = adjustConfidence(listing.confidence, comparableCount)
  const summaryReason = buildSummaryReason(listing, deviationPct, valuationLabel, comparableCount)

  return {
    ...listing,
    marketAvgPpsf,
    comparableCount,
    deviationPct,
    valuationScore,
    valuationLabel,
    valuationBand,
    confidence,
    summaryReason,
  }
}

export function scoreListings(rawListings: RawListing[]): ScoredListing[] {
  const normalized = normalizeListings(rawListings)
  return normalized.map((l) => scoreListing(l, normalized))
}

export function sortListings(listings: ScoredListing[], mode: SortMode): ScoredListing[] {
  const sorted = [...listings]
  switch (mode) {
    case 'bestOpportunity':
      return sorted.sort((a, b) => a.valuationScore - b.valuationScore)
    case 'mostOvervalued':
      return sorted.sort((a, b) => b.valuationScore - a.valuationScore)
    case 'neutral':
      return sorted.sort((a, b) => Math.abs(a.valuationScore) - Math.abs(b.valuationScore))
    case 'lowestPrice':
      return sorted.sort((a, b) => a.priceUSD - b.priceUSD)
    case 'highestPrice':
      return sorted.sort((a, b) => b.priceUSD - a.priceUSD)
    default:
      return sorted
  }
}
