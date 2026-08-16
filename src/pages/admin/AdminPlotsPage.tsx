import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { PlotTable, PlotTableSkeleton } from '@/components/admin/PlotTable'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Seo } from '@/components/ui/Seo'
import { useDeletePlot, usePlots } from '@/hooks/use-plots'
import { useUiStore } from '@/store/ui-store'
import type { Plot } from '@/types/admin'

export default function AdminPlotsPage() {
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)
  const { data: plots, isLoading, isError, refetch } = usePlots()
  const deleteMutation = useDeletePlot()
  const [pendingDelete, setPendingDelete] = useState<Plot | null>(null)

  const confirmDelete = () => {
    if (!pendingDelete) return
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => {
        pushToast(`Deleted “${pendingDelete.name}”.`)
        setPendingDelete(null)
      },
      onError: () => {
        pushToast('Could not delete the plot. Please try again.', 'error')
        setPendingDelete(null)
      },
    })
  }

  return (
    <>
      <Seo title="Admin Dashboard" description="Manage properties, plot details and gallery images." />
      <AdminHeader />

      {/* Intro band */}
      <header className="relative overflow-hidden border-b border-gold-500/20 bg-ink-900 pb-14 text-cream-50">
        <div aria-hidden className="bg-arch-grid absolute inset-0" />
        <div aria-hidden className="bg-gold-glow absolute inset-0" />
        <Container className="relative pt-12 md:pt-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-400 uppercase">
                <span aria-hidden className="h-px w-10 bg-gold-500/70" />
                Admin Dashboard
              </p>
              <h1 className="font-display text-3xl text-cream-50 md:text-4xl">Admin Dashboard</h1>
              <p className="mt-3 max-w-xl text-sm text-cream-50/70 md:text-base">
                Manage properties, plot details and gallery images.
              </p>
            </div>

            <Button onClick={() => navigate('/admin/plots/new')} className="shrink-0">
              <Plus className="h-4 w-4" aria-hidden />
              Add New Plot
            </Button>
          </div>
        </Container>
      </header>

      <main className="min-h-svh bg-cream-100 pb-24">
        <Container className="pt-10">
          <div className="mb-6 flex flex-col gap-1.5">
            <h2 className="font-display text-2xl text-ink-900">Plots &amp; Projects</h2>
            <p className="text-sm text-ink-500">
              {plots?.length ?? 0} {plots?.length === 1 ? 'plot' : 'plots'} managed in this workspace.
            </p>
          </div>

          {isError ? (
            <div className="border border-ink-200 bg-cream-50">
              <ErrorState
                title="Could not load plots"
                description="The plot list is unavailable right now. Check the backend and try again."
                onRetry={() => void refetch()}
              />
            </div>
          ) : isLoading ? (
            <PlotTableSkeleton />
          ) : plots && plots.length > 0 ? (
            <PlotTable
              plots={plots}
              onEdit={(plot) => navigate(`/admin/plots/${plot.id}/edit`)}
              onManageGallery={(plot) => navigate(`/admin/plots/${plot.id}/gallery`)}
              onDelete={setPendingDelete}
            />
          ) : (
            <div className="border border-ink-200 bg-cream-50">
              <EmptyState
                icon={MapPin}
                title="No plots yet"
                description="Add your first plot to start managing properties, pricing and gallery images."
                action={
                  <Button onClick={() => navigate('/admin/plots/new')}>
                    <Plus className="h-4 w-4" aria-hidden />
                    Add New Plot
                  </Button>
                }
              />
            </div>
          )}
        </Container>
      </main>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete plot?"
        description={
          pendingDelete
            ? `“${pendingDelete.name}” and its ${pendingDelete.gallery.length} gallery ${pendingDelete.gallery.length === 1 ? 'image' : 'images'} will be permanently removed. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete plot"
        busy={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
