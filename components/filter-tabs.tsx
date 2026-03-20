'use client'

import { FilterMode, SortMode } from '@/lib/types'
import { clsx } from 'clsx'

interface FilterTabsProps {
  filter: FilterMode
  sort: SortMode
  onFilterChange: (f: FilterMode) => void
  onSortChange: (s: SortMode) => void
}

const FILTERS: { label: string; value: FilterMode }[] = [
  { label: 'All', value: 'all' },
  { label: 'Undervalued', value: 'undervalued' },
  { label: 'Fair', value: 'fair' },
  { label: 'Overvalued', value: 'overvalued' },
]

const SORTS: { label: string; value: SortMode }[] = [
  { label: 'Best Opportunity', value: 'bestOpportunity' },
  { label: 'Most Overvalued', value: 'mostOvervalued' },
  { label: 'Lowest Price', value: 'lowestPrice' },
  { label: 'Highest Price', value: 'highestPrice' },
]

export function FilterTabs({ filter, sort, onFilterChange, onSortChange }: FilterTabsProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1 rounded-xl border border-[#1e1e22] bg-[#111113] p-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={clsx(
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              filter === f.value
                ? 'bg-[#6366f1] text-white'
                : 'text-[#8b8b95] hover:text-[#f0f0f2]'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortMode)}
        className="rounded-xl border border-[#1e1e22] bg-[#111113] px-4 py-2.5 text-sm text-[#8b8b95] outline-none focus:border-[#6366f1]"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  )
}
