import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { MapIcon } from '@/components/ui/IconMap'
import { useSiteContent } from '@/hooks/use-content'
import { amenities as staticAmenities } from '@/data/site-content'

export function Amenities() {
  const { data } = useSiteContent()
  const amenities = data?.amenities ?? staticAmenities
  return (
    <Section tone="cream">
      <Container>
        <SectionHeading
          eyebrow="The Signature Life"
          title="Amenities That Make It Home"
          subtitle="Thoughtful amenities, planned around how modern families actually live and unwind."
        />

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {amenities.map((amenity, index) => (
            <Reveal as="li" key={amenity.title} delay={(index % 5) * 60}>
              <div className="group h-full border border-ink-200 bg-cream-50 p-6 transition-colors duration-300 hover:border-gold-500/60">
                <span className="flex h-12 w-12 items-center justify-center rounded-sm border border-gold-500/40 bg-gold-50 text-gold-600 transition-all duration-300 group-hover:bg-gold-500 group-hover:text-ink-900">
                  <MapIcon name={amenity.icon} className="h-5 w-5" />
                </span>
                <p className="mt-4 font-semibold text-ink-900">{amenity.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {amenity.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
