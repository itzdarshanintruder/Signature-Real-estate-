import { Link } from 'react-router-dom'
import { Seo } from '@/components/ui/Seo'
import { JsonLd } from '@/components/ui/JsonLd'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Accordion } from '@/components/ui/Accordion'
import { CTABand } from '@/components/sections/CTABand'
import { useSiteContent } from '@/hooks/use-content'
import { faqItems as staticFaqItems } from '@/data/site-content'

export default function FaqPage() {
  const { data } = useSiteContent()
  const faqItems = data?.faqItems ?? staticFaqItems

  return (
    <>
      <Seo
        title="FAQ"
        description="Answers about Signature City — DTCP approval, bank loans, plot sizes, payment plans, NRI purchases and more."
        path="/faq"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }}
      />
      <PageHeader
        eyebrow="Good to Know"
        title="Frequently Asked Questions"
        description="The questions we hear most — answered honestly. Anything else? Our team is a call away."
      />

      <Section tone="cream">
        <Container className="max-w-3xl">
          <Reveal>
            <Accordion items={faqItems} defaultOpenIndex={0} />
          </Reveal>
          <Reveal className="mt-12 border border-gold-500/30 bg-gold-50 p-8 text-center">
            <h2 className="font-display text-2xl text-ink-900">Still have a question?</h2>
            <p className="mt-2 text-sm text-ink-500">
              Reach out and our team will get back to you within 24 hours.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex rounded-sm bg-gold-500 px-8 py-3.5 font-semibold text-ink-900 transition-colors hover:bg-gold-400"
            >
              Contact Us
            </Link>
          </Reveal>
        </Container>
      </Section>

      <CTABand />
    </>
  )
}
