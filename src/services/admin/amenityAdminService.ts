import { apiFetch, unwrap } from '@/services/api-client'
import type { AdminAmenity, AmenityInput } from '@/types/admin'

/**
 * Amenities service — Xano-backed admin group.
 *
 *   GET    /amenities          -> list    { data: AmenityDto[] }
 *   GET    /amenities/{id}     -> detail  { data: AmenityDto | null }
 *   POST   /amenities          -> create  { data: AmenityDto } (body: AmenityInput)
 *   PUT    /amenities/{id}     -> update  { data: AmenityDto } (body: AmenityInput)
 *   DELETE /amenities/{id}     -> delete  { data: null }
 */

interface AmenityDto {
  id: string
  title: string
  description: string
  icon: string
  category: string
  display_order: number
  is_active: boolean
}

function fromDto(dto: AmenityDto): AdminAmenity {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    icon: dto.icon,
    category: dto.category,
    displayOrder: dto.display_order,
    isActive: dto.is_active,
  }
}

function toPayload(input: AmenityInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    icon: input.icon.trim(),
    category: input.category,
    display_order: input.displayOrder,
    is_active: input.isActive,
  }
}

export async function fetchAdminAmenities(): Promise<AdminAmenity[]> {
  const response = await apiFetch<{ data: AmenityDto[] }>('/amenities', { authorized: true })
  return (await unwrap(response)).map(fromDto)
}

export async function fetchAdminAmenity(id: string): Promise<AdminAmenity | null> {
  const response = await apiFetch<{ data: AmenityDto | null }>(`/amenities/${id}`, {
    authorized: true,
  })
  const dto = await unwrap(response)
  return dto ? fromDto(dto) : null
}

export async function createAmenity(input: AmenityInput): Promise<AdminAmenity> {
  const response = await apiFetch<{ data: AmenityDto }>('/amenities', {
    method: 'POST',
    authorized: true,
    body: JSON.stringify(toPayload(input)),
  })
  return fromDto(await unwrap(response))
}

export async function updateAmenity(id: string, input: AmenityInput): Promise<AdminAmenity> {
  const response = await apiFetch<{ data: AmenityDto }>(`/amenities/${id}`, {
    method: 'PUT',
    authorized: true,
    body: JSON.stringify(toPayload(input)),
  })
  return fromDto(await unwrap(response))
}

export async function deleteAmenity(id: string): Promise<void> {
  await apiFetch<{ data: null }>(`/amenities/${id}`, { method: 'DELETE', authorized: true })
}
