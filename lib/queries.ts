import { ParsedQuery } from './types'

const LOCATIONS = [
  'Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Jumeirah',
  'Business Bay', 'DIFC', 'JBR', 'Arabian Ranches', 'Dubai Hills',
  'Bluewaters', 'City Walk', 'Emaar Beachfront', 'Dubai', 'Abu Dhabi',
]

const PROPERTY_TYPES = [
  'villa', 'apartment', 'penthouse', 'townhouse', 'duplex', 'studio',
]

function extractLocation(text: string): string {
  const lower = text.toLowerCase()
  for (const loc of LOCATIONS) {
    if (lower.includes(loc.toLowerCase())) return loc
  }
  return 'Dubai'
}

function extractBudget(text: string): number | undefined {
  const match = text.match(/\$?\s*([\d,.]+)\s*([MmKk]?)\s*(?:million|m|k)?/i)
  if (!match) return undefined
  let value = parseFloat(match[1].replace(/,/g, ''))
  const suffix = match[2].toLowerCase()
  if (suffix === 'm') value *= 1_000_000
  if (suffix === 'k') value *= 1_000
  return value > 0 ? value : undefined
}

function extractPropertyType(text: string): string | undefined {
  const lower = text.toLowerCase()
  for (const type of PROPERTY_TYPES) {
    if (lower.includes(type)) return type
  }
  return undefined
}

export function parseQuery(query: string): ParsedQuery {
  return {
    location: extractLocation(query),
    budget: extractBudget(query),
    propertyType: extractPropertyType(query),
    raw: query,
  }
}

export const DEMO_QUERIES = [
  'Find undervalued villas in Palm Jumeirah',
  'Show overvalued penthouses in Downtown Dubai',
  'Find listings under $5M with pricing edge',
]
