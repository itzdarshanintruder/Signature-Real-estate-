import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bus,
  Check,
  GraduationCap,
  MapPin,
  Phone,
  Route,
  ShoppingBag,
  Stethoscope,
  Trees,
  type LucideIcon,
} from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { JsonLd } from '@/components/ui/JsonLd'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Image } from '@/components/ui/Image'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Accordion } from '@/components/ui/Accordion'
import { GrowthChart } from '@/components/ui/GrowthChart'
import { buttonStyles } from '@/components/ui/button-styles'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { PlotCard } from '@/components/projects/PlotCard'
import { ProjectPlotExplorer } from '@/components/projects/ProjectPlotExplorer'
import { CTABand } from '@/components/sections/CTABand'
import { useAmenities, useProject, useSiteContent } from '@/hooks/use-content'
import { formatCurrencyInr } from '@/utils/formatters'
import { iconForAmenity } from '@/utils/amenities'
import { investmentGrowth as staticInvestmentGrowth } from '@/data/site-content'
import { SITE } from '@/constants/site'
import type { Project } from '@/types/project'

const STATUS_LABEL: Record<Project['status'], string> = {
  available: 'Available',
  premium: 'Premium',
  launching: 'Launching Soon',
  'sold-out': 'Sold Out',
}

const STATUS_TONE: Record<Project['status'], 'gold' | 'green' | 'muted' | 'dark'> = {
  available: 'green',
  premium: 'gold',
  launching: 'muted',
  'sold-out': 'dark',
}

const NEARBY_ICONS: Record<string, LucideIcon> = {
  School: GraduationCap,
  Hospital: Stethoscope,
  Shopping: ShoppingBag,
  Connectivity: Route,
  Transit: Bus,
  Recreation: Trees,
}

function MapPlaceholder({ project }: { project: Project }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-ink-900/15 bg-ink-900">
      <div aria-hidden className="bg-arch-grid absolute inset-0 opacity-60" />
      <div aria-hidden className="bg-gold-glow absolute inset-0 opacity-40" />
      {/* Stylised roads */}
      <svg aria-hidden viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
        <path d="M0 90 L400 90" stroke="#d4a843" strokeWidth="3" opacity="0.5" />
        <path d="M0 200 L400 200" stroke="#d4a843" strokeWidth="2" opacity="0.3" />
        <path d="M120 0 L120 300" stroke="#d4a843" strokeWidth="3" opacity="0.5" />
        <path d="M270 0 L270 300" stroke="#d4a843" strokeWidth="2" opacity="0.35" />
        <path d="M0 90 L120 0 M400 90 L270 200" stroke="#d4a843" strokeWidth="1.5" opacity="0.2" />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/15 text-gold-400">
          <MapPin className="h-5 w-5" aria-hidden />
        </span>
        <p className="mt-2 rounded-sm bg-ink-950/80 px-3 py-1 text-xs font-semibold text-cream-50">
          {project.title}
        </p>
      </div>
      <div className="absolute bottom-4 left-4 rounded-sm bg-ink-950/70 px-3 py-2 text-xs leading-relaxed text-cream-50/80">
        {project.location}
        <br />
        <span className="text-cream-50/50">Google Maps placeholder</span>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <Section tone="cream">
      <Container className="pt-32">
        <div className="space-y-4" aria-hidden>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-2/3 max-w-md" />
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="aspect-[4/3] w-full" />
        </div>
      </Container>
    </Section>
  )
}

function LoadErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Section tone="cream">
      <Container className="pt-32">
        <ErrorState onRetry={onRetry} />
      </Container>
    </Section>
  )
}

function NotFoundState() {
  return (
    <Section tone="cream">
      <Container className="pt-32 pb-24 text-center">
        <h1 className="font-display text-3xl text-ink-900">Project not found</h1>
        <p className="mt-4 text-ink-500">This project may have been removed or renamed.</p>
        <Link to="/projects" className={buttonStyles('primary', 'md', 'mt-8')}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Projects
        </Link>
      </Container>
    </Section>
  )
}

