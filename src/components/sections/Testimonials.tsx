import { Quote } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { useSiteContent } from '@/hooks/use-content'
import { testimonials as staticTestimonials } from '@/data/site-content'

export function Testimonials() {
  const { data } = useSiteContent()
  const testimonials = data?.testimonials ?? staticTestimonials
  return (
    <Section tone="cream">
      <Container>
        <SectionHeading
          eyebrow="Owners' Stories"
          title="What Our Owners Say"
          subtitle="Real words from families and investors who chose to build their future here."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 100}>
              <figure className="flex h-full flex-col border border-ink-200 bg-cream-50 p-8 transition-colors duration-300 hover:border-gold-500/50">
                <Quote aria-hidden className="h-8 w-8 text-gold-500/70" />
                <blockquote className="mt-6 flex-1">
                  <p className="font-display text-lg leading-relaxed text-ink-800">
                    “{testimonial.quote}”
                  </p>
                </blockquote>
                <figcaption className="mt-8 border-t border-ink-100 pt-5">
                  <p className="font-semibold text-ink-900">{testimonial.name}</p>
                  <p className="mt-0.5 text-sm text-gold-700">{testimonial.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
