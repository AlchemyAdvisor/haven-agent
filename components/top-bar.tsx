import { MapPin } from 'lucide-react'

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1e1e22] bg-[#0a0a0b]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <span className="text-xl font-bold tracking-tight text-[#f0f0f2]">Haven Agent</span>
        </div>
        <p className="hidden text-sm text-[#8b8b95] sm:block">
          Voice-Driven Market Intelligence
        </p>
        <div className="flex items-center gap-1.5 rounded-full border border-[#1e1e22] bg-[#111113] px-3 py-1.5 text-xs font-medium text-[#8b8b95]">
          <MapPin className="h-3 w-3" />
          Dubai · Live Demo
        </div>
      </div>
    </header>
  )
}
