import {
  UNDERVALUED_THRESHOLD,
  OVERVALUED_THRESHOLD,
  DEEP_UNDERVALUED_THRESHOLD,
  DEEP_OVERVALUED_THRESHOLD,
  SCORE_NORMALIZATION_DIVISOR,
  CONFIDENCE_COMPARABLES,
  COMPARABLES_THRESHOLD,
} from './constants'
import { ValuationBand, ValuationLabel } from '../types'

export function computeDeviationPct(ppsf: number, marketAvg: number): number {
  return ((ppsf - marketAvg) / marketAvg) * 100
}

export function computeValuationScore(deviationPct: number): number {
  const raw = (deviationPct / SCORE_NORMALIZATION_DIVISOR) * 100
  return Math.max(-100, Math.min(100, raw))
}

export function getValuationLabel(deviationPct: number): ValuationLabel {
  if (deviationPct <= UNDERVALUED_THRESHOLD) return 'Undervalued'
  if (deviationPct >= OVERVALUED_THRESHOLD) return 'Overvalued'
  return 'Fairly Priced'
}

export function getValuationBand(deviationPct: number): ValuationBand {
  if (deviationPct <= DEEP_UNDERVALUED_THRESHOLD) return 'Deep Undervalued'
  if (deviationPct <= UNDERVALUED_THRESHOLD) return 'Undervalued'
  if (deviationPct >= DEEP_OVERVALUED_THRESHOLD) return 'Deep Overvalued'
  if (deviationPct >= OVERVALUED_THRESHOLD) return 'Overvalued'
  return 'Fair'
}

export function adjustConfidence(baseConfidence: number, comparableCount: number): number {
  let c = baseConfidence
  if (comparableCount >= COMPARABLES_THRESHOLD) c += CONFIDENCE_COMPARABLES
  return Math.min(1, c)
}
