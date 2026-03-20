export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-ping rounded-full bg-[#6366f1]/20" />
        <div className="absolute inset-2 animate-pulse rounded-full bg-[#6366f1]/40" />
        <div className="absolute inset-4 rounded-full bg-[#6366f1]" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#f0f0f2]">Analyzing market…</h3>
        <p className="mt-1 text-sm text-[#8b8b95]">Scraping listings and computing valuations</p>
      </div>
    </div>
  )
}
