import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Skeleton } from '@/components/ui/Skeleton'
import { Image } from '@/components/ui/Image'
import { Badge } from '@/components/ui/Badge'
import { MapIcon } from '@/components/ui/IconMap'
import { useProjects, useSiteContent } from '@/hooks/use-content'
import { formatCurrencyInr } from '@/utils/formatters'
import { premiumPlots as staticPremiumPlots } from '@/data/site-content'

export function PremiumPlots() {
  const { data: projects, isLoading } = useProjects()
  const { data: site } = useSiteContent()
  const premiumPlots = site?.premiumPlots ?? staticPremiumPlots
  const premium = projects?.filter((project) => project.status === 'premium') ?? []

  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow={premiumPlots.eyebrow}
          title={premiumPlots.title}
          subtitle={premiumPlots.copy}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : premium.map((project, index) => (
                <Reveal key={project.id} delay={index * 120} className="h-full">
                  <article className="group flex h-full flex-col border border-ink-900/10 bg-cream-50 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-lg">
                    <div className="relative overflow-hidden">
                      <Image
                        src={project.images[0]?.src}
                        alt={project.images[0]?.alt ?? project.title}
                        aspect="aspect-[16/10]"
                        className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge tone="gold">Premium Block</Badge>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-7 md:p-9">
                      <h3 className="font-display text-2xl text-ink-900 transition-colors duration-300 group-hover:text-gold-700 md:text-3xl">
                        {project.title}
                      </h3>
                      <p className="mt-2 flex items-center gap-2 text-sm text-ink-500">
                        <MapPin className="h-4 w-4 text-gold-500" aria-hidden />
                        {project.location}
                      </p>

                      <div className="hairline-gold mt-6 opacity-40" aria-hidden />

                      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
                            Plot sizes
                          </p>
                          <p className="mt-1 text-sm font-semibold text-ink-800">
                            {project.plotSizes.join(' · ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
                            Starting
                          </p>
                          <p className="mt-1 font-display text-xl font-semibold text-gold-700">
                            {project.startingPriceInr
                              ? formatCurrencyInr(project.startingPriceInr)
                              : 'On Request'}
                          </p>
                        </div>
                      </div>

                      <ul className="mt-6 flex flex-wrap gap-2">
                        {premiumPlots.features.map((feature) => (
                          <li
                            key={feature.title}
                            className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-700"
                          >
                            <MapIcon name={feature.icon} className="h-3.5 w-3.5" />
                            {feature.title}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-8">
                        <Link
                          to={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 transition-colors hover:text-gold-600"
                        >
                          View Details
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
        </div>
      </Container>
    </Section>
  )
}
