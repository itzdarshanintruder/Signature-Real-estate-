import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  defaultOpenIndex?: number | null
}

export function Accordion({ items, defaultOpenIndex = null }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex)

  return (
    <div className="divide-y divide-ink-200 border-y border-ink-200">
      {items.map((item, index) => {
        const open = openIndex === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-button-${index}`
        return (
          <div key={`${item.question}-${index}`}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
              >
                <span
                  className={cn(
                    'font-display text-lg transition-colors duration-300 md:text-xl',
                    open ? 'text-gold-700' : 'text-ink-900 group-hover:text-gold-700',
                  )}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                    open
                      ? 'rotate-180 border-gold-500 bg-gold-500 text-ink-900'
                      : 'border-ink-300 text-ink-500 group-hover:border-gold-500 group-hover:text-gold-700',
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="pb-5"
            >
              <p className="max-w-3xl text-base leading-relaxed text-ink-500">{item.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
