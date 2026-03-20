import { NormalizedListing, ValuationLabel } from '../types'

export function buildSummaryReason(
  listing: NormalizedListing,
  deviationPct: number | null,
  label: ValuationLabel,
  comparableCount: number
): string {
  if (deviationPct === null || listing.pricePerSqft === null) {
    return 'Insufficient data to compute valuation. Missing price-per-sqft.'
  }

  const pct = Math.abs(deviationPct).toFixed(0)
  const propType = listing.propertyType ?? 'properties'
  const area = listing.neighborhood ?? listing.location

  const lowComps =
    comparableCount < 3 ? ' Limited comps available; confidence is reduced.' : ''

  if (label === 'Undervalued') {
    return `Priced ${pct}% below nearby comparable ${propType} in ${area} on a price-per-sqft basis.${lowComps}`
  }
  if (label === 'Overvalued') {
    return `Priced ${pct}% above similar ${propType} in ${area} on a price-per-sqft basis.${lowComps}`
  }
  return `Priced within ${pct}% of the ${area} market average for ${propType}.${lowComps}`
}

export function buildResponseSummary(
  location: string,
  undervaluedCount: number,
  totalCount: number,
  avgDeviation: number | null
): string {
  if (totalCount === 0) {
    return `No listings found for ${location}. Try a different query.`
  }
  if (undervaluedCount === 0) {
    return `I analyzed ${totalCount} listings in ${location}. None appear significantly undervalued based on current comparables.`
  }
  const pct = avgDeviation !== null ? ` trading ${Math.abs(avgDeviation).toFixed(0)}–${(Math.abs(avgDeviation) + 5).toFixed(0)}% below` : ''
  return `I found ${undervaluedCount} undervalued ${undervaluedCount === 1 ? 'property' : 'properties'} in ${location}${pct} the average price per square foot.`
}
