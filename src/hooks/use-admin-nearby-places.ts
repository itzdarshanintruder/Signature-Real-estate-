import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createNearbyPlace,
  deleteNearbyPlace,
  fetchAdminNearbyPlace,
  fetchAdminNearbyPlaces,
  updateNearbyPlace,
} from '@/services/admin/nearbyPlaceAdminService'
import type { NearbyPlaceInput } from '@/types/admin'

const listKey = ['admin', 'nearby-places'] as const
const rowKey = (id: string) => ['admin', 'nearby-places', id] as const

export function useAdminNearbyPlaces() {
  return useQuery({ queryKey: listKey, queryFn: fetchAdminNearbyPlaces })
}

export function useAdminNearbyPlace(id?: string) {
  return useQuery({
    queryKey: rowKey(id ?? ''),
    queryFn: () => fetchAdminNearbyPlace(id!),
    enabled: Boolean(id),
  })
}

export function useCreateNearbyPlace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NearbyPlaceInput) => createNearbyPlace(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}

export function useUpdateNearbyPlace(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NearbyPlaceInput) => updateNearbyPlace(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
      void queryClient.invalidateQueries({ queryKey: rowKey(id) })
    },
  })
}

export function useDeleteNearbyPlace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNearbyPlace(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}
