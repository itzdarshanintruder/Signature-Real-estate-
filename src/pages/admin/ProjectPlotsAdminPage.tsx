import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Plus, Edit, Trash2 } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Seo } from '@/components/ui/Seo'
import { useProjectPlots, useDeleteProjectPlot } from '@/hooks/use-project-plots'
import { useAdminProject } from '@/hooks/use-admin-projects'
import { useUiStore } from '@/store/ui-store'
import type { ProjectPlot } from '@/services/admin/projectPlotService'
import { cn } from '@/utils/cn'

export default function ProjectPlotsAdminPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)
  
  const { data: project } = useAdminProject(projectId)
  const { data: plots, isLoading, isError, refetch } = useProjectPlots(projectId)
  
  const deleteMutation = useDeleteProjectPlot(projectId!)
  const [pendingDelete, setPendingDelete] = useState<ProjectPlot | null>(null)

  const confirmDelete = () => {
    if (!pendingDelete) return
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => {
        pushToast(`Deleted Plot ${pendingDelete.plotNumber}.`)
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
      <Seo title={`Plot Gallery | ${project?.title || 'Project'}`} />
      <AdminHeader />

      <header className="relative overflow-hidden border-b border-gold-500/20 bg-ink-900 pb-14 text-cream-50">
        <Container className="relative pt-10">
          <Link
            to="/admin/projects"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Projects
          </Link>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-400 uppercase">
                {project?.title || 'Project'} Plot Gallery
              </p>
              <h1 className="font-display text-3xl text-cream-50 md:text-4xl">Plot Management</h1>
            </div>
            <Button onClick={() => navigate(`/admin/projects/${projectId}/plots/new`)} className="shrink-0">
              <Plus className="h-4 w-4" aria-hidden />
              Add New Plot
            </Button>
          </div>
        </Container>
      </header>

      <main className="min-h-svh bg-cream-100 pb-24">
        <Container className="pt-10">
          {isError ? (
            <div className="border border-ink-200 bg-cream-50">
              <ErrorState
                title="Could not load plots"
                description="The plot list is unavailable right now."
                onRetry={() => void refetch()}
              />
            </div>
          ) : isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-16 rounded bg-ink-200/50" />
              <div className="h-16 rounded bg-ink-200/50" />
              <div className="h-16 rounded bg-ink-200/50" />
            </div>
          ) : plots && plots.length > 0 ? (
            <div className="overflow-x-auto rounded-sm border border-ink-200 bg-cream-50 shadow-sm">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b border-ink-200 bg-ink-50/50 uppercase tracking-wider text-ink-500">
                  <tr className="text-left text-xs">
                    <th className="px-6 py-4 font-semibold">Photo</th>
                    <th className="px-6 py-4 font-semibold">Plot</th>
                    <th className="px-6 py-4 font-semibold">Block</th>
                    <th className="px-6 py-4 font-semibold">Area (sq.ft)</th>
                    <th className="px-6 py-4 font-semibold">Dimensions</th>
                    <th className="px-6 py-4 font-semibold">Facing</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {plots.map((plot) => {
                    const cover = plot.images?.find(i => i.isCover) || plot.images?.[0]
                    return (
                    <tr key={plot.id} className="transition-colors hover:bg-ink-50/50">
                      <td className="px-6 py-4">
                        {cover ? (
                          <div className="h-12 w-16 overflow-hidden rounded border border-ink-200 bg-ink-100">
                            <img src={cover.url} alt="Cover" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-12 w-16 items-center justify-center rounded border border-ink-200 bg-ink-50 text-xs text-ink-400">
                            No img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-ink-900">
                        {plot.plotNumber}
                        {plot.images?.length > 0 && (
                          <div className="text-xs font-normal text-ink-500">
                            {plot.images.length} photo{plot.images.length === 1 ? '' : 's'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-ink-600">{plot.block || '—'}</td>
                      <td className="px-6 py-4 text-ink-600">{plot.areaSqFt}</td>
                      <td className="px-6 py-4 text-ink-600">
                        {plot.width && plot.length ? `${plot.width} × ${plot.length}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-ink-600">{plot.facing || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-medium',
                          plot.status === 'Available' && 'bg-green-100 text-green-700',
                          plot.status === 'Reserved' && 'bg-orange-100 text-orange-700',
                          plot.status === 'Sold' && 'bg-red-100 text-red-700'
                        )}>
                          {plot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-ink-600 font-mono text-sm">
                        {plot.price ? `₹${plot.price.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => navigate(`/admin/projects/${projectId}/plots/${plot.id}/edit`)}
                            className="h-8 px-3 text-xs"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setPendingDelete(plot)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                            aria-label="Delete plot"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-ink-200 bg-cream-50">
              <EmptyState
                icon={MapPin}
                title="No plots yet"
                description={`Add your first plot to the ${project?.title || 'project'} gallery.`}
                action={
                  <Button onClick={() => navigate(`/admin/projects/${projectId}/plots/new`)}>
                    Add New Plot
                  </Button>
                }
              />
            </div>
          )}
        </Container>
      </main>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete Plot?"
        description={`Are you sure you want to delete Plot ${pendingDelete?.plotNumber}? This action cannot be undone.`}
        confirmLabel="Delete Plot"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
