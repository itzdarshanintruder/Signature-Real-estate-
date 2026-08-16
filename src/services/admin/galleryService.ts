import { apiFetch, unwrap } from '@/services/api-client'
import type { PlotImage } from '@/types/admin'

/**
 * Plot gallery service — Xano-backed admin group.
 *
 *   uploadGalleryImages  -> POST   /plots/{plotId}/images  (multipart, field `files`)
 *   deleteGalleryImage   -> DELETE /plots/{plotId}/images/{imageId}
 *   setCoverImage        -> PUT    /plots/{plotId}/images/{imageId}/cover
 *   reorderGalleryImages -> PUT    /plots/{plotId}/images/order (body: { image_ids: string[] })
 *
 * The backend owns gallery invariants: it assigns `is_cover = true` to the
 * first uploaded image when the plot has none yet, promotes the first remaining
 * image to cover after a cover is deleted, and normalises `position` on every
 * mutation. The UI refetches the plot after each mutation to mirror the store.
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

function fromDto(dto: PlotImageDto): PlotImage {
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

export async function uploadGalleryImages(plotId: string, files: File[]): Promise<PlotImage[]> {
  const body = new FormData()
  for (const file of files) {
    body.append('files', file)
  }
  const response = await apiFetch<{ data: PlotImageDto[] }>(`/plots/${plotId}/images`, {
    method: 'POST',
    authorized: true,
    body,
  })
  return (await unwrap(response)).map(fromDto)
}

export async function deleteGalleryImage(plotId: string, imageId: string): Promise<void> {
  await apiFetch<{ data: null }>(`/plots/${plotId}/images/${imageId}`, {
    method: 'DELETE',
    authorized: true,
  })
}

export async function setCoverImage(plotId: string, imageId: string): Promise<void> {
  await apiFetch<{ data: null }>(`/plots/${plotId}/images/${imageId}/cover`, {
    method: 'PUT',
    authorized: true,
  })
}

export async function reorderGalleryImages(plotId: string, orderedIds: string[]): Promise<void> {
  await apiFetch<{ data: null }>(`/plots/${plotId}/images/order`, {
    method: 'PUT',
    authorized: true,
    body: JSON.stringify({ image_ids: orderedIds }),
  })
}
