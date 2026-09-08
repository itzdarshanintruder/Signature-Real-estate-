import { Seo } from '@/components/ui/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { SITE } from '@/constants/site'

interface LegalSection {
  heading: string
  body: string[]
}

interface LegalPageProps {
  title: string
  updated: string
  sections: LegalSection[]
}

export default function LegalPage({ title, updated, sections }: LegalPageProps) {
  return (
    <>
      <Seo title={title} description={`${title} for ${SITE.name}.`} />
      <PageHeader eyebrow="Legal" title={title} />
      <Section tone="cream">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="mb-12 text-sm text-ink-400">Last updated: {updated}</p>
            <div className="space-y-10">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-2xl text-ink-900">{section.heading}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)} className="mt-4 leading-relaxed text-ink-600">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
