import type { ElementType, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '@/animations/motion'
import { cn } from '@/utils/cn'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger delay in ms. */
  delay?: number
  /** Render as a different element (e.g. `li`) to preserve semantics. */
  as?: ElementType
}

/**
 * Scroll reveal — framer-motion `whileInView`, animates once on entry.
 * Respects `prefers-reduced-motion` (renders statically).
 */
export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = motion.create(Tag as string) as typeof motion.div

  return (
    <MotionTag
      className={cn('will-change-transform', className)}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -48px 0px' }}
      transition={{ duration: 0.75, ease: EASE.brand, delay: delay / 1000 }}
    >
      {children}
    </MotionTag>
  )
}
