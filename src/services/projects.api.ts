import { useLocalStore } from '@/store/local-store'
import { projects as staticProjects } from '@/data/projects'
import type { Project } from '@/types/project'

export async function fetchProjects(): Promise<Project[]> {
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