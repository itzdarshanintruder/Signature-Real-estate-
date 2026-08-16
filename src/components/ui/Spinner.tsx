import { cn } from '@/utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
} as const

/** Brand loading spinner (gold on current text color). */
export function Spinner({ size = 'md', label = 'Loading…', className }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex items-center', className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn('animate-spin text-current', sizes[size])}
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  )
}
