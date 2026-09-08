import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** `light` (default) for cream surfaces, `dark` for ink mastheads. */
  tone?: 'light' | 'dark'
  className?: string
}

/** Semantic breadcrumb — last item is the current page. */
export function Breadcrumb({ items, tone = 'light', className }: BreadcrumbProps) {
  const dark = tone === 'dark'
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          'flex flex-wrap items-center gap-1.5 text-sm',
          dark ? 'text-cream-50/60' : 'text-ink-500',
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={cn(
                    'transition-colors',
                    dark ? 'hover:text-gold-300' : 'hover:text-gold-700',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(isLast && (dark ? 'font-semibold text-cream-50' : 'font-semibold text-ink-800'))}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight
                  className={cn('h-3.5 w-3.5', dark ? 'text-cream-50/30' : 'text-ink-400')}
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
