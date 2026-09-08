import { Seo } from '@/components/ui/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { MapIcon } from '@/components/ui/IconMap'
import { Image } from '@/components/ui/Image'
import { CTABand } from '@/components/sections/CTABand'
import { useSiteContent } from '@/hooks/use-content'
import { about as staticAbout, journey as staticJourney } from '@/data/site-content'

export default function AboutPage() {
  const { data } = useSiteContent()
  const about = data?.about ?? staticAbout
  const journey = data?.journey ?? staticJourney

  return (
    <>
      <Seo
        title="About"
        description="Two decades of trusted land development. Signature City is built on clear titles, honest pricing and architectural care."
      />
      <PageHeader
        eyebrow="Our Story"
        title="Land Is Where Stories Are Built"
        description="Two decades of planned layouts, clean titles and communities that endure."
      />

      <Section tone="cream">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <div className="relative">
                <div aria-hidden className="absolute -top-6 -left-6 h-full w-full border border-gold-500/25" />
                <div className="relative">
                  <Image alt="Signature City estate overview" aspect="aspect-[4/3]" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-600 uppercase">
                <span aria-hidden className="h-px w-10 bg-gold-500" />
                {about.eyebrow}
              </p>
              <h2 className="text-balance text-3xl leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
                {about.title}
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-600">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {about.values.map((value, index) => (
              <Reveal key={value.title} delay={index * 100}>
                <div className="h-full border border-ink-200 bg-cream-100 p-8 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm border border-gold-500/40 bg-gold-50 text-gold-600">
                    <MapIcon name={value.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl text-ink-900">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="dark">
        <Container>
          <Reveal className="mb-12 text-center">
            <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-gold-400 uppercase">
              Our Journey
            </p>
            <h2 className="font-display text-3xl text-cream-50 sm:text-4xl lg:text-5xl">
              Two Decades of Trust
            </h2>
          </Reveal>

          <ol className="relative grid gap-10 md:grid-cols-4">
            <div
              aria-hidden
              className="absolute top-4 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent md:block"
            />
            {journey.map((milestone, index) => (
              <Reveal as="li" key={milestone.year} delay={index * 100} className="relative">
                <span
                  aria-hidden
                  className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gold-500 bg-ink-900"
                >
                  <span className="h-2 w-2 rounded-full bg-gold-500" />
                </span>
                <p className="mt-4 font-display text-2xl text-gold-400">{milestone.year}</p>
                <p className="mt-1 font-semibold text-cream-50">{milestone.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-cream-50/60">
                  {milestone.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <CTABand />
    </>
  )
}
