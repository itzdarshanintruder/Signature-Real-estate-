import { apiFetch, unwrap } from '@/services/api-client'
import type { AdminSiteContentRow, SiteContentInput, SiteContentKey } from '@/types/admin'

/**
 * Site content block service — Xano-backed admin group.
 *
 *   GET    /site_content          -> list    { data: SiteContentRowDto[] }
 *   GET    /site_content/{id}     -> detail  { data: SiteContentRowDto | null }
 *   POST   /site_content          -> create  { data: SiteContentRowDto } (body: key + content)
 *   PUT    /site_content/{id}     -> update  { data: SiteContentRowDto } (body: content, is_active)
 *   DELETE /site_content/{id}     -> delete  { data: null }
 */

interface SiteContentRowDto {
  id: string
  key: SiteContentKey
  content: unknown
  is_active: boolean
}

function fromDto(dto: SiteContentRowDto): AdminSiteContentRow {
  return {
    id: dto.id,
    key: dto.key,
    content: dto.content,
    isActive: dto.is_active,
  }
}

export async function fetchSiteContentRows(): Promise<AdminSiteContentRow[]> {
  const response = await apiFetch<{ data: SiteContentRowDto[] }>('/site_content', {
    authorized: true,
  })
  return (await unwrap(response)).map(fromDto)
}

export async function fetchSiteContentRow(id: string): Promise<AdminSiteContentRow | null> {
  const response = await apiFetch<{ data: SiteContentRowDto | null }>(`/site_content/${id}`, {
    authorized: true,
  })
  const dto = await unwrap(response)
  return dto ? fromDto(dto) : null
}

export async function updateSiteContentRow(
  id: string,
  input: SiteContentInput,
): Promise<AdminSiteContentRow> {
  const response = await apiFetch<{ data: SiteContentRowDto }>(`/site_content/${id}`, {
    method: 'PUT',
    authorized: true,
    body: JSON.stringify({
      content: input.content,
      is_active: input.isActive,
    }),
  })
  return fromDto(await unwrap(response))
}
