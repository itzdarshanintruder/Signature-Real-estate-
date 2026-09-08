import type { FaqItem, GrowthDatum, ImageAsset } from '@/types/content'

export type ProjectStatus = 'available' | 'premium' | 'launching' | 'sold-out'

export type PlotAvailability = 'available' | 'reserved' | 'sold'

export interface AvailablePlot {
  id: string
  /** Plot dimension label, e.g. `15×30`. */
  size: string
  /** Total built-up area, e.g. `4500 sq. ft.` */
  dimensions: string
  /** Facing / orientation, e.g. `East`, `Garden-facing`, `Corner`. */
  facing: string
  priceInr: number
  status: PlotAvailability
}

export interface PricingRow {
  size: string
  dimensions: string
  startPriceInr: number
  note?: string
}

export interface Milestone {
  phase: string
  title: string
  description: string
}

export interface NearbyPlace {
  name: string
  category: string
  /** Distance from the project, e.g. `2.4 km`. */
  distance: string
}

export interface Project {
  id: string
  slug: string
  title: string
  location: string
  /** Filterable zone the project belongs to, e.g. `Growth Corridor`. */
  district: string
  status: ProjectStatus
  plotSizes: string[]
  /** Starting price in INR. Absent = "Contact us". */
  startingPriceInr?: number
  acreage: string
  tagline: string
  /** SEO / meta blurb. */
  description: string
  /** Short card copy shown on the listing page. */
  shortDescription: string
  /** Detail-page prose paragraphs. */
  overview: string[]
  features: string[]
  amenities: string[]
  images: ImageAsset[]
  /** Detail-page image gallery. */
  gallery: ImageAsset[]
  masterPlan?: ImageAsset
  availablePlots: AvailablePlot[]
  pricing: PricingRow[]
  milestones: Milestone[]
  investmentBenefits: string[]
  /** Optional per-project growth index; falls back to the site-wide series. */
  investmentGrowth?: GrowthDatum[]
  nearbyPlaces: NearbyPlace[]
  faq: FaqItem[]
  isFeatured: boolean
}

export type ProjectStatusFilter = ProjectStatus | 'all'

export type ProjectSort = 'featured' | 'price-asc' | 'price-desc' | 'name'

export interface ProjectFiltersValue {
  search: string
  status: ProjectStatusFilter
  district: string
  budget: string
  sort: ProjectSort
}

export const DEFAULT_PROJECT_FILTERS: ProjectFiltersValue = {
  search: '',
  status: 'all',
  district: 'all',
  budget: 'all',
  sort: 'featured',
}
