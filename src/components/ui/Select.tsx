import { ChevronDown } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/utils/cn'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  className?: string
}

/** Styled native select — accessible, keyboard friendly, chevron indicator. */
export function Select({ label, value, onChange, options, className }: SelectProps) {
  const id = useId()
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
        {label}
      </span>
      <span className="relative block">
        <select
          id={id}
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full cursor-pointer appearance-none rounded-sm border border-ink-900/20 bg-cream-50 py-3 pr-10 pl-4 text-sm font-medium text-ink-800 transition-colors duration-300 hover:border-gold-600 focus:border-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink-500"
        />
      </span>
    </label>
  )
}
