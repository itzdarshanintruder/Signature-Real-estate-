import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Images } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { GalleryGrid } from '@/components/admin/GalleryGrid'
import { GalleryUploader } from '@/components/admin/GalleryUploader'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Seo } from '@/components/ui/Seo'
import {
  useDeleteGalleryImage,
  useReorderGalleryImages,
  useSetCoverImage,
  useUploadGalleryImages,
} from '@/hooks/use-gallery'
import { usePlot } from '@/hooks/use-plots'
import { useUiStore } from '@/store/ui-store'
import type { PlotImage } from '@/types/admin'

export default function GalleryManagerPage() {
  const { plotId } = useParams()
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)

  const id = plotId ?? ''
  const { data: plot, isLoading, isError } = usePlot(plotId)

  const uploadMutation = useUploadGalleryImages(id)
  const deleteMutation = useDeleteGalleryImage(id)
  const coverMutation = useSetCoverImage(id)
  const reorderMutation = useReorderGalleryImages(id)

  const [pendingDelete, setPendingDelete] = useState<PlotImage | null>(null)
  const [busyImageId, setBusyImageId] = useState<string | null>(null)

  const confirmDelete = () => {
    if (!pendingDelete) return
    setBusyImageId(pendingDelete.id)
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => {
        pushToast(`Deleted ${pendingDelete.fileName}.`)
        setPendingDelete(null)
      },
      onError: () => {
        pushToast('Could not delete the image. Please try again.', 'error')
        setPendingDelete(null)
      },
      onSettled: () => setBusyImageId(null),
    })
  }

  const handleSetCover = (image: PlotImage) => {
    setBusyImageId(image.id)
    coverMutation.mutate(image.id, {
      onSuccess: () => pushToast(`Set “${image.fileName}” as the cover image.`),
      onError: () => pushToast('Could not update the cover image.', 'error'),
      onSettled: () => setBusyImageId(null),
    })
  }

  const handleMove = (imageId: string, delta: -1 | 1) => {
    if (!plot) return
    const order = plot.gallery.map((image) => image.id)
    const from = order.indexOf(imageId)
    const to = from + delta
    if (from < 0 || to < 0 || to >= order.length) return
    const [moved] = order.splice(from, 1)
    order.splice(to, 0, moved)

    setBusyImageId(imageId)
    reorderMutation.mutate(order, {
      onSuccess: () => pushToast('Gallery order updated.'),
      onError: () => pushToast('Could not reorder the gallery.', 'error'),
      onSettled: () => setBusyImageId(null),
    })
  }

  return (
    <>
      <Seo
        title="Manage Gallery"
        description="Upload, reorder and manage gallery images for a plot."
      />
      <AdminHeader />

      <main className="min-h-svh bg-cream-100 pb-24">
        <Container className="pt-10">
          <Link
            to="/admin/plots"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors hover:text-gold-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to plots
          </Link>

          {isLoading ? (
            <div className="mt-8 space-y-6">
              <Skeleton className="h-10 w-2/3 max-w-md" />
              <Skeleton className="h-3 w-1/3 max-w-xs" />
              <Skeleton className="h-44 w-full" />
            </div>
          ) : isError || !plot ? (
            <div className="mt-8 border border-ink-200 bg-cream-50">
              <ErrorState
                title="Plot not found"
                description="We could not load this plot's gallery. It may have been deleted."
                onRetry={() => navigate('/admin/plots')}
              />
            </div>
          ) : (
            <>
              <div className="mt-6 mb-8">
                <h1 className="font-display text-3xl text-ink-900 md:text-4xl">
                  Gallery — {plot.name}
                </h1>
                <p className="mt-2 max-w-xl text-sm text-ink-500">
                  {plot.location} · {plot.gallery.length} {plot.gallery.length === 1 ? 'image' : 'images'}
                  {plot.gallery.some((image) => image.isCover) ? ' · cover set' : ''}
                </p>
              </div>

              <div className="space-y-10">
                <section aria-label="Upload images">
                  <GalleryUploader
                    busy={uploadMutation.isPending}
                    onUpload={(files) =>
                      uploadMutation.mutate(files, {
                        onSuccess: (uploaded) =>
                          pushToast(
                            `Uploaded ${uploaded.length} ${uploaded.length === 1 ? 'image' : 'images'}.`,
                          ),
                        onError: () => pushToast('Could not upload the images.', 'error'),
                      })
                    }
                  />
                </section>

                <section aria-label="Gallery images">
                  {plot.gallery.length === 0 ? (
                    <div className="border border-ink-200 bg-cream-50">
                      <EmptyState
                        icon={Images}
                        title="No gallery images yet"
                        description="Drag and drop images above, or click Browse Files to add photos of this plot."
                      />
                    </div>
                  ) : (
                    <GalleryGrid
                      images={plot.gallery}
                      busyImageId={busyImageId}
                      onDelete={setPendingDelete}
                      onSetCover={handleSetCover}
                      onMove={handleMove}
                    />
                  )}
                </section>
              </div>
            </>
          )}
        </Container>
      </main>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete image?"
        description={
          pendingDelete
            ? `“${pendingDelete.fileName}” will be permanently removed from this plot's gallery.`
            : undefined
        }
        confirmLabel="Delete image"
        busy={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
