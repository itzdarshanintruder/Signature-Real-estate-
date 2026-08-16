import { Images, MapPin, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { useIsDesktop } from '@/hooks/use-media-query'
import type { Plot } from '@/types/admin'
import { formatCurrencyInr, formatSqFt, formatUpdatedAt } from '@/utils/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface PlotTableProps {
  plots: Plot[]
  onEdit: (plot: Plot) => void
  onManageGallery: (plot: Plot) => void
  onDelete: (plot: Plot) => void
}

function ImageCount({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Images className="h-4 w-4 text-ink-400" aria-hidden />
      <span>
        {count} {count === 1 ? 'image' : 'images'}
      </span>
    </span>
  )
}

function RowActions({
  plot,
  onEdit,
  onManageGallery,
  onDelete,
}: {
  plot: Plot
  onEdit: (plot: Plot) => void
  onManageGallery: (plot: Plot) => void
  onDelete: (plot: Plot) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={() => onEdit(plot)}>
        <Pencil className="h-3.5 w-3.5" aria-hidden />
        Edit
      </Button>
      <Button variant="secondary" size="sm" onClick={() => onManageGallery(plot)}>
        <Images className="h-3.5 w-3.5" aria-hidden />
        Gallery
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(plot)}
        className="text-red-700 hover:text-red-700"
        aria-label={`Delete ${plot.name}`}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  )
}

function PlotRow({
  plot,
  onEdit,
  onManageGallery,
  onDelete,
}: {
  plot: Plot
  onEdit: (plot: Plot) => void
  onManageGallery: (plot: Plot) => void
  onDelete: (plot: Plot) => void
}) {
  return (
    <tr className="border-b border-ink-200 last:border-b-0 transition-colors hover:bg-gold-50">
      <td className="px-4 py-4">
        <p className="font-semibold text-ink-900">{plot.name}</p>
        <p className="text-xs text-ink-400">Plot {plot.plotNumber}</p>
      </td>
      <td className="px-4 py-4 text-sm text-ink-600">{plot.location}</td>
      <td className="px-4 py-4 text-sm whitespace-nowrap text-ink-600">
        {formatSqFt(plot.area)}
      </td>
      <td className="px-4 py-4 text-sm font-semibold whitespace-nowrap text-ink-900">
        {formatCurrencyInr(plot.price)}
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={plot.status} />
      </td>
      <td className="px-4 py-4 text-sm text-ink-600">
        <ImageCount count={plot.gallery.length} />
      </td>
      <td className="px-4 py-4 text-sm whitespace-nowrap text-ink-500">
        {formatUpdatedAt(plot.updatedAt)}
      </td>
      <td className="px-4 py-4">
        <RowActions plot={plot} onEdit={onEdit} onManageGallery={onManageGallery} onDelete={onDelete} />
      </td>
    </tr>
  )
}

/** Desktop / tablet: table layout; mobile: card layout. Only one is rendered. */
export function PlotTable({ plots, onEdit, onManageGallery, onDelete }: PlotTableProps) {
  const isDesktop = useIsDesktop()

  const renderRow = { onEdit, onManageGallery, onDelete }

  if (isDesktop) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse border border-ink-200 bg-cream-50">
          <thead>
            <tr className="bg-ink-900 text-left text-cream-50">
              {[
                'Name',
                'Location',
                'Area',
                'Price',
                'Status',
                'Gallery',
                'Last updated',
                'Actions',
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plots.map((plot) => (
              <PlotRow
                key={plot.id}
                plot={plot}
                onEdit={onEdit}
                onManageGallery={onManageGallery}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <ul className="space-y-4">
      {plots.map((plot) => (
        <li key={plot.id} className="border border-ink-200 bg-cream-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg text-ink-900">{plot.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                <MapPin className="h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                {plot.location}
              </p>
            </div>
            <StatusBadge status={plot.status} />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-200 pt-4 text-sm">
            <div>
              <dt className="text-xs font-bold tracking-[0.14em] text-ink-400 uppercase">Plot</dt>
              <dd className="mt-1 text-ink-700">{plot.plotNumber}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-[0.14em] text-ink-400 uppercase">Area</dt>
              <dd className="mt-1 text-ink-700">{formatSqFt(plot.area)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-[0.14em] text-ink-400 uppercase">Price</dt>
              <dd className="mt-1 font-semibold text-ink-900">{formatCurrencyInr(plot.price)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-[0.14em] text-ink-400 uppercase">Gallery</dt>
              <dd className="mt-1">
                <ImageCount count={plot.gallery.length} />
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink-200 pt-4">
            <Badge tone="muted">Updated {formatUpdatedAt(plot.updatedAt)}</Badge>
            <RowActions {...renderRow} plot={plot} />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Skeleton mirror of the plot table shown while loading. */
export function PlotTableSkeleton() {
  return (
    <div className="overflow-hidden border border-ink-200 bg-cream-50">
      <div className="grid grid-cols-8 gap-4 border-b border-ink-200 bg-ink-900 px-4 py-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-16 bg-cream-50/20" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-8 gap-4 border-b border-ink-200 px-4 py-4 last:border-b-0">
          {Array.from({ length: 8 }).map((_, cellIndex) => (
            <Skeleton key={cellIndex} className="h-3 bg-ink-200/70" />
          ))}
        </div>
      ))}
    </div>
  )
}
