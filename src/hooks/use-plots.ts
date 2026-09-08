import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPlot,
  deletePlot,
  fetchPlot,
  fetchPlots,
  updatePlot,
} from '@/services/admin/plotService'
import type { PlotInput } from '@/types/admin'

const plotsKey = ['admin', 'plots'] as const
const plotKey = (id: string) => ['admin', 'plots', id] as const

export function usePlots() {
  return useQuery({ queryKey: plotsKey, queryFn: fetchPlots })
}

export function usePlot(id?: string) {
  return useQuery({
    queryKey: plotKey(id ?? ''),
    queryFn: () => fetchPlot(id!),
    enabled: Boolean(id),
  })
}

export function useCreatePlot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: PlotInput) => createPlot(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: plotsKey })
    },
  })
}

export function useUpdatePlot(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: PlotInput) => updatePlot(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: plotsKey })
      void queryClient.invalidateQueries({ queryKey: plotKey(id) })
    },
  })
}

export function useDeletePlot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePlot(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: plotsKey })
    },
  })
}
