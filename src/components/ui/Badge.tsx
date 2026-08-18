import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type Tone = 'gold' | 'green' | 'muted' | 'dark' | 'red'

const tones: Record<Tone, string> = {
  gold: 'border-gold-500/40 bg-gold-50 text-gold-800',
  green: 'border-emerald-700/30 bg-emerald-50 text-emerald-800',
  muted: 'border-ink-200 bg-cream-50 text-ink-600',
  dark: 'border-cream-50/20 bg-cream-50/10 text-cream-50',
  red: 'border-red-500/30 bg-red-50 text-red-800',
}

interface BadgeProps {
  children: ReactNode
  tone?: Tone
  className?: string
  dot?: boolean
}

export function Badge({ children, tone = 'gold', className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-3 py-1 text-[0.7rem] font-bold tracking-[0.18em] uppercase',
        tones[tone],
        className,
      )}
    >
      {dot ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  )
}
