import { cn } from '@/utils/cn'

interface ImageProps {
  src?: string
  alt: string
  /** Tailwind aspect class, e.g. `aspect-[4/3]`. Defaults to a 4:3 box. */
  aspect?: string
  className?: string
  eager?: boolean
}

const MONOGRAM_LINES =
  'M32 12 L48 28 L32 52 L16 28 Z'

/**
 * Branded image. Renders a signature ink-and-gold placeholder until a real
 * `src` (Cloudinary / CDN) is provided — so the site looks complete even
 * before photography arrives.
 */
export function Image({ src, alt, aspect = 'aspect-[4/3]', className, eager = false }: ImageProps) {
  return (
    <div className={cn('relative overflow-hidden bg-ink-900', aspect, className)}>
      {/* Branded placeholder surface */}
      <div aria-hidden className="bg-arch-grid absolute inset-0 opacity-60" />
      <div aria-hidden className="bg-gold-glow absolute inset-0" />
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg viewBox="0 0 64 64" className="h-16 w-16 opacity-25 md:h-20 md:w-20" fill="none">
          <path d={MONOGRAM_LINES} stroke="#2b8b8f" strokeWidth="1.5" />
          <path
            d="M32 20 L40 28 L32 44 L24 28 Z"
            stroke="#2b8b8f"
            strokeWidth="1"
            opacity="0.7"
          />
        </svg>
      </div>

      {src ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  )
}
