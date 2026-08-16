import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}

/** Dark inner-page masthead shared by every non-home route. */
export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-ink-900 pt-36 pb-16 text-cream-50 md:pt-44 md:pb-20">
      <div aria-hidden className="bg-arch-grid absolute inset-0" />
      <div aria-hidden className="bg-gold-glow absolute inset-0" />
      <Container className="relative">
        <Reveal>
          {eyebrow ? (
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-400 uppercase">
              <span aria-hidden className="h-px w-10 bg-gold-500/70" />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-3xl text-balance text-4xl leading-tight text-cream-50 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className={cn('mt-6 max-w-2xl text-base leading-relaxed text-cream-50/70 md:text-lg')}>
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-10">{children}</div> : null}
        </Reveal>
      </Container>
    </header>
  )
}
