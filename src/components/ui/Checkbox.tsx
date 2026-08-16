import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { cn } from '@/utils/cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode
  description?: ReactNode
  invalid?: boolean
}

/** Accessible native checkbox with gold accent — form-ready (react-hook-form compatible). */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, invalid, className, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        aria-invalid={invalid || undefined}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-sm border-ink-300 accent-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-600/40"
        {...props}
      />
      {label || description ? (
        <label htmlFor={inputId} className="cursor-pointer text-sm leading-relaxed text-ink-700">
          {label ? <span className="font-medium">{label}</span> : null}
          {description ? (
            <span className="mt-0.5 block text-ink-500">{description}</span>
          ) : null}
        </label>
      ) : null}
    </div>
  )
})
