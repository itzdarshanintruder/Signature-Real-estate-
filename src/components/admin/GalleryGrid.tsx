import { ChevronDown, ChevronUp, Star, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Image } from '@/components/ui/Image'
import { Button } from '@/components/ui/Button'
import type { PlotImage } from '@/types/admin'
import { formatBytes } from '@/utils/formatters'

interface GalleryGridProps {
  images: PlotImage[]
  busyImageId?: string | null
  onDelete: (image: PlotImage) => void
  onSetCover: (image: PlotImage) => void
  onMove: (imageId: string, delta: -1 | 1) => void
}

function TileActions({
  image,
  isFirst,
  isLast,
  disabled,
  onDelete,
  onSetCover,
  onMove,
}: {
  image: PlotImage
  isFirst: boolean
  isLast: boolean
  disabled: boolean
  onDelete: (image: PlotImage) => void
  onSetCover: (image: PlotImage) => void
  onMove: (imageId: string, delta: -1 | 1) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="px-2 text-ink-500 hover:text-gold-700"
        disabled={disabled || isFirst}
        onClick={() => onMove(image.id, -1)}
        aria-label={`Move ${image.fileName} earlier`}
      >
        <ChevronUp className="h-4 w-4" aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="px-2 text-ink-500 hover:text-gold-700"
        disabled={disabled || isLast}
        onClick={() => onMove(image.id, 1)}
        aria-label={`Move ${image.fileName} later`}
      >
        <ChevronDown className="h-4 w-4" aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="px-2 text-ink-500 hover:text-gold-700"
        disabled={disabled || image.isCover}
        onClick={() => onSetCover(image)}
        aria-label={image.isCover ? 'Cover image' : `Set ${image.fileName} as cover`}
      >
        <Star className={`h-4 w-4 ${image.isCover ? 'fill-gold-500 text-gold-500' : ''}`} aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="px-2 text-red-700 hover:text-red-700"
        disabled={disabled}
        onClick={() => onDelete(image)}
        aria-label={`Delete ${image.fileName}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  )
}

/** Responsive preview grid for a plot gallery with reorder / cover / delete. */
export function GalleryGrid({
  images,
  busyImageId,
  onDelete,
  onSetCover,
  onMove,
}: GalleryGridProps) {
  if (images.length === 0) return null

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((image, index) => {
        const isFirst = index === 0
        const isLast = index === images.length - 1
        const busy = busyImageId === image.id
        return (
          <li
            key={image.id}
            className="group relative border border-ink-200 bg-cream-50"
            aria-busy={busy || undefined}
          >
            <div className="relative">
              <Image src={image.url} alt={image.alt ?? image.fileName} aspect="aspect-square" />
              {image.isCover ? (
                <Badge tone="gold" className="absolute top-3 left-3 bg-cream-50/90 shadow-md">
                  <Star className="h-3 w-3 fill-gold-500 text-gold-500" aria-hidden />
                  Cover
                </Badge>
              ) : null}
              {busy ? (
                <div className="absolute inset-0 flex items-center justify-center bg-ink-900/50">
                  <span className="text-xs font-semibold tracking-wider text-cream-50 uppercase">
                    Updating…
                  </span>
                </div>
              ) : null}
            </div>

            <div className="border-t border-ink-200 p-3">
              <p className="truncate text-sm font-semibold text-ink-800" title={image.fileName}>
                {image.fileName}
              </p>
              {image.size ? <p className="mt-0.5 text-xs text-ink-500">{formatBytes(image.size)}</p> : null}

              <div className="mt-2 flex justify-end">
                <TileActions
                  image={image}
                  isFirst={isFirst}
                  isLast={isLast}
                  disabled={Boolean(busyImageId)}
                  onDelete={onDelete}
                  onSetCover={onSetCover}
                  onMove={onMove}
                />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
