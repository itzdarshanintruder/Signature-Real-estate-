import { MapPin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { MapIcon } from '@/components/ui/IconMap'
import { SITE } from '@/constants/site'
import { useSiteContent } from '@/hooks/use-content'
import { locationHighlights as staticLocationHighlights } from '@/data/site-content'

function MapPanel({
  points,
}: {
  points: typeof staticLocationHighlights.points
}) {
  const chips = points.slice(0, 2)
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-gold-500/20 bg-ink-800">
      <div aria-hidden className="bg-arch-grid absolute inset-0" />

      {/* stylised roads */}
      <div aria-hidden className="absolute inset-0">
        <span className="absolute top-0 bottom-0 left-[22%] w-px bg-gold-500/20" />
        <span className="absolute top-0 bottom-0 left-[64%] w-px bg-gold-500/20" />
        <span className="absolute top-[38%] right-0 left-0 h-px bg-gold-500/20" />
        <span className="absolute top-[70%] right-0 left-0 h-px bg-gold-500/20" />
      </div>

      {/* destination chips */}
      {chips[0] ? (
        <span className="absolute top-[16%] left-[30%] rounded-sm border border-gold-500/30 bg-ink-900/90 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-cream-50">
          {chips[0].title} · {chips[0].detail}
        </span>
      ) : null}
      {chips[1] ? (
        <span className="absolute bottom-[12%] right-[14%] rounded-sm border border-gold-500/30 bg-ink-900/90 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-cream-50">
          {chips[1].title} · {chips[1].detail}
        </span>
      ) : null}

      {/* pin */}
      <div aria-hidden className="absolute top-[46%] left-[48%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -inset-4 animate-[ping-soft_2.4s_ease-out_infinite] rounded-full bg-gold-500/40" />
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream-50 bg-gold-500 shadow-gold">
          <MapPin className="h-5 w-5 text-ink-900" />
        </span>
      </div>

      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-sm bg-ink-900/85 px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.24em] text-gold-400 uppercase">
        Signature City
      </span>
    </div>
  )
}

export function LocationHighlights() {
  const { data } = useSiteContent()
  const locationHighlights = data?.locationHighlights ?? staticLocationHighlights

  return (
    <Section tone="dark">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow={locationHighlights.eyebrow}
              title={locationHighlights.title}
              subtitle={locationHighlights.copy}
              tone="dark"
              align="left"
              className="mb-0"
            />

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {locationHighlights.points.map((point, index) => (
                <Reveal as="li" key={point.title} delay={index * 80}>
                  <div className="group flex h-full items-start gap-4 border border-cream-50/10 bg-ink-900/40 p-5 transition-colors duration-300 hover:border-gold-500/50">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-gold-500/40 bg-ink-950 text-gold-400 transition-all duration-300 group-hover:bg-gold-500 group-hover:text-ink-900">
                      <MapIcon name={point.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-cream-50">{point.title}</p>
                      <p className="mt-1 text-sm text-cream-50/60">{point.detail}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>

            <a
              href={SITE.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
            >
              <MapIcon name="map-pin" className="h-4 w-4" />
              View on Google Maps
            </a>
          </Reveal>

          <Reveal delay={150}>
            <MapPanel points={locationHighlights.points} />
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
