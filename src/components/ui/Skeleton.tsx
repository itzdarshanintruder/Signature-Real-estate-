import { cn } from '@/utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse rounded-sm bg-ink-200/70',
        className,
      )}
    />
  )
}
