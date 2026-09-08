import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Accordion } from '@/components/ui/Accordion'
import { buttonStyles } from '@/components/ui/button-styles'
import { useSiteContent } from '@/hooks/use-content'
import { faqItems as staticFaqItems } from '@/data/site-content'

export function FaqPreview() {
  const { data } = useSiteContent()
  const faqItems = data?.faqItems ?? staticFaqItems
  return (
    <Section tone="white">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Good to Know"
          title="Frequently Asked Questions"
        />
        <Reveal>
          <Accordion items={faqItems.slice(0, 4)} defaultOpenIndex={0} />
        </Reveal>
        <Reveal className="mt-10 text-center">
          <Link to="/faq" className={buttonStyles('secondary', 'md')}>
            View All FAQs
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </Container>
    </Section>
  )
}
