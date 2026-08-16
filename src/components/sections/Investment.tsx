import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { buttonStyles } from '@/components/ui/button-styles'
import { GrowthChart } from '@/components/ui/GrowthChart'
import { SITE } from '@/constants/site'
import { useSiteContent } from '@/hooks/use-content'
import {
  investment as staticInvestment,
  investmentGrowth as staticInvestmentGrowth,
} from '@/data/site-content'

export function Investment() {
  const { data } = useSiteContent()
  const investment = data?.investment ?? staticInvestment
  const investmentGrowth = data?.investmentGrowth ?? staticInvestmentGrowth
  return (
    <Section tone="dark">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-400 uppercase">
              <span aria-hidden className="h-px w-10 bg-gold-500/70" />
              {investment.eyebrow}
            </p>
            <h2 className="text-balance text-3xl leading-tight text-cream-50 sm:text-4xl lg:text-5xl">
              {investment.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-50/70 md:text-lg">
              {investment.copy}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/contact" className={buttonStyles('primary', 'lg')}>
                Talk to an Advisor
              </Link>
              <a href={SITE.phoneHref} className={buttonStyles('outline', 'lg')}>
                <Phone className="h-4 w-4" aria-hidden />
                {SITE.phone}
              </a>
            </div>
          </Reveal>

          <ol className="flex flex-col">
            {investment.points.map((point, index) => (
              <Reveal as="li" key={point.title} delay={index * 100} className="group">
                <div className="flex items-start gap-6 border-b border-cream-50/10 py-7 first:pt-0">
                  <span className="font-display text-3xl text-gold-500/80 tabular-nums md:text-4xl">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-cream-50 md:text-2xl">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream-50/60 md:text-base">
                      {point.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={150} className="mt-16 md:mt-20">
          <GrowthChart data={investmentGrowth} title="An Address That Appreciates" />
        </Reveal>
      </Container>
    </Section>
  )
}
