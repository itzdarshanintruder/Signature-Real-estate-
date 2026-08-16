import { Search, X } from 'lucide-react'
import { Select, type SelectOption } from '@/components/ui/Select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { DEFAULT_PROJECT_FILTERS, type ProjectFiltersValue } from '@/types/project'
import { cn } from '@/utils/cn'

const STATUS_OPTIONS: { value: ProjectFiltersValue['status']; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'available', label: 'Available' },
  { value: 'premium', label: 'Premium' },
  { value: 'launching', label: 'Launching' },
  { value: 'sold-out', label: 'Sold Out' },
]

interface ProjectFiltersProps {
  value: ProjectFiltersValue
  onChange: (next: ProjectFiltersValue) => void
  districts: string[]
  budgetOptions: SelectOption[]
  resultCount: number
}

function hasActiveFilters(value: ProjectFiltersValue): boolean {
  return (
    value.search.trim() !== '' ||
    value.status !== 'all' ||
    value.district !== 'all' ||
    value.budget !== 'all'
  )
}

/** Project listing toolbar — search, district/budget/status filters, sort, results, clear. */
export function ProjectFilters({
  value,
  onChange,
  districts,
  budgetOptions,
  resultCount,
}: ProjectFiltersProps) {
  const update = (patch: Partial<ProjectFiltersValue>) => onChange({ ...value, ...patch })

  const districtOptions: SelectOption[] = [
    { value: 'all', label: 'All Districts' },
    ...districts.map((district) => ({ value: district, label: district })),
  ]

  const sortOptions: SelectOption[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
  ]

  return (
    <div className="rounded-sm border border-ink-200 bg-cream-50 p-5 shadow-sm md:p-6">
      <div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_auto_auto_auto]">
        <label className="flex flex-col gap-2">
          <span className="text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
            Search
          </span>
          <span className="relative block">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-400"
            />
            <input
              type="search"
              value={value.search}
              onChange={(event) => update({ search: event.target.value })}
              placeholder="Search projects, districts…"
              aria-label="Search projects"
              className="w-full appearance-none rounded-sm border border-ink-900/20 bg-cream-50 py-3 pr-10 pl-11 text-sm font-medium text-ink-800 transition-colors duration-300 placeholder:text-ink-400 hover:border-gold-600 focus:border-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            />
            {value.search ? (
              <button
                type="button"
                onClick={() => update({ search: '' })}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-sm p-1 text-ink-400 transition-colors hover:text-gold-700"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
          </span>
        </label>

        <Select
          label="District"
          value={value.district}
          onChange={(district) => update({ district })}
          options={districtOptions}
        />
        <Select
          label="Budget"
          value={value.budget}
          onChange={(budget) => update({ budget })}
          options={budgetOptions}
        />
        <Select
          label="Sort By"
          value={value.sort}
          onChange={(sort) => update({ sort: sort as ProjectFiltersValue['sort'] })}
          options={sortOptions}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-ink-900/10 pt-5">
        <Tabs
          value={value.status}
          onValueChange={(status) => update({ status: status as ProjectFiltersValue['status'] })}
        >
          <TabsList className="gap-2">
            {STATUS_OPTIONS.map((option) => (
              <TabsTrigger key={option.value} value={option.value} variant="light">
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-4">
          <p className="text-sm text-ink-500" aria-live="polite">
            Showing <span className="font-semibold text-ink-800">{resultCount}</span>{' '}
            {resultCount === 1 ? 'project' : 'projects'}
          </p>
          {hasActiveFilters(value) ? (
            <button
              type="button"
              onClick={() => onChange(DEFAULT_PROJECT_FILTERS)}
              className={cn(
                'cursor-pointer text-sm font-semibold text-gold-700 underline-offset-4 transition-colors hover:text-gold-600 hover:underline',
              )}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
