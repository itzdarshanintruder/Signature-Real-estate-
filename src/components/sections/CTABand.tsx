import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { buttonStyles } from '@/components/ui/button-styles'
import { SITE } from '@/constants/site'

export function CTABand() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 text-center text-cream-50 md:py-28">
      <div aria-hidden className="bg-arch-grid absolute inset-0" />
      <div aria-hidden className="bg-gold-glow absolute inset-0" />
      <Container className="relative">
        <Reveal>
          <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-gold-400 uppercase">
            DTCP Approved · Clear Title · Bank Loans
          </p>
          <h2 className="mx-auto max-w-3xl text-balance font-display text-4xl leading-tight text-cream-50 sm:text-5xl lg:text-6xl">
            Your Legacy <span className="text-gold-400">Awaits</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream-50/70 md:text-lg">
            Book a private site visit and walk the avenues of Signature City yourself —
            or speak with an advisor over a call.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/contact" className={buttonStyles('primary', 'lg')}>
              Book a Site Visit
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href={SITE.phoneHref} className={buttonStyles('outline', 'lg')}>
              {SITE.phone}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
