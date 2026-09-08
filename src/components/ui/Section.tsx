import type { ElementType, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface SectionProps {
  children: ReactNode
  as?: ElementType
  /** Visual band: cream (default), dark (ink), white */
  tone?: 'cream' | 'dark' | 'white'
  id?: string
  className?: string
}

export function Section({
  children,
  as: Tag = 'section',
  tone = 'cream',
  id,
  className,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'relative py-16 md:py-24 lg:py-28',
        tone === 'dark' && 'bg-ink-900 text-cream-50',
        tone === 'cream' && 'bg-cream-100',
        tone === 'white' && 'bg-cream-50',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
