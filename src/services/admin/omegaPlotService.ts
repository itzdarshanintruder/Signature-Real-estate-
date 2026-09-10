import { apiFetch, unwrap } from '@/services/api-client'

export interface OmegaPlotImage {
  url: string
  isCover: boolean
}

export interface OmegaPlot {
  id: string
  plotNumber: string
  block: 'A' | 'B'
  width: number
  length: number
  areaSqFt: number
  status: 'Available' | 'Reserved' | 'Sold'
  notes: string
  images: OmegaPlotImage[]
}

export type OmegaPlotInput = Omit<OmegaPlot, 'id'>

export async function fetchOmegaPlots(): Promise<OmegaPlot[]> {
  const response = await apiFetch<{ data: OmegaPlot[] }>('/api/omega-plots')
  return await unwrap(response)
}

export async function fetchOmegaPlot(id: string): Promise<OmegaPlot | null> {
  const response = await apiFetch<{ data: OmegaPlot }>(`/api/omega-plots/${id}`)
  return await unwrap(response)
}

export async function createOmegaPlot(input: OmegaPlotInput): Promise<OmegaPlot> {
  const response = await apiFetch<{ data: OmegaPlot }>('/api/omega-plots', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return await unwrap(response)
}

export async function updateOmegaPlot(id: string, input: OmegaPlotInput): Promise<OmegaPlot> {
  const response = await apiFetch<{ data: OmegaPlot }>(`/api/omega-plots/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
  return await unwrap(response)
}

export async function deleteOmegaPlot(id: string): Promise<void> {
  await apiFetch<{ data: null }>(`/api/omega-plots/${id}`, { method: 'DELETE' })
}
