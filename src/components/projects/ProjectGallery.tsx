import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ZoomIn } from 'lucide-react'
import { Image } from '@/components/ui/Image'
import { Modal } from '@/components/ui/Modal'
import type { ImageAsset } from '@/types/content'
import { cn } from '@/utils/cn'

interface ProjectGalleryProps {
  images: ImageAsset[]
  projectName: string
}

/**
 * Responsive image gallery with hover zoom and an accessible lightbox
 * (keyboard arrows, ESC, counter, captions). Lazy-loaded images.
 */
export function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
  const [active, setActive] = useState<number | null>(null)
  const count = images.length

  useEffect(() => {
    if (active === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActive((current) => (current === null ? current : (current + 1) % count))
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActive((current) => (current === null ? current : (current - 1 + count) % count))
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active, count])

  const current = active === null ? null : images[active]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {images.map((image, index) => (
        <button
          key={`${image.alt}-${index}`}
          type="button"
          onClick={() => setActive(index)}
          aria-label={`Open gallery image ${index + 1} of ${count}: ${image.alt}`}
          className={cn(
            'group relative cursor-pointer overflow-hidden rounded-sm',
            index === 0 && 'col-span-2 md:col-span-2 md:row-span-2',
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            aspect={cn('aspect-[4/3]', index === 0 && 'md:aspect-auto')}
            className={cn(
              'transition-transform duration-700 ease-out group-hover:scale-[1.05]',
              index === 0 && 'md:h-full md:w-full',
            )}
          />
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/30"
          >
            <span className="flex h-11 w-11 translate-y-1 items-center justify-center rounded-full border border-cream-50/40 bg-cream-50/90 text-ink-900 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ZoomIn className="h-4 w-4" />
            </span>
          </span>
        </button>
      ))}

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        label={`${projectName} — gallery image ${(active ?? 0) + 1} of ${count}`}
        className="max-w-4xl"
      >
        {current ? (
          <div className="flex flex-col gap-4 rounded-sm border border-cream-50/10 bg-ink-950 p-4 md:p-6">
            <Image src={current.src} alt={current.alt} aspect="aspect-[16/10]" className="w-full" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-md text-sm text-cream-50/80">{current.caption ?? current.alt}</p>
              <p className="text-sm text-cream-50/50 tabular-nums">
                {(active ?? 0) + 1} / {count}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActive(((active ?? 0) - 1 + count) % count)}
                aria-label="Previous image"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm border border-cream-50/20 text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setActive(((active ?? 0) + 1) % count)}
                aria-label="Next image"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm border border-cream-50/20 text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
