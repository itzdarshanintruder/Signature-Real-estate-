import { apiFetch, unwrap } from '@/services/api-client'
import type { Plot, PlotImage, PlotInput, PlotStatus } from '@/types/admin'

/**
 * Plot CRUD service — Xano-backed admin group.
 *
 *   GET    /plots                -> list    { data: PlotDto[] }
 *   GET    /plots/{id}           -> detail  { data: PlotDto }
 *   POST   /plots                -> create  { data: PlotDto } (body: plot payload)
 *   PUT    /plots/{id}           -> update  { data: PlotDto } (body: plot payload)
 *   DELETE /plots/{id}           -> delete  { data: null }
 *
 * DTO field names are snake_case; mapped to the camelCase `Plot` consumed by
 * the UI. The gallery is eager-loaded on the DTO as `gallery: PlotImageDto[]`.
 */

interface PlotImageDto {
  id: string
  url?: string
  file_name: string
  size?: number
  is_cover: boolean
  position: number
  alt?: string
}

interface PlotDto {
  id: string
  name: string
  location: string
  plot_number: string
  area: number
  price: number
  description: string
  status: PlotStatus
  amenities: string[]
  latitude?: number | null
  longitude?: number | null
  gallery?: PlotImageDto[]
  updated_at: string
}

function fromImageDto(dto: PlotImageDto): PlotImage {
  return {
    id: dto.id,
    url: dto.url,
    fileName: dto.file_name,
    size: dto.size,
    isCover: dto.is_cover,
    position: dto.position,
    alt: dto.alt,
  }
}

function fromDto(dto: PlotDto): Plot {
  return {
    id: dto.id,
    name: dto.name,
    location: dto.location,
    plotNumber: dto.plot_number,
    area: dto.area,
    price: dto.price,
    description: dto.description,
    status: dto.status,
    amenities: dto.amenities ?? [],
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
    gallery: (dto.gallery ?? []).map(fromImageDto),
    updatedAt: dto.updated_at,
  }
}

function toPayload(input: PlotInput) {
  return {
    name: input.name.trim(),
    location: input.location.trim(),
    plot_number: input.plotNumber.trim(),
    area: input.area,
    price: input.price,
    description: input.description.trim(),
    status: input.status,
    amenities: input.amenities,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
  }
}

export async function fetchPlots(): Promise<Plot[]> {
  const response = await apiFetch<{ data: PlotDto[] }>('/plots', { authorized: true })
  return (await unwrap(response)).map(fromDto)
}

export async function fetchPlot(id: string): Promise<Plot | null> {
  const response = await apiFetch<{ data: PlotDto | null }>(`/plots/${id}`, {
    authorized: true,
  })
  const dto = await unwrap(response)
  return dto ? fromDto(dto) : null
}

export async function createPlot(input: PlotInput): Promise<Plot> {
  const response = await apiFetch<{ data: PlotDto }>('/plots', {
    method: 'POST',
    authorized: true,
    body: JSON.stringify(toPayload(input)),
  })
  return fromDto(await unwrap(response))
}

export async function updatePlot(id: string, input: PlotInput): Promise<Plot> {
  const response = await apiFetch<{ data: PlotDto }>(`/plots/${id}`, {
    method: 'PUT',
    authorized: true,
    body: JSON.stringify(toPayload(input)),
  })
  return fromDto(await unwrap(response))
}

export async function deletePlot(id: string): Promise<void> {
  await apiFetch<{ data: null }>(`/plots/${id}`, { method: 'DELETE', authorized: true })
}
