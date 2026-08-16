import { apiFetch, unwrap } from '@/services/api-client'
import type { AdminNearbyPlace, NearbyPlaceInput } from '@/types/admin'

/**
 * Nearby places service — Xano-backed admin group.
 *
 *   GET    /nearby_places           -> list    { data: NearbyPlaceDto[] }
 *   GET    /nearby_places/{id}      -> detail  { data: NearbyPlaceDto | null }
 *   POST   /nearby_places           -> create  { data: NearbyPlaceDto } (body: NearbyPlaceInput)
 *   PUT    /nearby_places/{id}      -> update  { data: NearbyPlaceDto } (body: NearbyPlaceInput)
 *   DELETE /nearby_places/{id}      -> delete  { data: null }
 */

interface NearbyPlaceDto {
  id: string
  name: string
  category: AdminNearbyPlace['category']
  distance: string
  project_id: string | null
  display_order: number
  is_active: boolean
}

function fromDto(dto: NearbyPlaceDto): AdminNearbyPlace {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category,
    distance: dto.distance,
    projectId: dto.project_id,
    displayOrder: dto.display_order,
    isActive: dto.is_active,
  }
}

function toPayload(input: NearbyPlaceInput) {
  return {
    name: input.name.trim(),
    category: input.category,
    distance: input.distance.trim(),
    project_id: input.projectId,
    display_order: input.displayOrder,
    is_active: input.isActive,
  }
}

export async function fetchAdminNearbyPlaces(): Promise<AdminNearbyPlace[]> {
  const response = await apiFetch<{ data: NearbyPlaceDto[] }>('/nearby_places', {
    authorized: true,
  })
  return (await unwrap(response)).map(fromDto)
}

export async function fetchAdminNearbyPlace(id: string): Promise<AdminNearbyPlace | null> {
  const response = await apiFetch<{ data: NearbyPlaceDto | null }>(`/nearby_places/${id}`, {
    authorized: true,
  })
  const dto = await unwrap(response)
  return dto ? fromDto(dto) : null
}

export async function createNearbyPlace(input: NearbyPlaceInput): Promise<AdminNearbyPlace> {
  const response = await apiFetch<{ data: NearbyPlaceDto }>('/nearby_places', {
    method: 'POST',
    authorized: true,
    body: JSON.stringify(toPayload(input)),
  })
  return fromDto(await unwrap(response))
}

export async function updateNearbyPlace(
  id: string,
  input: NearbyPlaceInput,
): Promise<AdminNearbyPlace> {
  const response = await apiFetch<{ data: NearbyPlaceDto }>(`/nearby_places/${id}`, {
    method: 'PUT',
    authorized: true,
    body: JSON.stringify(toPayload(input)),
  })
  return fromDto(await unwrap(response))
}

export async function deleteNearbyPlace(id: string): Promise<void> {
  await apiFetch<{ data: null }>(`/nearby_places/${id}`, {
    method: 'DELETE',
    authorized: true,
  })
}
