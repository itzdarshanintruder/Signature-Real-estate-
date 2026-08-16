import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { ContactForm } from '@/components/sections/ContactForm'
import { SITE } from '@/constants/site'

const CONTACT_CARDS = [
  { icon: Phone, label: 'Call us', value: SITE.phone, href: SITE.phoneHref },
  { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MapPin, label: 'Visit us', value: `${SITE.address[0]}, ${SITE.address[1]}` },
  { icon: Clock, label: 'Hours', value: SITE.hours },
]

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact"
        description="Book a site visit or speak with the Signature City team. DTCP approved premium residential plots."
      />
      <PageHeader
        eyebrow="Get in Touch"
        title="Let's Find Your Plot"
        description="Book a private site visit, request a brochure, or ask anything about Signature City — our team responds within 24 hours."
      />

      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <Reveal>
              <div className="space-y-4">
                {CONTACT_CARDS.map(({ icon: Icon, label, value, href }) => (
                  <div
                    key={label}
                    className="flex items-center gap-5 border border-ink-200 bg-cream-50 p-5"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-gold-500/40 bg-gold-50 text-gold-600">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-bold tracking-[0.18em] text-ink-400 uppercase">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-0.5 block font-semibold text-ink-900 transition-colors hover:text-gold-700"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-0.5 font-semibold text-ink-900">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border border-gold-500/30 bg-gold-50 p-6">
                <p className="text-xs font-bold tracking-[0.2em] text-gold-700 uppercase">
                  Prefer a direct line?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Our sales team is available every day, 9:30 AM – 7:30 PM. Walk-ins are welcome
                  at the Signature City site office.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="border border-ink-200 bg-cream-50 p-6 shadow-md md:p-10">
                <h2 className="font-display text-2xl text-ink-900 md:text-3xl">
                  Send an Enquiry
                </h2>
                <p className="mt-2 mb-8 text-sm text-ink-500">
                  Fill in the form and our team will call you back within 24 hours.
                </p>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
