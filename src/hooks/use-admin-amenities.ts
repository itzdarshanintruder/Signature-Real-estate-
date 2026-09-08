import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAmenity,
  deleteAmenity,
  fetchAdminAmenities,
  fetchAdminAmenity,
  updateAmenity,
} from '@/services/admin/amenityAdminService'
import type { AmenityInput } from '@/types/admin'

const listKey = ['admin', 'amenities'] as const
const rowKey = (id: string) => ['admin', 'amenities', id] as const

export function useAdminAmenities() {
  return useQuery({ queryKey: listKey, queryFn: fetchAdminAmenities })
}

export function useAdminAmenity(id?: string) {
  return useQuery({
    queryKey: rowKey(id ?? ''),
    queryFn: () => fetchAdminAmenity(id!),
    enabled: Boolean(id),
  })
}

export function useCreateAmenity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AmenityInput) => createAmenity(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}

export function useUpdateAmenity(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AmenityInput) => updateAmenity(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
      void queryClient.invalidateQueries({ queryKey: rowKey(id) })
    },
  })
}

export function useDeleteAmenity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAmenity(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}
