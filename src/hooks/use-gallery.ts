import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  deleteGalleryImage,
  reorderGalleryImages,
  setCoverImage,
  uploadGalleryImages,
} from '@/services/admin/galleryService'

const plotsKey = ['admin', 'plots'] as const
const plotKey = (id: string) => ['admin', 'plots', id] as const

function useGalleryMutations(plotId: string) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: plotsKey })
    void queryClient.invalidateQueries({ queryKey: plotKey(plotId) })
  }
  return { invalidate }
}

export function useUploadGalleryImages(plotId: string) {
  const { invalidate } = useGalleryMutations(plotId)
  return useMutation({
    mutationFn: (files: File[]) => uploadGalleryImages(plotId, files),
    onSuccess: invalidate,
  })
}

export function useDeleteGalleryImage(plotId: string) {
  const { invalidate } = useGalleryMutations(plotId)
  return useMutation({
    mutationFn: (imageId: string) => deleteGalleryImage(plotId, imageId),
    onSuccess: invalidate,
  })
}

export function useSetCoverImage(plotId: string) {
  const { invalidate } = useGalleryMutations(plotId)
  return useMutation({
    mutationFn: (imageId: string) => setCoverImage(plotId, imageId),
    onSuccess: invalidate,
  })
}

export function useReorderGalleryImages(plotId: string) {
  const { invalidate } = useGalleryMutations(plotId)
  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderGalleryImages(plotId, orderedIds),
    onSuccess: invalidate,
  })
}
