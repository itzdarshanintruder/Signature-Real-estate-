import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark' | 'outline-dark'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-300 select-none whitespace-nowrap disabled:pointer-events-none disabled:opacity-60'

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-gold-500 text-ink-900 hover:bg-gold-400 active:bg-gold-600',
  secondary:
    'border border-ink-900/20 bg-transparent text-ink-900 hover:border-gold-600 hover:text-gold-700',
  outline:
    'border border-cream-50/30 bg-transparent text-cream-50 hover:border-gold-400 hover:text-gold-300',
  ghost: 'text-ink-900 hover:text-gold-700',
  'outline-dark':
    'border border-ink-900/20 text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-cream-50',
  dark: 'bg-ink-900 text-cream-50 hover:bg-ink-700',
}

export const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(base, buttonVariants[variant], buttonSizes[size], className)
}
