import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchSiteContentRow,
  fetchSiteContentRows,
  updateSiteContentRow,
} from '@/services/admin/siteContentAdminService'
import type { SiteContentInput } from '@/types/admin'

const listKey = ['admin', 'site-content'] as const
const rowKey = (id: string) => ['admin', 'site-content', id] as const

export function useAdminSiteContent() {
  return useQuery({ queryKey: listKey, queryFn: fetchSiteContentRows })
}

export function useAdminSiteContentRow(id?: string) {
  return useQuery({
    queryKey: rowKey(id ?? ''),
    queryFn: () => fetchSiteContentRow(id!),
    enabled: Boolean(id),
  })
}

export function useUpdateSiteContent(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SiteContentInput) => updateSiteContentRow(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
      void queryClient.invalidateQueries({ queryKey: rowKey(id) })
    },
  })
}
