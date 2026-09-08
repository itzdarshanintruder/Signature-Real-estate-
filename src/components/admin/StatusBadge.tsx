import { Badge } from '@/components/ui/Badge'
import { PLOT_STATUS_LABELS, type PlotStatus } from '@/types/admin'

const tones: Record<PlotStatus, 'green' | 'dark' | 'gold' | 'muted'> = {
  available: 'green',
  sold: 'dark',
  reserved: 'gold',
  'coming-soon': 'muted',
}

/** Lifecycle badge for a plot status. */
export function StatusBadge({ status, className }: { status: PlotStatus; className?: string }) {
  return (
    <Badge tone={tones[status]} className={className} dot>
      {PLOT_STATUS_LABELS[status]}
    </Badge>
  )
}
