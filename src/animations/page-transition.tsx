import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from './motion'

interface PageTransitionProps {
  children: ReactNode
}

/** Subtle fade + rise wrapper for route transitions (60fps, honours reduced motion). */
export function PageTransition({ children }: PageTransitionProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE.brand }}
    >
      {children}
    </motion.div>
  )
}
