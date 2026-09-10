import { apiFetch, unwrap } from '@/services/api-client'

export interface ProjectPlotImage {
  url: string
  isCover: boolean
}

export interface ProjectPlot {
  id: string
  projectId: string
  plotNumber: string
  block: string
  width: number
  length: number
  areaSqFt: number
  facing: string
  status: 'Available' | 'Reserved' | 'Sold'
  price: number | null
  description: string
  images: ProjectPlotImage[]
}

export type ProjectPlotInput = Omit<ProjectPlot, 'id'>

export async function fetchProjectPlots(projectId: string): Promise<ProjectPlot[]> {
  const response = await apiFetch<{ data: ProjectPlot[] }>(`/api/project-plots?projectId=${projectId}`)
  return unwrap(response)
}

export async function fetchProjectPlot(id: string): Promise<ProjectPlot | null> {
  const response = await apiFetch<{ data: ProjectPlot | null }>(`/api/project-plots/${id}`)
  return unwrap(response)
}

export async function createProjectPlot(input: ProjectPlotInput): Promise<ProjectPlot> {
  const response = await apiFetch<{ data: ProjectPlot }>('/api/project-plots', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return unwrap(response)
}

export async function updateProjectPlot(id: string, input: ProjectPlotInput): Promise<ProjectPlot> {
  const response = await apiFetch<{ data: ProjectPlot }>(`/api/project-plots/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
  return unwrap(response)
}

export async function deleteProjectPlot(id: string): Promise<void> {
  await apiFetch<{ data: null }>(`/api/project-plots/${id}`, { method: 'DELETE' })
}
