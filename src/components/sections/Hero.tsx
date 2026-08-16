import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { buttonStyles } from '@/components/ui/button-styles'
import { useSiteContent } from '@/hooks/use-content'
import {
  heroCard as staticHeroCard,
  heroContent as staticHeroContent,
} from '@/data/site-content'

export function Hero() {
  const { data } = useSiteContent()
  const heroContent = data?.heroContent ?? staticHeroContent
  const heroCard = data?.heroCard ?? staticHeroCard
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-ink-900 pt-32 pb-24 text-cream-50 md:pt-40">
      {/* Backdrop */}
      <div aria-hidden className="bg-arch-grid absolute inset-0" />
      <div aria-hidden className="bg-gold-glow absolute inset-0" />
      <div aria-hidden className="bg-ink-radial absolute inset-0" />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-gold-400 uppercase">
                <span aria-hidden className="h-px w-10 bg-gold-500/70" />
                {heroContent.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mt-6 font-display text-5xl leading-[1.05] text-cream-50 sm:text-6xl lg:text-7xl">
                {heroContent.title[0]}
                <br />
                <span className="text-gold-400">{heroContent.title[1]}</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-cream-50/75 md:text-lg">
                {heroContent.subtitle}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link to={heroContent.primaryCta.to} className={buttonStyles('primary', 'lg')}>
                  {heroContent.primaryCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  to={heroContent.secondaryCta.to}
                  className={buttonStyles('outline', 'lg')}
                >
                  {heroContent.secondaryCta.label}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
                {heroContent.trust.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium text-cream-50/85"
                  >
                    <CheckCircle2 className="h-4 w-4 text-gold-400" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Featured card */}
          <Reveal delay={250} className="hidden lg:block">
            <div className="relative mx-auto max-w-md">
              <div
                aria-hidden
                className="absolute -top-6 -right-6 h-full w-full border border-gold-500/25"
              />
              <div className="relative border border-gold-500/30 bg-cream-50 p-8 text-ink-900 shadow-lg">
                <p className="text-xs font-bold tracking-[0.24em] text-gold-600 uppercase">
                  {heroCard.title}
                </p>
                <div className="hairline-gold my-5" aria-hidden />
                <ul className="space-y-3 text-sm text-ink-600">
                  {heroCard.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-500" aria-hidden />
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className="hairline-gold my-5" aria-hidden />
                <p className="text-xs text-ink-400 italic">{heroCard.footnote}</p>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-ink-900 px-6 py-3.5 font-semibold text-cream-50 transition-colors duration-300 hover:bg-ink-700"
                >
                  Schedule a Private Visit
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* Scroll cue */}
      <div aria-hidden className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[0.6rem] font-bold tracking-[0.4em] text-cream-50/40 uppercase">
          Scroll
        </span>
        <span className="h-12 w-px bg-gradient-to-b from-gold-500 to-transparent" />
      </div>
    </section>
  )
}
