export function formatPrice(amount: number, currency: string = 'USD'): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPpsf(ppsf: number | null): string {
  if (ppsf === null) return 'N/A'
  return `$${Math.round(ppsf).toLocaleString()}/sqft`
}

export function formatSqft(sqft: number | null): string {
  if (sqft === null) return 'N/A'
  return `${sqft.toLocaleString()} sqft`
}

export function formatDeviation(pct: number | null): string {
  if (pct === null) return 'N/A'
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}

export function formatConfidence(c: number): string {
  if (c >= 0.85) return 'High'
  if (c >= 0.6) return 'Medium'
  return 'Low'
}

export function formatScore(score: number): string {
  const abs = Math.abs(score).toFixed(0)
  if (score < 0) return `-${abs}`
  if (score > 0) return `+${abs}`
  return '0'
}
