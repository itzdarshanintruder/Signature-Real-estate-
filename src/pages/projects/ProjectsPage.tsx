import { useMemo, useState, useEffect, useRef } from 'react'
import { SearchX } from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Pagination } from '@/components/ui/Pagination'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { CTABand } from '@/components/sections/CTABand'
import { useProjects } from '@/hooks/use-content'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import {
  DEFAULT_PROJECT_FILTERS,
  type Project,
  type ProjectFiltersValue,
  type ProjectSort,
} from '@/types/project'
import { buttonStyles } from '@/components/ui/button-styles'
import { Link } from 'react-router-dom'

const PAGE_SIZE = 3

const BUDGETS: { value: string; label: string; test: (price: number) => boolean }[] = [
  { value: 'lt-10', label: 'Under ₹10 Lakh', test: (price) => price < 10_00_000 },
  { value: '10-15', label: '₹10–15 Lakh', test: (price) => price >= 10_00_000 && price < 15_00_000 },
  { value: '15-25', label: '₹15–25 Lakh', test: (price) => price >= 15_00_000 && price < 25_00_000 },
  { value: 'gte-25', label: '₹25 Lakh+', test: (price) => price >= 25_00_000 },
]

function sortProjects(projects: Project[], sort: ProjectSort): Project[] {
  const sorted = [...projects]
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => (a.startingPriceInr ?? Infinity) - (b.startingPriceInr ?? Infinity))
      break
    case 'price-desc':
      sorted.sort((a, b) => (b.startingPriceInr ?? -Infinity) - (a.startingPriceInr ?? -Infinity))
      break
    case 'name':
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'featured':
    default:
      sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
      break
  }

  // Pin Omega Estates to the very top ALWAYS
  sorted.sort((a, b) => {
    if (a.slug === 'omega-estates') return -1
    if (b.slug === 'omega-estates') return 1
    return 0
  })

  // Force Emerald City to be the 3rd item (index 2)
  const emeraldIndex = sorted.findIndex(p => p.slug === 'emerald-city')
  if (emeraldIndex > -1) {
    const [emeraldCity] = sorted.splice(emeraldIndex, 1)
    const insertIndex = Math.min(2, sorted.length)
    sorted.splice(insertIndex, 0, emeraldCity)
  }

  return sorted
}

const DISTRICT_HEADERS: Record<
  string,
  { eyebrow: string; title: string; description: string }
> = {
  all: {
    eyebrow: 'Our Developments',
    title: 'Our Projects',
    description:
      'DTCP approved residential plots across Coimbatore, Namakkal, Madurai and Trichy — clear titles, wide roads and gated communities built for modern families.',
  },
  Coimbatore: {
    eyebrow: 'Coimbatore',
    title: 'Signature City',
    description:
      'Premium DTCP approved residential plots near Sulur, Coimbatore — 12 acres, 232 plots, black top roads, parks and 24×7 security.',
  },
  Namakkal: {
    eyebrow: 'Namakkal',
    title: 'Hitech City',
    description:
      'Modern DTCP approved gated community in Namakkal — wide roads, solar street lights, landscaped parks and 24×7 security.',
  },
  Madurai: {
    eyebrow: 'Madurai',
    title: 'Emerald City',
    description:
      'Lush DTCP approved residential plots in Madurai — tree-lined avenues, gated perimeter, parks and ready infrastructure.',
  },
  Trichy: {
    eyebrow: 'Trichy',
    title: 'Up Town & Eden Garden',
    description:
      'Two premium DTCP approved communities in Trichy — Up Town for urban living and Eden Garden for a garden-themed lifestyle.',
  },
}
/** Injected once — the keyframe that drives the district-switch animation. */
const FADE_UP_STYLE = `
  @keyframes districtFadeUp {
    from { opacity: 0; transform: translateY(32px); filter: blur(6px); }
    to   { opacity: 1; transform: translateY(0);    filter: blur(0px); }
  }
  .district-fade-up {
    animation: districtFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .district-fade-up-delay-1 {
    animation: districtFadeUp 0.5s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .district-fade-up-delay-2 {
    animation: districtFadeUp 0.5s 0.16s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
`

interface DistrictHeaderProps {
  eyebrow: string
  title: string
  description: string
}

