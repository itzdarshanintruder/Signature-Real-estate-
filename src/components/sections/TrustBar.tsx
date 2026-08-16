import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { MapIcon } from '@/components/ui/IconMap'
import { useSiteContent } from '@/hooks/use-content'
import { trustBar as staticTrustBar } from '@/data/site-content'

export function TrustBar() {
  const { data } = useSiteContent()
  const trustBar = data?.trustBar ?? staticTrustBar
  return (
    <section className="border-b border-ink-100 bg-cream-50">
      <Container className="py-12 md:py-16">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {trustBar.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 80} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-gold-500/40 bg-gold-50 text-gold-600">
                <MapIcon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-ink-900">{item.title}</p>
                <p className="mt-1 text-sm text-ink-500">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
