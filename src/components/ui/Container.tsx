import type { ElementType, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ContainerProps {
  children: ReactNode
  as?: ElementType
  className?: string
}

export function Container({ children, as: Tag = 'div', className }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </Tag>
  )
}
