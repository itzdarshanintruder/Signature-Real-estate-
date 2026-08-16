import { apiFetch, unwrap } from '@/services/api-client'
import type { AdminProject, ProjectInput } from '@/types/admin'

/**
 * Projects service (admin) — Xano-backed admin group. Mirrors the public
 * `/projects` DTO but returns ALL projects (including inactive) and maps to
 * the camelCase `AdminProject`. Children (images, plots, pricing, milestones,
 * nearby places, faqs) are managed via their own endpoints.
 *
 *   GET    /projects          -> list    { data: ProjectDto[] }
 *   GET    /projects/{id}     -> detail  { data: ProjectDto | null }
 *   POST   /projects          -> create  { data: ProjectDto } (body: project payload)
 *   PUT    /projects/{id}     -> update  { data: ProjectDto } (body: project payload)
 *   DELETE /projects/{id}     -> delete  { data: null }
 */

interface ProjectDto {
  id: string
  slug: string
  title: string
  status: AdminProject['status']
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
  display_order: number
  is_active: boolean
}

function fromDto(dto: ProjectDto): AdminProject {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    status: dto.status,
    district: dto.district,
    location: dto.location,
    plotSizes: dto.plot_sizes ?? [],
    startingPriceInr: dto.starting_price_inr,
    acreage: dto.acreage,
    tagline: dto.tagline,
    description: dto.description,
    shortDescription: dto.short_description,
    overview: dto.overview ?? [],
    features: dto.features ?? [],
    amenities: dto.amenities ?? [],
    investmentBenefits: dto.investment_benefits ?? [],
    isFeatured: dto.is_featured,
    displayOrder: dto.display_order,
    isActive: dto.is_active,
  }
}

function toPayload(input: ProjectInput) {
  return {
    slug: input.slug.trim().toLowerCase().replace(/\s+/g, '-'),
    title: input.title.trim(),
    status: input.status,
    district: input.district.trim(),
    location: input.location.trim(),
    plot_sizes: input.plotSizes,
    starting_price_inr: input.startingPriceInr,
    acreage: input.acreage.trim(),
    tagline: input.tagline.trim(),
    description: input.description.trim(),
    short_description: input.shortDescription.trim(),
    overview: input.overview,
    features: input.features,
    amenities: input.amenities,
    investment_benefits: input.investmentBenefits,
    is_featured: input.isFeatured,
    display_order: input.displayOrder,
    is_active: input.isActive,
  }
}

export async function fetchAdminProjects(): Promise<AdminProject[]> {
  const response = await apiFetch<{ data: ProjectDto[] }>('/projects', { authorized: true })
  return (await unwrap(response)).map(fromDto)
}

export async function fetchAdminProject(id: string): Promise<AdminProject | null> {
  const response = await apiFetch<{ data: ProjectDto | null }>(`/projects/${id}`, {
    authorized: true,
  })
  const dto = await unwrap(response)
  return dto ? fromDto(dto) : null
}

export async function createAdminProject(input: ProjectInput): Promise<AdminProject> {
  const response = await apiFetch<{ data: ProjectDto }>('/projects', {
    method: 'POST',
    authorized: true,
    body: JSON.stringify(toPayload(input)),
  })
  return fromDto(await unwrap(response))
}

export async function updateAdminProject(id: string, input: ProjectInput): Promise<AdminProject> {
  const response = await apiFetch<{ data: ProjectDto }>(`/projects/${id}`, {
    method: 'PUT',
    authorized: true,
    body: JSON.stringify(toPayload(input)),
  })
  return fromDto(await unwrap(response))
}

export async function deleteAdminProject(id: string): Promise<void> {
  await apiFetch<{ data: null }>(`/projects/${id}`, { method: 'DELETE', authorized: true })
}
