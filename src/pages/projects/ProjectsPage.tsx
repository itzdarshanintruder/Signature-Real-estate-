import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
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

function sortProjects(projects: Project[], sort: ProjectSort): Project[] {  const sorted = [...projects]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.startingPriceInr ?? Infinity) - (b.startingPriceInr ?? Infinity))
    case 'price-desc':
      return sorted.sort((a, b) => (b.startingPriceInr ?? -Infinity) - (a.startingPriceInr ?? -Infinity))
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'featured':
    default:
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
  }
}

export default function ProjectsPage() {
  const { data: projects, isLoading, isError, refetch } = useProjects()
  const [filters, setFilters] = useState<ProjectFiltersValue>(DEFAULT_PROJECT_FILTERS)
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(filters.search.trim().toLowerCase(), 250)

  const { districts, budgetOptions } = useMemo(() => {
    const districtSet = [...new Set((projects ?? []).map((project) => project.district))]
    return {
      districts: districtSet.sort((a, b) => a.localeCompare(b)),
      budgetOptions: [{ value: 'all', label: 'All Budgets' }, ...BUDGETS.map(({ value, label }) => ({ value, label }))],
    }
  }, [projects])

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
        title="Projects"
        description="Explore Signature City's premium residential plot projects — available, premium and launching phases with clear titles."
      />
      <PageHeader
        eyebrow="Our Developments"
        title="Signature Projects"
        description="Every phase of Signature City is a complete, secure community — DTCP approved, clear title, and planned for modern living."
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
