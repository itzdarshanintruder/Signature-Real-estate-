import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Reveal } from '@/components/ui/Reveal'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  subtitle?: string
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = 'light',
  align = 'center',
  className,
}: SectionHeadingProps) {
  const isDark = tone === 'dark'
  return (
    <Reveal
      className={cn(
        'mb-12 max-w-2xl md:mb-16',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] uppercase',
            align === 'center' && 'justify-center',
            isDark ? 'text-gold-400' : 'text-gold-600',
          )}
        >
          <span aria-hidden className={cn('h-px w-8', isDark ? 'bg-gold-500/60' : 'bg-gold-500')} />
          {eyebrow}
          {align === 'center' && (
            <span aria-hidden className={cn('h-px w-8', isDark ? 'bg-gold-500/60' : 'bg-gold-500')} />
          )}
        </p>
      ) : null}
      <h2
        className={cn(
          'text-balance text-3xl leading-tight sm:text-4xl lg:text-5xl',
          isDark ? 'text-cream-50' : 'text-ink-900',
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed md:text-lg',
            isDark ? 'text-cream-50/70' : 'text-ink-500',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  )
}
