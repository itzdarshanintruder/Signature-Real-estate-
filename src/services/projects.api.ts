import { IS_API_ENABLED } from '@/config/env'
import { projects as staticProjects } from '@/data/projects'
import type { Project } from '@/types/project'
import { apiFetch } from '@/services/api-client'

export async function fetchProjects(): Promise<Project[]> {
  if (!IS_API_ENABLED) return staticProjects

  const data = await apiFetch<any[]>('/projects')

  return data.map((item) => ({
    id: String(item.id),
    slug: item.slug,
    title: item.name,
    location: item.location,
    district: item.district,
    status: item.status?.toLowerCase() ?? 'available',
    plotSizes: ['30x40'],
    startingPriceInr: Number(item.starting_price_inr),
    acreage: item.total_area,
    tagline: item.name,
    description: item.description,
    shortDescription: item.description,
    overview: [item.description],
    features: [],
    amenities: [],
    images: [
      {
        src: item.hero_image,
        alt: item.name,
      },
    ],
    gallery: [],
    availablePlots: [],
    pricing: [],
    milestones: [],
    investmentBenefits: [],
    nearbyPlaces: [],
    faq: [],
    isFeatured: true,
  }))
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await fetchProjects()
  return projects.find((p) => p.slug === slug) ?? null
}