import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { buttonStyles } from '@/components/ui/button-styles'
import type { AvailablePlot, PlotAvailability } from '@/types/project'
import { formatCurrencyInr } from '@/utils/formatters'

const AVAILABILITY: Record<PlotAvailability, { label: string; tone: 'gold' | 'muted' | 'dark' }> = {
  available: { label: 'Available', tone: 'gold' },
  reserved: { label: 'Reserved', tone: 'muted' },
  sold: { label: 'Sold', tone: 'dark' },
}

interface PlotCardProps {
  plot: AvailablePlot
}

/** Luxury plot card — area, dimensions, facing, availability and a CTA. */
export function PlotCard({ plot }: PlotCardProps) {
  const availability = AVAILABILITY[plot.status]
  const unavailable = plot.status !== 'available'

  return (
    <article
      className={
        'flex flex-col border border-ink-200 bg-cream-50 p-6 transition-colors duration-300 ' +
        (unavailable ? 'opacity-75' : 'hover:border-gold-500/50')
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
            Plot
          </p>
          <p className="mt-1 font-display text-3xl text-ink-900">{plot.size}</p>
          <p className="mt-1 text-sm text-ink-500">{plot.dimensions}</p>
        </div>
        <Badge tone={availability.tone}>{availability.label}</Badge>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-ink-600">
        <Compass className="h-4 w-4 text-gold-600" aria-hidden />
        Facing · <span className="font-semibold text-ink-800">{plot.facing}</span>
      </div>

      <div className="hairline-gold mt-6 opacity-40" aria-hidden />

      <div className="mt-5">
        <p className="text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
          Price
        </p>
        <p className="mt-1 font-display text-2xl font-semibold text-gold-700">
          {formatCurrencyInr(plot.priceInr)}
        </p>
      </div>

      <div className="mt-6 flex-1" />
      {plot.status === 'available' ? (
        <Link to="/contact" className={buttonStyles('primary', 'md', 'w-full')}>
          Enquire Now
        </Link>
      ) : plot.status === 'reserved' ? (
        <Link to="/contact" className={buttonStyles('secondary', 'md', 'w-full')}>
          Join Waitlist
        </Link>
      ) : (
        <button type="button" disabled className={buttonStyles('secondary', 'md', 'w-full')}>
          Sold
        </button>
      )}
    </article>
  )
}
