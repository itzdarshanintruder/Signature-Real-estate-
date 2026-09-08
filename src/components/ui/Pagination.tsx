import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PaginationProps {
  current: number
  total: number
  onChange: (page: number) => void
  className?: string
}

/** Windowed numbered pagination with prev/next controls. */
export function Pagination({ current, total, onChange, className }: PaginationProps) {
  if (total <= 1) return null

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const pages: (number | '…')[] = (() => {
    if (total <= 7) return range(1, total)
    if (current <= 4) return [...range(1, 5), '…', total]
    if (current >= total - 3) return [1, '…', ...range(total - 4, total)]
    return [1, '…', current - 1, current, current + 1, '…', total]
  })()

  const control =
    'flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-ink-900/15 text-ink-700 transition-colors duration-300 hover:border-gold-600 hover:text-gold-700 disabled:pointer-events-none disabled:opacity-40'

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-2', className)}>
      <button
        type="button"
        className={control}
        aria-label="Previous page"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>

      {pages.map((page, index) =>
        page === '…' ? (
          <span key={`gap-${index}`} className="px-1 text-ink-400" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-current={page === current ? 'page' : undefined}
            aria-label={`Page ${page}`}
            onClick={() => onChange(page)}
            className={cn(
              control,
              page === current && 'border-gold-600 bg-gold-500 text-ink-900 hover:border-gold-600 hover:text-ink-900',
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        className={control}
        aria-label="Next page"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  )
}
