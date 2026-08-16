import type { ReactNode } from 'react'
import { createContext, useContext, useId } from 'react'
import { cn } from '@/utils/cn'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
}

/** Controlled accessible tabs — keyboard navigable with arrow keys. */
export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
  'aria-label'?: string
}

export function TabsList({ children, className, 'aria-label': ariaLabel }: TabsListProps) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={cn('flex flex-wrap gap-3', className)}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  /** `dark` (default) for dark mastheads, `light` for cream/white surfaces. */
  variant?: 'dark' | 'light'
  className?: string
}

export function TabsTrigger({ value, children, variant = 'dark', className }: TabsTriggerProps) {
  const ctx = useContext(TabsContext)
  const baseId = useId()
  if (!ctx) throw new Error('TabsTrigger must be used within a Tabs')
  const selected = ctx.value === value

  const activate = (next: string) => ctx.onValueChange(next)

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const siblings = Array.from(
      (event.currentTarget.parentElement?.querySelectorAll('[role="tab"]') ?? []) as NodeListOf<HTMLElement>,
    )
    const index = siblings.indexOf(event.currentTarget)
    let next: HTMLElement | undefined
    if (event.key === 'ArrowRight') next = siblings[(index + 1) % siblings.length]
    if (event.key === 'ArrowLeft') next = siblings[(index - 1 + siblings.length) % siblings.length]
    if (next) {
      event.preventDefault()
      next.click()
      next.focus()
    }
  }

  return (
    <button
      type="button"
      role="tab"
      id={`tab-${baseId}`}
      aria-selected={selected}
      aria-controls={`panel-${baseId}`}
      tabIndex={selected ? 0 : -1}
      onClick={() => activate(value)}
      onKeyDown={onKeyDown}
      className={cn(
        'cursor-pointer rounded-sm border px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300',
        selected
          ? 'border-gold-500 bg-gold-500 text-ink-900'
          : variant === 'dark'
            ? 'border-cream-50/25 text-cream-50/80 hover:border-gold-400 hover:text-gold-300'
            : 'border-ink-900/20 text-ink-700 hover:border-gold-600 hover:text-gold-700',
        className,
      )}
    >
      {children}
    </button>
  )
}

interface TabsPanelProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabsPanel({ value, children, className }: TabsPanelProps) {
  const ctx = useContext(TabsContext)
  const baseId = useId()
  if (!ctx) throw new Error('TabsPanel must be used within a Tabs')
  if (ctx.value !== value) return null

  return (
    <div
      id={`panel-${baseId}`}
      role="tabpanel"
      aria-labelledby={`tab-${baseId}`}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  )
}
