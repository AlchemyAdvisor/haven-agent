import { Search } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#1e1e22] bg-[#111113]">
        <Search className="h-7 w-7 text-[#8b8b95]" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#f0f0f2]">Ask the market</h3>
        <p className="mt-1 text-sm text-[#8b8b95]">
          Use the voice orb or type a query to analyze luxury listings.
        </p>
      </div>
    </div>
  )
}
