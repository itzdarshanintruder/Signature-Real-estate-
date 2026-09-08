import { useLocalStore } from '@/store/local-store'
import { projects as staticProjects } from '@/data/projects'
import type { Project } from '@/types/project'
import { apiFetch, unwrap } from '@/services/api-client'
import { IS_API_ENABLED } from '@/config/env'

interface ProjectDto {
  id: string
  slug: string
  title: string
  status: Project['status']
  district: string
  location: string
  plot_sizes: string[]
  starting_price_inr: number | null
  acreage: string
  tagline: string
  description: string
  short_description: string
  overview: string[]
  features: string[]
  amenities: string[]
  investment_benefits: string[]
  is_featured: boolean
  is_active: boolean
}

export async function fetchProjects(): Promise<Project[]> {
  if (IS_API_ENABLED) {
    try {
      const response = await apiFetch<{ data: ProjectDto[] }>('/projects')
      const data = await unwrap(response)
      return data
        .filter((p) => p.is_active)
        .map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          location: p.location,
          district: p.district,
          status: p.status,
          plotSizes: p.plot_sizes ?? [],
          startingPriceInr: p.starting_price_inr ?? undefined,
          acreage: p.acreage,
          tagline: p.tagline,
          description: p.description,
          shortDescription: p.short_description,
          overview: p.overview ?? [p.description || p.short_description || p.title],
          features: p.features ?? [],
          amenities: p.amenities ?? [],
          images: [],
          gallery: [],
          availablePlots: [],
          pricing: [],
          milestones: [],
          investmentBenefits: p.investment_benefits ?? [],
          nearbyPlaces: [],
          faq: [],
          isFeatured: p.is_featured,
        }))
    } catch (error) {
      console.error('Failed to fetch projects from backend API, falling back to local storage', error)
    }
  }

  const local = useLocalStore.getState().projects

  const localConverted: Project[] = local
    .filter((p) => p.isActive)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      location: p.location,
      district: p.district,
      status: p.status,
      plotSizes: p.plotSizes,
      startingPriceInr: p.startingPriceInr,
      acreage: p.acreage,
      tagline: p.tagline,
      description: p.description,
      shortDescription: p.shortDescription,
      overview: [p.description || p.shortDescription || p.title],
      features: p.features,
      amenities: p.amenities,
      images: p.imageUrl ? [{ src: p.imageUrl, alt: p.title }] : [],
      gallery: p.layoutImageUrl ? [{ src: p.layoutImageUrl, alt: 'Layout Plan' }] : [],
      availablePlots: [],
      pricing: [],
      milestones: [],
      investmentBenefits: [],
      nearbyPlaces: [],
      faq: [],
      isFeatured: p.isFeatured,
    }))

  return [...localConverted, ...staticProjects]
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await fetchProjects()
  return projects.find((p) => p.slug === slug) ?? null
}