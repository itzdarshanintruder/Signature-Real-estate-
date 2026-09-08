import { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { useSiteContent } from '@/hooks/use-content'
import { stats as staticStats } from '@/data/site-content'
import type { Stat } from '@/types/content'

function useCountUp(target: number, duration = 1100) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          observer.disconnect()

          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(target * eased))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { ref, value }
}

function StatItem({ stat }: { stat: Stat }) {
  const { ref, value } = useCountUp(stat.value)
  return (
    <div className="text-center">
      <p className="font-display text-4xl text-gold-400 tabular-nums md:text-6xl">
        {stat.prefix}
        <span ref={ref}>{value}</span>
        {stat.suffix}
      </p>
      <p className="mt-3 text-xs font-bold tracking-[0.2em] text-cream-50/60 uppercase">
        {stat.label}
      </p>
    </div>
  )
}

export function Stats() {
  const { data } = useSiteContent()
  const stats = data?.stats ?? staticStats

  return (
    <section className="relative overflow-hidden bg-ink-900 py-16 text-cream-50 md:py-24">
      <div aria-hidden className="bg-gold-glow absolute inset-0" />
      <Container className="relative">
        <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90}>
              <StatItem stat={stat} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
