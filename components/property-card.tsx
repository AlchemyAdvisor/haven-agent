'use client'

import { ScoredListing } from '@/lib/types'
import { formatPrice, formatPpsf, formatDeviation, formatConfidence } from '@/lib/format'
import { ValuationBadge } from './valuation-badge'
import { ExternalLink, Bed, Bath, Square } from 'lucide-react'
import { clsx } from 'clsx'

interface PropertyCardProps {
  listing: ScoredListing
}

export function PropertyCard({ listing }: PropertyCardProps) {
  const deviationColor =
    listing.deviationPct === null
      ? 'text-[#8b8b95]'
      : listing.deviationPct < -12
      ? 'text-emerald-400'
      : listing.deviationPct > 12
      ? 'text-rose-400'
      : 'text-blue-400'

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-[#1e1e22] bg-[#111113] p-5 transition-all duration-200 hover:border-[#2e2e35] hover:shadow-xl hover:shadow-black/30">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-[#f0f0f2]">{listing.title}</h3>
          <p className="mt-0.5 text-sm text-[#8b8b95]">
            {listing.neighborhood ?? listing.location} · {listing.source}
          </p>
        </div>
        <ValuationBadge label={listing.valuationLabel} size="sm" />
      </div>

      {/* Price */}
      <div>
        <div className="text-2xl font-bold text-[#f0f0f2]">
          {formatPrice(listing.priceUSD)}
        </div>
        <div className="mt-1 flex flex-wrap gap-3 text-sm text-[#8b8b95]">
          {listing.beds !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" /> {listing.beds} bd
            </span>
          )}
          {listing.baths !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" /> {listing.baths} ba
            </span>
          )}
          {listing.sqftNormalized !== null && (
            <span className="flex items-center gap-1">
              <Square className="h-3.5 w-3.5" /> {listing.sqftNormalized?.toLocaleString()} sqft
            </span>
          )}
        </div>
      </div>

      {/* Pricing comparison */}
      <div className="rounded-xl border border-[#1e1e22] bg-[#0a0a0b] p-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-[#8b8b95]">Price / sqft</p>
            <p className="font-semibold text-[#f0f0f2]">
              {formatPpsf(listing.pricePerSqft)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8b8b95]">Market avg</p>
            <p className="font-semibold text-[#f0f0f2]">
              {formatPpsf(listing.marketAvgPpsf)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8b8b95]">Deviation</p>
            <p className={clsx('font-semibold', deviationColor)}>
              {formatDeviation(listing.deviationPct)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#8b8b95]">Confidence</p>
            <p className="font-semibold text-[#f0f0f2]">
              {formatConfidence(listing.confidence)}
            </p>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <p className="text-sm leading-relaxed text-[#8b8b95]">{listing.summaryReason}</p>

      {/* CTA */}
      <a
        href={listing.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-[#1e1e22] bg-[#0a0a0b] px-4 py-2.5 text-sm font-medium text-[#f0f0f2] transition-colors hover:border-[#6366f1] hover:text-[#6366f1]"
      >
        View Listing <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}
