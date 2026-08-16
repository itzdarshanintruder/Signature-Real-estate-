import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

/** Friendly empty state for filtered/empty lists. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-20 text-center', className)}>
      {Icon ? (
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-50 text-gold-600">
          <Icon className="h-7 w-7" aria-hidden />
        </span>
      ) : null}
      <h3 className="font-display text-xl text-ink-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-ink-500">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
