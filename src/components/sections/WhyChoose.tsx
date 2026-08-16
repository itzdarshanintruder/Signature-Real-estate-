import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Image } from '@/components/ui/Image'
import { MapIcon } from '@/components/ui/IconMap'
import { useSiteContent } from '@/hooks/use-content'
import { whyChoose as staticWhyChoose } from '@/data/site-content'

export function WhyChoose() {
  const { data } = useSiteContent()
  const whyChoose = data?.whyChoose ?? staticWhyChoose
  return (
    <Section tone="white">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <Reveal>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -bottom-6 -left-6 h-full w-full border border-gold-500/25"
              />
              <div className="relative overflow-hidden shadow-lg">
                <Image
                  alt="Signature City — a thoughtfully planned residential community"
                  aspect="aspect-[4/3]"
                  className="transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div aria-hidden className="bg-arch-grid absolute inset-0 opacity-60" />
              </div>
              <div className="absolute -top-5 -right-5 hidden border border-gold-500/30 bg-cream-50 px-5 py-4 text-center shadow-md sm:block">
                <p className="font-display text-3xl font-semibold text-gold-600">
                  {whyChoose.trust[0].value}
                </p>
                <p className="mt-1 text-[0.65rem] font-bold tracking-[0.18em] text-ink-500 uppercase">
                  {whyChoose.trust[0].label}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal delay={120}>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-600 uppercase">
              <span aria-hidden className="h-px w-10 bg-gold-500" />
              {whyChoose.eyebrow}
            </p>
            <h2 className="text-balance text-3xl leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
              {whyChoose.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-500 md:text-lg">
              {whyChoose.copy}
            </p>

            <ol className="mt-10 space-y-7">
              {whyChoose.steps.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-500/50 bg-gold-50 text-gold-600">
                      <MapIcon name={step.icon} className="h-4.5 w-4.5" />
                    </span>
                    {index < whyChoose.steps.length - 1 ? (
                      <span aria-hidden className="mt-2 w-px flex-1 bg-gold-500/30" />
                    ) : null}
                  </div>
                  <div className="pb-2">
                    <h3 className="font-semibold text-ink-900">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-500">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <ul className="mt-10 grid grid-cols-3 gap-6 border-t border-ink-200 pt-8">
              {whyChoose.trust.map((item) => (
                <li key={item.label}>
                  <p className="font-display text-3xl font-semibold text-gold-600 tabular-nums">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[0.65rem] font-bold tracking-[0.14em] text-ink-500 uppercase">
                    {item.label}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
