import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createOmegaPlot,
  deleteOmegaPlot,
  fetchOmegaPlot,
  fetchOmegaPlots,
  updateOmegaPlot,
} from '@/services/admin/omegaPlotService'
import type { OmegaPlotInput } from '@/services/admin/omegaPlotService'

const omegaPlotsKey = ['admin', 'omega-plots'] as const
const omegaPlotKey = (id: string) => ['admin', 'omega-plots', id] as const

export function useOmegaPlots() {
  return useQuery({ queryKey: omegaPlotsKey, queryFn: fetchOmegaPlots })
}

export function useOmegaPlot(id?: string) {
  return useQuery({
    queryKey: omegaPlotKey(id ?? ''),
    queryFn: () => fetchOmegaPlot(id!),
    enabled: Boolean(id),
  })
}

export function useCreateOmegaPlot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: OmegaPlotInput) => createOmegaPlot(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: omegaPlotsKey })
    },
  })
}

export function useUpdateOmegaPlot(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: OmegaPlotInput) => updateOmegaPlot(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: omegaPlotsKey })
      void queryClient.invalidateQueries({ queryKey: omegaPlotKey(id) })
    },
  })
}

export function useDeleteOmegaPlot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteOmegaPlot(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: omegaPlotsKey })
    },
  })
}