export default function ProjectDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading, isError, refetch } = useProject(slug ?? '')
  const { data: amenities = [] } = useAmenities()
  const { data: site } = useSiteContent()

  if (isLoading) return <LoadingState />
  if (isError) return <LoadErrorState onRetry={() => void refetch()} />
  if (!project) return <NotFoundState />

  const heroImage = project.gallery[0] ?? project.images[0]
  const growth = project.investmentGrowth ?? site?.investmentGrowth ?? staticInvestmentGrowth
  const availableCount = project.availablePlots.filter((plot) => plot.status === 'available').length

  return (
    <>
      <Seo
        title={project.title}
        description={`${project.title} — ${project.tagline}. ${project.location}.`}
        path={`/projects/${project.slug}`}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.signaturecity.in/' },
                { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://www.signaturecity.in/projects' },
                { '@type': 'ListItem', position: 3, name: project.title },
              ],
            },
            {
              '@type': 'RealEstateListing',
              name: project.title,
              description: `${project.tagline}. ${project.description}`,
              url: `https://www.signaturecity.in/projects/${project.slug}`,
              image: [...project.images, ...project.gallery]
                .map((image) => image.src)
                .filter(Boolean) as string[],
              offers: {
                '@type': 'Offer',
                price: project.startingPriceInr ?? undefined,
                priceCurrency: 'INR',
                availability:
                  project.status === 'sold-out'
                    ? 'https://schema.org/SoldOut'
                    : 'https://schema.org/InStock',
              },
            },
          ],
        }}
      />

      {/* Large hero */}
      <Section tone="dark" className="overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
        <div aria-hidden className="absolute inset-0">
          <Image
            src={heroImage?.src}
            alt=""
            aspect="aspect-auto"
            className="h-full w-full opacity-50"
            eager
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/55"
        />
        <Container className="relative">
          <Reveal>
            <Breadcrumb
              tone="dark"
              className="mb-8"
              items={[
                { label: 'Home', href: '/' },
                { label: 'Projects', href: '/projects' },
                { label: project.title },
              ]}
            />

            <div className="flex flex-wrap items-center gap-4">
              <Badge tone={STATUS_TONE[project.status]}>{STATUS_LABEL[project.status]}</Badge>
              <p className="flex items-center gap-2 text-sm text-cream-50/70">
                <MapPin className="h-4 w-4 text-gold-400" aria-hidden />
                {project.location}
              </p>
            </div>

            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl leading-tight text-cream-50 sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-4 font-display text-xl text-gold-400 italic">{project.tagline}</p>

            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-cream-50/15 pt-7">
              <div>
                <p className="text-[0.65rem] font-bold tracking-[0.2em] text-cream-50/50 uppercase">
                  Plot sizes
                </p>
                <p className="mt-1 font-display text-xl text-cream-50">
                  {project.plotSizes.join(' · ')}
                </p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold tracking-[0.2em] text-cream-50/50 uppercase">
                  Land parcel
                </p>
                <p className="mt-1 font-display text-xl text-cream-50">{project.acreage}</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-bold tracking-[0.2em] text-cream-50/50 uppercase">
                  Starting price
                </p>
                <p className="mt-1 font-display text-xl text-gold-300">
                  {project.startingPriceInr
                    ? formatCurrencyInr(project.startingPriceInr)
                    : 'On request'}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Image gallery */}
      <Section tone="cream">
        <Container>
          <ProjectGallery images={project.gallery} projectName={project.title} />
        </Container>
      </Section>

      {/* Overview + sticky summary */}
      <Section tone="white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Overview"
                title="About this phase"
                className="mb-8 md:mb-8"
              />
              {project.overview.map((paragraph) => (
                <Reveal key={paragraph}>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-600 first:mt-0 md:text-lg">
                    {paragraph}
                  </p>
                </Reveal>
              ))}

              <Reveal className="mt-10">
                <h2 className="font-display text-2xl text-ink-900 md:text-3xl">Highlights</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                        <Check className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed text-ink-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Sticky summary card */}
            <Reveal delay={120}>
              <div className="sticky top-32 space-y-6 border border-ink-200 bg-cream-50 p-7 shadow-md">
                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
                    Plot sizes
                  </p>
                  <p className="mt-1 font-display text-2xl text-ink-900">
                    {project.plotSizes.join(' · ')}
                  </p>
                </div>
                <div className="hairline-gold" aria-hidden />
                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
                    Land parcel
                  </p>
                  <p className="mt-1 font-semibold text-ink-800">{project.acreage}</p>
                </div>
                <div className="hairline-gold" aria-hidden />
                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
                    Starting price
                  </p>
                  {project.startingPriceInr ? (
                    <p className="mt-1 font-display text-3xl font-semibold text-gold-700">
                      {formatCurrencyInr(project.startingPriceInr)}
                    </p>
                  ) : (
                    <p className="mt-1 font-semibold text-ink-800">On request</p>
                  )}
                </div>
                <div className="hairline-gold" aria-hidden />
                <div className="space-y-3">
                  <Link to="/contact" className={buttonStyles('primary', 'lg', 'w-full whitespace-normal')}>
                    Enquire About This Phase
                  </Link>
                  <Link to="/contact" className={buttonStyles('secondary', 'md', 'w-full whitespace-normal')}>
                    Book a Site Visit
                  </Link>
                </div>
                <p className="text-center text-xs text-ink-400 italic">
                  Prices indicative · subject to change
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Location & surroundings */}
      <Section tone="cream">
        <Container>
          <SectionHeading
            eyebrow="Location"
            title="In the Heart of the Growth Corridor"
            subtitle="Well connected, quietly positioned — schools, hospitals, retail and transit are all within reach."
          />
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <MapPlaceholder project={project} />
              <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-ink-500">
                  {SITE.address[0]} · {project.location}
                </p>
                <a
                  href={SITE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-gold-700 underline-offset-4 transition-colors hover:text-gold-600 hover:underline"
                >
                  View on Google Maps
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </Reveal>

            <div>
              <p className="mb-2 text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
                Nearby places
              </p>
              <ul className="rounded-sm border border-ink-200 bg-cream-50">
                {project.nearbyPlaces.map((place, index) => {
                  const Icon = NEARBY_ICONS[place.category] ?? MapPin
                  return (
                    <Reveal
                      as="li"
                      key={place.name}
                      delay={index * 60}
                      className="flex items-center justify-between gap-4 border-b border-ink-900/10 px-5 py-4 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-50 text-gold-700">
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <div>
                          <p className="font-semibold text-ink-800">{place.name}</p>
                          <p className="text-xs text-ink-500">{place.category}</p>
                        </div>
                      </div>
                      <span className="text-sm text-ink-500 tabular-nums">{place.distance}</span>
                    </Reveal>
                  )
                })}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Amenities */}
      {amenities.length > 0 ? (
        <Section tone="white">

          <Container>
            <SectionHeading
              eyebrow="Amenities"
              title="Life, Taken Care Of"
              subtitle="Shared spaces designed to make everyday living feel effortless."
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {amenities.map((amenity, index) => {
             const Icon = iconForAmenity(amenity.icon)

              return (
        <Reveal
         key={amenity.id}
         delay={index * 60}
       >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-gold-400">
          <Icon className="h-4 w-4" aria-hidden />
        </span>

        <div>
          <p className="min-w-0 text-sm font-semibold text-ink-800">
            {amenity.name}
          </p>

          <p className="text-xs text-ink-500">
            {amenity.description}
          </p>
         </div>
       </Reveal>
      )
     })}
   </div>
          </Container>
        </Section>
      ) : null}

      {/* Available plots */}
      {project.availablePlots.length > 0 ? (
        <Section tone="cream">
          <Container>
            <SectionHeading
              eyebrow="Available Plots"
              title="Secure Your Address"
              subtitle={`${availableCount} plots currently available in ${project.title} — prices are indicative.`}
            />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {project.availablePlots.map((plot, index) => (
                <Reveal key={plot.id} delay={(index % 3) * 80} className="h-full">
                  <PlotCard plot={plot} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Pricing */}
      {project.pricing.length > 0 ? (
        <Section tone="white">
          <Container>
            <SectionHeading
              eyebrow="Pricing"
              title="Transparent Price Points"
              subtitle="Simple, comparable pricing across every plot size in this phase."
            />
            <Reveal className="mx-auto max-w-4xl">
              <ul className="divide-y divide-ink-900/10 rounded-sm border border-ink-200 bg-cream-50">
                {project.pricing.map((row) => (
                  <li
                    key={`${row.size}-${row.startPriceInr}`}
                    className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
                  >
                    <div className="flex items-baseline gap-3">
                      <p className="font-display text-xl text-ink-900 md:text-2xl">{row.size}</p>
                      <p className="text-sm text-ink-500">{row.dimensions}</p>
                    </div>
                    {row.note ? (
                      <span className="rounded-full border border-gold-500/40 bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-800">
                        {row.note}
                      </span>
                    ) : null}
                    <p className="font-display text-xl font-semibold text-gold-700">
                      From {formatCurrencyInr(row.startPriceInr)}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-center text-xs text-ink-400 italic">
                Prices indicative · bank loans available · exact plot pricing confirmed at the site
                office.
              </p>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* Investment highlights */}
      <Section tone="dark">
        <Container>
          <SectionHeading
            tone="dark"
            eyebrow="Investment"
            title="Built for Long-Term Value"
            subtitle="Clear titles, approved layouts and a corridor in motion — the fundamentals of sound land investment."
          />
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-6 text-xs font-bold tracking-[0.24em] text-gold-400 uppercase">
                Project timeline
              </p>
              <ol className="relative">
                {project.milestones.map((milestone, index) => (
                  <Reveal
                    as="li"
                    key={milestone.title}
                    delay={index * 80}
                    className="relative border-l border-gold-500/25 pb-10 pl-10 last:pb-0"
                  >
                    <span
                      aria-hidden
                      className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-gold-500"
                    />
                    <p className="text-xs font-bold tracking-[0.2em] text-gold-400 uppercase">
                      {milestone.phase}
                    </p>
                    <h3 className="mt-2 font-display text-xl text-cream-50 md:text-2xl">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream-50/60 md:text-base">
                      {milestone.description}
                    </p>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div className="space-y-8">
              <Reveal>
                <GrowthChart data={growth} title="An Address That Appreciates" />
              </Reveal>
              <Reveal>
                <p className="mb-4 text-xs font-bold tracking-[0.24em] text-gold-400 uppercase">
                  Why investors choose this phase
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.investmentBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 rounded-sm border border-cream-50/10 bg-ink-950/50 p-4"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400">
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed text-cream-50/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/contact" className={buttonStyles('primary', 'lg')}>
                  Talk to an Advisor
                </Link>
                <a href={SITE.phoneHref} className={buttonStyles('outline', 'lg')}>
                  <Phone className="h-4 w-4" aria-hidden />
                  {SITE.phone}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Master plan */}
      {project.masterPlan ? (
        <Section tone="white">
          <Container>
            <SectionHeading
              eyebrow="Master Plan"
              title="The Layout at a Glance"
              subtitle="A clear, approved layout — every avenue and green reserve marked."
            />
            <Reveal className="mx-auto max-w-5xl">
              <Image
                src={project.masterPlan.src}
                alt={project.masterPlan.alt}
                aspect="aspect-[16/9]"
                className="rounded-sm border border-ink-900/10"
              />
              <p className="mt-4 text-center text-sm text-ink-500">{project.masterPlan.caption}</p>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* FAQ */}
      {project.faq.length > 0 ? (
        <Section tone="cream">
          <Container>
            <SectionHeading
              eyebrow="Project FAQs"
              title="Questions, Answered"
              subtitle="The details buyers ask about most — in plain language."
            />
            <div className="mx-auto max-w-3xl">
              <Accordion items={project.faq} defaultOpenIndex={0} />
              <Reveal className="mt-8 text-center">
                <p className="text-sm text-ink-500">
                  Have a different question?{' '}
                  <Link
                    to="/contact"
                    className="font-semibold text-gold-700 underline-offset-4 hover:underline"
                  >
                    Talk to an advisor
                  </Link>
                </p>
              </Reveal>
            </div>
          </Container>
        </Section>
      ) : null}

      <ProjectPlotExplorer projectId={project.id} projectName={project.title} />

      <CTABand />
    </>
  )
}