/** Re-mounts on every key change → triggers fresh CSS animation. */
function DistrictHeader({ eyebrow, title, description }: DistrictHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-ink-900 pt-36 pb-16 text-cream-50 md:pt-44 md:pb-20">
      <style>{FADE_UP_STYLE}</style>
      <div aria-hidden className="bg-arch-grid absolute inset-0" />
      <div aria-hidden className="bg-gold-glow absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="district-fade-up mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-400 uppercase">
          <span aria-hidden className="h-px w-10 bg-gold-500/70" />
          {eyebrow}
        </p>
        <h1 className="district-fade-up-delay-1 max-w-3xl text-balance text-4xl leading-tight text-cream-50 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="district-fade-up-delay-2 mt-6 max-w-2xl text-base leading-relaxed text-cream-50/70 md:text-lg">
          {description}
        </p>
      </div>
    </header>
  )
}


export default function ProjectsPage() {
  const { data: projects, isLoading, isError, refetch } = useProjects()
  const [filters, setFilters] = useState<ProjectFiltersValue>(DEFAULT_PROJECT_FILTERS)
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(filters.search.trim().toLowerCase(), 250)
  const [animKey, setAnimKey] = useState(0)
  const [visible_header, setVisibleHeader] = useState(
    DISTRICT_HEADERS[DEFAULT_PROJECT_FILTERS.district] ?? DISTRICT_HEADERS.all,
  )
  const prevDistrict = useRef(DEFAULT_PROJECT_FILTERS.district)

  useEffect(() => {
    if (prevDistrict.current === filters.district) return
    prevDistrict.current = filters.district
    // Bump the key to re-trigger the CSS animation
    setAnimKey((k) => k + 1)
    setVisibleHeader(DISTRICT_HEADERS[filters.district] ?? DISTRICT_HEADERS.all)
  }, [filters.district])

  const budgetOptions = useMemo(
    () => [{ value: 'all', label: 'All Budgets' }, ...BUDGETS.map(({ value, label }) => ({ value, label }))],
    [],
  )

  const districts = useMemo(
    () => ['Coimbatore', 'Namakkal', 'Madurai', 'Tiruchirappalli'],
    [],
  )

  const header = visible_header

  const filtered = useMemo(() => {
    if (!projects) return []
    return projects.filter((project) => {
      if (filters.status !== 'all' && project.status !== filters.status) return false
      if (filters.district !== 'all' && project.district !== filters.district) return false
      if (filters.budget !== 'all') {
        const budget = BUDGETS.find((option) => option.value === filters.budget)
        if (!budget || !project.startingPriceInr || !budget.test(project.startingPriceInr)) return false
      }
      if (debouncedSearch) {
        const haystack = `${project.title} ${project.location} ${project.district} ${project.shortDescription}`.toLowerCase()
        if (!haystack.includes(debouncedSearch)) return false
      }
      return true
    })
  }, [projects, filters, debouncedSearch])

  const sorted = useMemo(() => sortProjects(filtered, filters.sort), [filtered, filters.sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <>
      <Seo
        title={filters.district === 'all' ? 'Projects' : `Projects in ${filters.district}`}
        description="Explore our DTCP approved residential plot projects across Coimbatore, Namakkal, Madurai and Trichy — clear titles, ready infrastructure and premium communities."
      />

      <DistrictHeader
        key={animKey}
        eyebrow={header.eyebrow}
        title={header.title}
        description={header.description}
      />

      <Section tone="cream" className="pt-10 md:pt-14">
        <Container>
          <ProjectFilters
            value={filters}
            onChange={(next) => {
              setFilters(next)
              setPage(1)
            }}
            districts={districts}
            budgetOptions={budgetOptions}
            resultCount={filtered.length}
          />

          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {isError ? (
              <div className="col-span-full">
                <ErrorState onRetry={() => void refetch()} />
              </div>
            ) : isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="aspect-[16/11] w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              : visible.map((project, index) => (
                  <Reveal key={project.id} delay={(index % 3) * 80} className="h-full">
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
          </div>

          {!isLoading && visible.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No projects match your search"
              description="Try adjusting or clearing your filters to see the full portfolio."
              action={
                <Link
                  to="/projects"
                  onClick={() => setFilters(DEFAULT_PROJECT_FILTERS)}
                  className={buttonStyles('outline-dark', 'md')}
                >
                  Reset Filters
                </Link>
              }
            />
          ) : null}

          {!isLoading && sorted.length > PAGE_SIZE ? (
            <Pagination current={currentPage} total={totalPages} onChange={setPage} className="mt-14" />
          ) : null}
        </Container>
      </Section>

      <CTABand />
    </>
  )
}
