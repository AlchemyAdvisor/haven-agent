import { RawListing, NormalizedListing } from '../types'
import {
  BASE_CONFIDENCE,
  CONFIDENCE_NEIGHBORHOOD,
  CONFIDENCE_PROPERTY_TYPE,
  CONFIDENCE_SQFT,
  AED_TO_USD,
} from './constants'

function parseNumeric(value: number | string | undefined | null): number | null {
  if (value === undefined || value === null) return null
  if (typeof value === 'number') return isNaN(value) ? null : value
  const cleaned = String(value).replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

function convertToUSD(price: number, currency: string = 'USD'): number {
  const upper = currency.toUpperCase()
  if (upper === 'AED') return price * AED_TO_USD
  return price
}

function computeBaseConfidence(listing: RawListing): number {
  let score = BASE_CONFIDENCE
  if (listing.neighborhood) score += CONFIDENCE_NEIGHBORHOOD
  if (listing.propertyType) score += CONFIDENCE_PROPERTY_TYPE
  return score
}

export function normalizeListing(listing: RawListing): NormalizedListing {
  const rawPrice = parseNumeric(listing.price)
  const priceUSD = rawPrice !== null ? convertToUSD(rawPrice, listing.currency ?? 'USD') : 0
  const sqftNormalized = parseNumeric(listing.sqft)
  const pricePerSqft =
    priceUSD > 0 && sqftNormalized !== null && sqftNormalized > 0
      ? priceUSD / sqftNormalized
      : null

  let confidence = computeBaseConfidence(listing)
  if (sqftNormalized !== null) confidence += CONFIDENCE_SQFT
  confidence = Math.min(1, confidence)

  return {
    ...listing,
    priceUSD,
    sqftNormalized,
    pricePerSqft,
    confidence,
  }
}

export function normalizeListings(listings: RawListing[]): NormalizedListing[] {
  return listings.map(normalizeListing)
}
