import { ScoredListing, FilterMode } from '@/lib/types'
import { PropertyCard } from './property-card'

interface ResultsGridProps {
  listings: ScoredListing[]
  filter: FilterMode
}

const FILTER_MAP: Record<FilterMode, string | null> = {
  all: null,
  undervalued: 'Undervalued',
  fair: 'Fairly Priced',
  overvalued: 'Overvalued',
}

export function ResultsGrid({ listings, filter }: ResultsGridProps) {
  const filterLabel = FILTER_MAP[filter]
  const filtered = filterLabel
    ? listings.filter((l) => l.valuationLabel === filterLabel)
    : listings

  if (filtered.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-12 text-center">
        <p className="text-[#8b8b95]">No listings match this filter.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((listing) => (
          <PropertyCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
