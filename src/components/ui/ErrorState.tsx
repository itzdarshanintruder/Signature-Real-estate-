import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

/** Surface for failed loads with an optional retry action. */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center px-6 py-20 text-center', className)}
    >
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-red-600/20 bg-red-50 text-red-700">
        <AlertTriangle className="h-7 w-7" aria-hidden />
      </span>
      <h3 className="font-display text-xl text-ink-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-ink-500">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-sm border border-ink-900/20 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors duration-300 hover:border-gold-600 hover:text-gold-700"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Try again
        </button>
      ) : null}
    </div>
  )
}
