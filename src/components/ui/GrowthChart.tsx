import { motion } from 'framer-motion'
import { EASE } from '@/animations/motion'
import type { GrowthDatum } from '@/types/content'
import { cn } from '@/utils/cn'

interface GrowthChartProps {
  data: GrowthDatum[]
  /** Optional overline label above the chart title. */
  eyebrow?: string
  /** Optional title shown in the panel header. */
  title?: string
  className?: string
}

const maxValue = (data: GrowthDatum[]) => Math.max(...data.map((point) => point.value))

/**
 * Animated bar chart of a growth index (100 = baseline year).
 * The latest year is highlighted in bright gold. Reduced-motion friendly.
 */
export function GrowthChart({ data, eyebrow = 'Growth History', title, className }: GrowthChartProps) {
  const last = data.length - 1
  const max = maxValue(data)

  return (
    <div className={cn('rounded-sm border border-cream-50/10 bg-ink-950/60 p-6 md:p-9', className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-gold-400 uppercase">{eyebrow}</p>
          {title ? (
            <p className="mt-2 font-display text-2xl text-cream-50 md:text-3xl">{title}</p>
          ) : null}
        </div>
        <p className="text-xs text-cream-50/50">
          Indicative growth index · {data[0]?.year} = 100
        </p>
      </div>

      <div className="mt-8 grid h-56 grid-flow-col auto-cols-[minmax(0,1fr)] items-stretch gap-2 sm:gap-3">
        {data.map((point, index) => (
          <div key={point.year} className="flex h-full flex-col items-center">
            <div className="flex w-full flex-1 items-end">
              <motion.div
                className={
                  index === last
                    ? 'w-full origin-bottom rounded-t-sm bg-gradient-to-t from-gold-600 via-gold-400 to-gold-200 shadow-gold'
                    : 'w-full origin-bottom rounded-t-sm bg-gradient-to-t from-gold-800 via-gold-600 to-gold-500'
                }
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: EASE.brand, delay: 0.05 + index * 0.05 }}
                style={{ height: `${(point.value / max) * 100}%` }}
                title={`${point.year} — index ${point.value}`}
                role="img"
                aria-label={`${point.year} — index ${point.value}`}
              />
            </div>
            <span className="mt-3 text-[0.65rem] font-semibold text-cream-50/50">{point.year}</span>
          </div>
        ))}
      </div>

      <p className="mt-7 border-t border-cream-50/10 pt-5 text-xs leading-relaxed text-cream-50/50">
        Land values in this growth corridor have risen steadily through every market cycle.
        Figures are indicative samples for illustration — speak with an advisor for a detailed
        market view.
      </p>
    </div>
  )
}
