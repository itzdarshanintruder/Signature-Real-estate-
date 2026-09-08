import { Check } from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CTABand } from '@/components/sections/CTABand'
import { useSiteContent } from '@/hooks/use-content'
import {
  amenities as staticAmenities,
  amenityPillars as staticAmenityPillars,
} from '@/data/site-content'
import { iconForAmenity } from '@/utils/amenities'

export default function AmenitiesPage() {
  const { data } = useSiteContent()
  const amenities = data?.amenities ?? staticAmenities
  const amenityPillars = data?.amenityPillars ?? staticAmenityPillars

  return (
    <>
      <Seo
        title="Amenities"
        description="Security, community and sustainable systems — the shared spaces that make everyday living at Signature City effortless."
      />
      <PageHeader
        eyebrow="Amenities"
        title="Life, Elevated at Every Turn"
        description="From guarded gateways to landscaped greens, every shared space at Signature City is planned to make everyday living feel effortless."
      />

      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="The Essentials"
            title="Everything You Need, Designed In"
            subtitle="A considered set of amenities — never a feature list for the brochure, always one for how families actually live."
          />
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity, index) => {
              const Icon = iconForAmenity(amenity.icon)
              return (
                <Reveal as="li" key={amenity.title} delay={(index % 3) * 90} className="h-full">
                  <div className="group flex h-full flex-col border border-ink-200 bg-cream-50 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-lg hover:shadow-ink-900/5">
                    <span className="flex h-12 w-12 items-center justify-center bg-ink-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-ink-900">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="mt-5 font-display text-xl text-ink-900">{amenity.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{amenity.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading
            eyebrow="Thoughtfully Planned"
            title="More Than a Plot, a Whole Way of Living"
            subtitle="Behind every amenity is a design decision — systems, security and shared spaces that keep working long after handover."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {amenityPillars.map((pillar, index) => {
              const Icon = iconForAmenity(pillar.icon)
              return (
                <Reveal key={pillar.title} delay={index * 120} className="h-full">
                  <div className="relative flex h-full flex-col border border-ink-200 bg-cream-100 p-8">
                    <span
                      aria-hidden
                      className="absolute top-6 right-7 font-display text-5xl text-ink-900/10 tabular-nums"
                    >
                      0{index + 1}
                    </span>
                    <span className="flex h-14 w-14 items-center justify-center rounded-sm border border-gold-500/40 bg-gold-50 text-gold-600">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="mt-6 font-display text-2xl text-ink-900">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-500">{pillar.description}</p>
                    <ul className="mt-6 space-y-2.5 border-t border-ink-200 pt-6">
                      {pillar.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm text-ink-600">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </Section>

      <CTABand />
    </>
  )
}
