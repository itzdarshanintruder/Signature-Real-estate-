import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

export function OurHeritage() {
  return (
    <section className="bg-cream-50 py-20 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent opacity-50" />
      
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.2em] text-gold-600 uppercase mb-4 flex items-center gap-4">
                <span className="h-px w-8 bg-gold-600"></span>
                Our Heritage of Trust
              </p>
              <h2 className="font-display text-4xl text-ink-900 md:text-5xl lg:text-6xl leading-[1.1]">
                Creating True Value in <span className="text-gold-600">Property & Places</span>
              </h2>
              
              <div className="mt-8 space-y-6 text-base text-ink-600 md:text-lg leading-relaxed">
                <p>
                  <strong className="font-semibold text-ink-900">VIP Housing and Properties</strong> is a leading real estate solutions company, founded in 2005 with its head office at Chennai. As pioneers in the creation of true value in property and places, we operate across diverse major cities of Tamil Nadu.
                </p>
                <p>
                  We are a customer-centric organisation providing a comprehensive service that embraces modern technology. We expertly coordinate the purchase and sale of real estate, properties, and residential homes based precisely on our clients' needs.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              <div className="absolute -inset-4 bg-gold-50/30 rounded-full blur-3xl -z-10 opacity-50" />

              <div className="group relative overflow-hidden bg-white p-8 shadow-sm transition-all hover:shadow-md border border-ink-100 rounded-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-50/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <p className="font-display text-4xl text-ink-900 mb-2 group-hover:text-gold-600 transition-colors duration-300">
                    2005
                  </p>
                  <p className="text-sm font-semibold tracking-wider text-ink-500 uppercase">
                    Founded
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white p-8 shadow-sm transition-all hover:shadow-md border border-ink-100 rounded-sm sm:translate-y-6">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-50/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <p className="font-display text-4xl text-ink-900 mb-2 group-hover:text-gold-600 transition-colors duration-300">
                    530<span className="text-gold-500">+</span>
                  </p>
                  <p className="text-sm font-semibold tracking-wider text-ink-500 uppercase">
                    Successful Projects
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white p-8 shadow-sm transition-all hover:shadow-md border border-ink-100 rounded-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-50/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <p className="font-display text-4xl text-ink-900 mb-2 group-hover:text-gold-600 transition-colors duration-300">
                    100<span className="text-gold-500">%</span>
                  </p>
                  <p className="text-sm font-semibold tracking-wider text-ink-500 uppercase">
                    Clear Title Guarantee
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white p-8 shadow-sm transition-all hover:shadow-md border border-ink-100 rounded-sm sm:translate-y-6">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-50/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <p className="font-display text-2xl text-ink-900 mb-2 group-hover:text-gold-600 transition-colors duration-300 md:text-3xl">
                    DTCP & RERA
                  </p>
                  <p className="text-sm font-semibold tracking-wider text-ink-500 uppercase">
                    Approved Projects
                  </p>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
