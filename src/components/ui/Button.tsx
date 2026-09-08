import type { ButtonHTMLAttributes } from 'react'
import { buttonStyles, type ButtonSize, type ButtonVariant } from '@/components/ui/button-styles'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonStyles(variant, size), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Spinner size={size === 'sm' ? 'sm' : 'md'} label="Loading" className="shrink-0" />
      ) : null}
      {children}
    </button>
  )
}
