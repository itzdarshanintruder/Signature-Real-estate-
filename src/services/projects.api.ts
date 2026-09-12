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
      const mapped = data
        .filter((p) => p.is_active)
        .map((p) => ({
          id: p.id,
          // Normalise legacy DB slug so the public URL /projects/signature-city resolves.
          slug: p.slug === 'signature-city-sulur' ? 'signature-city' : p.slug,
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
          images: p.slug === 'omega-estates' 
            ? [{ src: '/projects/omega-estates/entrance.jpg', alt: 'Omega Estates Entrance' }]
            : p.slug === 'signature-city-sulur'
            ? [{ src: '/projects/signature-city/entrance.jpg', alt: 'Signature City Entrance' }]
            : p.slug === 'hitech-city'
            ? [{ src: '/projects/hitech-city/entrance.jpg', alt: 'Hitech City Entrance' }]
            : p.slug === 'emerald-city'
            ? [{ src: '/projects/emerald-city/entrance.jpg', alt: 'Emerald City Entrance' }]
            : p.slug === 'up-town'
            ? [{ src: '/projects/up-town/entrance.jpg', alt: 'UP TOWN Entrance' }]
            : [],
          gallery: p.slug === 'emerald-city'
            ? [
                { src: '/projects/emerald-city/overview.jpg', alt: 'Emerald City Overview' },
                { src: '/projects/emerald-city/route-map.jpg', alt: 'Emerald City Route Map' },
                { src: '/projects/emerald-city/proximities.jpg', alt: 'Emerald City Proximities' },
                { src: '/projects/emerald-city/master-plan.jpg', alt: 'Emerald City Master Plan' }
              ]
            : p.slug === 'up-town'
            ? [
                { src: '/projects/up-town/overview.jpg', alt: 'UP TOWN Overview' },
                { src: '/projects/up-town/route-map.jpg', alt: 'UP TOWN Route Map' },
                { src: '/projects/up-town/proximities.jpg', alt: 'UP TOWN Proximities' },
                { src: '/projects/up-town/master-plan.jpg', alt: 'UP TOWN Master Plan' }
              ]
            : [],
          availablePlots: [],
          pricing: [],
          milestones: [],
          investmentBenefits: p.investment_benefits ?? [],
          nearbyPlaces: [],
          faq: [],
          isFeatured: p.is_featured,
        }))

      // For any API project whose gallery is empty, fall back to the matching
      // static project gallery (which has fully-wired src paths).
      return mapped.map((apiProject) => {
        if (apiProject.gallery.length > 0) return apiProject
        const staticMatch = staticProjects.find((s) => s.slug === apiProject.slug)
        if (staticMatch && staticMatch.gallery.length > 0) {
          return { ...apiProject, gallery: staticMatch.gallery }
        }
        return apiProject
      })
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