import { ValuationLabel } from '@/lib/types'
import { clsx } from 'clsx'

interface ValuationBadgeProps {
  label: ValuationLabel
  size?: 'sm' | 'md'
}

const CONFIG: Record<ValuationLabel, { text: string; className: string }> = {
  Undervalued: {
    text: 'Undervalued',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  'Fairly Priced': {
    text: 'Fair',
    className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  Overvalued: {
    text: 'Overvalued',
    className: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  },
}

export function ValuationBadge({ label, size = 'md' }: ValuationBadgeProps) {
  const config = CONFIG[label]
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.className
      )}
    >
      {config.text}
    </span>
  )
}
