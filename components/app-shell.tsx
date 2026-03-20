'use client'

import { useState } from 'react'
import { TopBar } from './top-bar'
import { QueryPanel } from './query-panel'
import { ResponseSummary } from './response-summary'
import { FilterTabs } from './filter-tabs'
import { ResultsGrid } from './results-grid'
import { EmptyState } from './empty-state'
import { LoadingState } from './loading-state'
import { AnalyzeResponse, FilterMode, SortMode } from '@/lib/types'

export function AppShell() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<(AnalyzeResponse & { audioBase64?: string | null }) | null>(null)
  const [filter, setFilter] = useState<FilterMode>('all')
  const [sort, setSort] = useState<SortMode>('bestOpportunity')

  async function handleQuery(query: string) {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, sortMode: sort, useMock: true }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      // silently fail in demo
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <TopBar />
      <main>
        <QueryPanel onSubmit={handleQuery} loading={loading} />
        {loading && <LoadingState />}
        {!loading && !result && <EmptyState />}
        {!loading && result && (
          <div className="flex flex-col gap-6 pb-20">
            <ResponseSummary
              summary={result.summary}
              query={result.query}
              totalFound={result.totalFound}
              marketContext={result.marketContext}
              audioBase64={result.audioBase64}
            />
            <FilterTabs
              filter={filter}
              sort={sort}
              onFilterChange={setFilter}
              onSortChange={(newSort) => {
                setSort(newSort)
              }}
            />
            <ResultsGrid listings={result.listings} filter={filter} />
          </div>
        )}
      </main>
    </div>
  )
}
