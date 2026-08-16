/** Lifecycle status of a plot/project shown in the admin dashboard. */
export type PlotStatus = 'available' | 'sold' | 'reserved' | 'coming-soon'

export const PLOT_STATUSES: readonly PlotStatus[] = [
  'available',
  'sold',
  'reserved',
  'coming-soon',
] as const

export const PLOT_STATUS_LABELS: Record<PlotStatus, string> = {
  available: 'Available',
  sold: 'Sold',
  reserved: 'Reserved',
  'coming-soon': 'Coming Soon',
}

/** A single gallery image attached to a plot. */
export interface PlotImage {
  id: string
  /** Remote/CDN URL, or a `blob:` object URL for locally uploaded mock images. */
  url?: string
  /** Original file name, e.g. `plot-front.webp`. */
  fileName: string
  /** File size in bytes, when known. */
  size?: number
  isCover: boolean
  /** Zero-based ordering within the plot gallery. */
  position: number
  alt?: string
}

/** A plot/project managed from the admin dashboard. */
export interface Plot {
  id: string
  name: string
  location: string
  plotNumber: string
  area: number
  price: number
  description: string
  status: PlotStatus
  amenities: string[]
  latitude?: number | null
  longitude?: number | null
  gallery: PlotImage[]
  /** ISO timestamp of the last create/update/upload. */
  updatedAt: string
}

/** Editable shape submitted by the plot form. */
export interface PlotInput {
  name: string
  location: string
  plotNumber: string
  area: number
  price: number
  description: string
  status: PlotStatus
  amenities: string[]
  latitude?: number | null
  longitude?: number | null
}

/* ---------- Site content (T10) ---------- */

export const SITE_CONTENT_KEYS = [
  'hero',
  'hero_card',
  'trust_bar',
  'stats',
  'location',
  'premium_plots',
  'investment',
  'investment_growth_ref',
  'why_choose',
  'about',
  'journey',
  'amenity_pillars',
] as const

export type SiteContentKey = (typeof SITE_CONTENT_KEYS)[number]

export const SITE_CONTENT_KEY_LABELS: Record<SiteContentKey, string> = {
  hero: 'Hero',
  hero_card: 'Hero Card',
  trust_bar: 'Trust Bar',
  stats: 'Stats',
  location: 'Location Highlights',
  premium_plots: 'Premium Plots',
  investment: 'Investment',
  investment_growth_ref: 'Investment Growth Ref',
  why_choose: 'Why Choose',
  about: 'About',
  journey: 'Journey',
  amenity_pillars: 'Amenity Pillars',
}

export interface AdminSiteContentRow {
  id: string
  key: SiteContentKey
  /** Typed JSON block matching the public section shape. */
  content: unknown
  isActive: boolean
}

export interface SiteContentInput {
  content: unknown
  isActive: boolean
}

/* ---------- Amenities (T11) ---------- */

export type AmenityCategory = 'Lifestyle' | 'Security' | 'Community' | 'Infrastructure'

export interface AdminAmenity {
  id: string
  title: string
  description: string
  icon: string
  category: string
  displayOrder: number
  isActive: boolean
}

export interface AmenityInput {
  title: string
  description: string
  icon: string
  category: string
  displayOrder: number
  isActive: boolean
}

/* ---------- Nearby places (T6) ---------- */

export const NEARBY_PLACE_CATEGORIES = [
  'School',
  'Hospital',
  'Shopping',
  'Connectivity',
  'Transit',
  'Recreation',
] as const

export type NearbyPlaceCategory = (typeof NEARBY_PLACE_CATEGORIES)[number]

export interface AdminNearbyPlace {
  id: string
  name: string
  category: NearbyPlaceCategory
  distance: string
  projectId: string | null
  displayOrder: number
  isActive: boolean
}

export interface NearbyPlaceInput {
  name: string
  category: NearbyPlaceCategory
  distance: string
  projectId: string | null
  displayOrder: number
  isActive: boolean
}

/* ---------- Projects (T1) — admin core fields ---------- */

export interface AdminProject {
  id: string
  slug: string
  title: string
  status: 'available' | 'premium' | 'launching' | 'sold-out'
  district: string
  location: string
  plotSizes: string[]
  startingPriceInr: number | null
  acreage: string
  tagline: string
  description: string
  shortDescription: string
  overview: string[]
  features: string[]
  amenities: string[]
  investmentBenefits: string[]
  isFeatured: boolean
  displayOrder: number
  isActive: boolean
}

export interface ProjectInput {
  slug: string
  title: string
  status: AdminProject['status']
  district: string
  location: string
  plotSizes: string[]
  startingPriceInr: number | null
  acreage: string
  tagline: string
  description: string
  shortDescription: string
  overview: string[]
  features: string[]
  amenities: string[]
  investmentBenefits: string[]
  isFeatured: boolean
  displayOrder: number
  isActive: boolean
}
