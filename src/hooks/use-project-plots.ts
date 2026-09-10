import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProjectPlot,
  deleteProjectPlot,
  fetchProjectPlot,
  fetchProjectPlots,
  updateProjectPlot,
} from '@/services/admin/projectPlotService'
import type { ProjectPlotInput } from '@/services/admin/projectPlotService'

const projectPlotsKeys = {
  all: ['project-plots'] as const,
  lists: () => [...projectPlotsKeys.all, 'list'] as const,
  list: (projectId: string) => [...projectPlotsKeys.lists(), projectId] as const,
  details: () => [...projectPlotsKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectPlotsKeys.details(), id] as const,
}

export function useProjectPlots(projectId?: string) {
  return useQuery({
    queryKey: projectPlotsKeys.list(projectId!),
    queryFn: () => fetchProjectPlots(projectId!),
    enabled: Boolean(projectId),
  })
}

export function useProjectPlot(id?: string) {
  return useQuery({
    queryKey: projectPlotsKeys.detail(id!),
    queryFn: () => fetchProjectPlot(id!),
    enabled: Boolean(id),
  })
}

export function useCreateProjectPlot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectPlotInput) => createProjectPlot(input),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: projectPlotsKeys.list(data.projectId) })
    },
  })
}

export function useUpdateProjectPlot(id: string, projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectPlotInput) => updateProjectPlot(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectPlotsKeys.list(projectId) })
      void queryClient.invalidateQueries({ queryKey: projectPlotsKeys.detail(id) })
    },
  })
}

export function useDeleteProjectPlot(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProjectPlot(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectPlotsKeys.list(projectId) })
    },
  })
}
