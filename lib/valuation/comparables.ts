import { NormalizedListing } from '../types'
import { MIN_COMPARABLES } from './constants'

function getCity(location: string): string {
  return location.split(',').pop()?.trim().toLowerCase() ?? location.toLowerCase()
}

export interface ComparableResult {
  comps: NormalizedListing[]
  comparableCount: number
}

export function findComparables(
  listing: NormalizedListing,
  allListings: NormalizedListing[]
): ComparableResult {
  const others = allListings.filter((l) => l.id !== listing.id && l.pricePerSqft !== null)

  const neighborhood = listing.neighborhood?.toLowerCase()
  const propertyType = listing.propertyType?.toLowerCase()
  const city = getCity(listing.location)

  // Priority 1: same neighborhood + same property type
  if (neighborhood && propertyType) {
    const comps = others.filter(
      (l) =>
        l.neighborhood?.toLowerCase() === neighborhood &&
        l.propertyType?.toLowerCase() === propertyType
    )
    if (comps.length >= MIN_COMPARABLES) return { comps, comparableCount: comps.length }
  }

  // Priority 2: same neighborhood
  if (neighborhood) {
    const comps = others.filter((l) => l.neighborhood?.toLowerCase() === neighborhood)
    if (comps.length >= MIN_COMPARABLES) return { comps, comparableCount: comps.length }
  }

  // Priority 3: same city + same property type
  if (propertyType) {
    const comps = others.filter(
      (l) =>
        getCity(l.location) === city && l.propertyType?.toLowerCase() === propertyType
    )
    if (comps.length >= MIN_COMPARABLES) return { comps, comparableCount: comps.length }
  }

  // Priority 4: same city
  const comps = others.filter((l) => getCity(l.location) === city)
  return { comps, comparableCount: comps.length }
}

export function computeMarketAvg(comps: NormalizedListing[]): number | null {
  const valid = comps.filter((c) => c.pricePerSqft !== null) as (NormalizedListing & {
    pricePerSqft: number
  })[]
  if (valid.length === 0) return null
  const sum = valid.reduce((acc, c) => acc + c.pricePerSqft, 0)
  return sum / valid.length
}
