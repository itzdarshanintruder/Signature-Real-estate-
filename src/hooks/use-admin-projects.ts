import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAdminProject,
  deleteAdminProject,
  fetchAdminProject,
  fetchAdminProjects,
  updateAdminProject,
} from '@/services/admin/projectAdminService'
import type { ProjectInput } from '@/types/admin'

const listKey = ['admin', 'projects'] as const
const rowKey = (id: string) => ['admin', 'projects', id] as const

export function useAdminProjects() {
  return useQuery({ queryKey: listKey, queryFn: fetchAdminProjects })
}

export function useAdminProject(id?: string) {
  return useQuery({
    queryKey: rowKey(id ?? ''),
    queryFn: () => fetchAdminProject(id!),
    enabled: Boolean(id),
  })
}

export function useCreateAdminProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) => createAdminProject(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}

export function useUpdateAdminProject(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) => updateAdminProject(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
      void queryClient.invalidateQueries({ queryKey: rowKey(id) })
    },
  })
}

export function useDeleteAdminProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminProject(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}
