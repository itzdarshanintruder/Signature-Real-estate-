import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

/* ---------- Label ---------- */

interface LabelProps {
  htmlFor?: string
  children: ReactNode
  required?: boolean
}

export function Label({ htmlFor, children, required }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-bold tracking-[0.18em] text-ink-600 uppercase"
    >
      {children}
      {required ? <span aria-hidden className="ml-1 text-gold-600">*</span> : null}
    </label>
  )
}

/* ---------- Shared field shell ---------- */

const fieldBase =
  'w-full border border-ink-300 bg-cream-50 px-4 py-3 text-ink-800 placeholder:text-ink-400 transition-colors duration-300 focus:border-gold-600 focus:bg-cream-50 focus:outline-none'

interface FieldErrorProps {
  id?: string
  message?: string
}

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-700">
      {message}
    </p>
  )
}

/* ---------- Input ---------- */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        fieldBase,
        invalid && 'border-red-600 focus:border-red-600 focus:ring-red-600/20',
        className,
      )}
      {...props}
    />
  )
})

/* ---------- Textarea ---------- */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldBase, 'min-h-32 resize-y', invalid && 'border-red-600', className)}
      {...props}
    />
  )
})

/* ---------- Select ---------- */

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, children, ...props },
  ref,
) {
  return (
    <span className="relative block">
      <select
        ref={ref}
        className={cn(
          fieldBase,
          'cursor-pointer appearance-none pr-10',
          invalid && 'border-red-600',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink-500"
      />
    </span>
  )
})
