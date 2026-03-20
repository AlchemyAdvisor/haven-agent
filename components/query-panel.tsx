'use client'

import { useState } from 'react'
import { VoiceOrb } from './voice-orb'
import { Search } from 'lucide-react'
import { clsx } from 'clsx'
import { DEMO_QUERIES } from '@/lib/queries'

interface QueryPanelProps {
  onSubmit: (query: string) => void
  loading: boolean
}

export function QueryPanel({ onSubmit, loading }: QueryPanelProps) {
  const [query, setQuery] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) onSubmit(query.trim())
  }

  function handleTranscript(text: string) {
    setQuery(text)
    onSubmit(text)
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-[#f0f0f2] sm:text-6xl">
        Ask the market.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-[#8b8b95]">
        Voice-search luxury listings, analyze valuation, and hear the answer instantly.
      </p>

      <div className="mt-12 flex flex-col items-center gap-6">
        <VoiceOrb onTranscript={handleTranscript} disabled={loading} />

        <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Find undervalued villas in Palm Jumeirah"
            className="flex-1 rounded-xl border border-[#1e1e22] bg-[#111113] px-4 py-3 text-sm text-[#f0f0f2] placeholder-[#8b8b95] outline-none transition-colors focus:border-[#6366f1]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={clsx(
              'flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all',
              loading || !query.trim()
                ? 'cursor-not-allowed bg-[#6366f1]/40'
                : 'bg-[#6366f1] hover:bg-[#4f52d9]'
            )}
          >
            <Search className="h-4 w-4" />
            Analyze
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-2">
          {DEMO_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => { setQuery(q); onSubmit(q) }}
              disabled={loading}
              className="rounded-full border border-[#1e1e22] bg-[#111113] px-3 py-1.5 text-xs text-[#8b8b95] transition-colors hover:border-[#6366f1]/50 hover:text-[#f0f0f2] disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
