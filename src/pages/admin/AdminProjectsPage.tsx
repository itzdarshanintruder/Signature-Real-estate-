import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, Pencil } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Seo } from '@/components/ui/Seo'
import { useAdminProjects, useDeleteAdminProject } from '@/hooks/use-admin-projects'
import { useUiStore } from '@/store/ui-store'
import { formatCurrencyInr } from '@/utils/formatters'
import type { AdminProject } from '@/types/admin'

const STATUS_LABELS: Record<AdminProject['status'], string> = {
  available: 'Available',
  premium: 'Premium',
  launching: 'Launching Soon',
  'sold-out': 'Sold Out',
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden border border-ink-200 bg-cream-50">
      <div className="grid grid-cols-6 gap-4 border-b border-ink-200 bg-ink-900 px-4 py-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-16 bg-cream-50/20" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-6 gap-4 border-b border-ink-200 px-4 py-4 last:border-b-0"
        >
          <Skeleton className="h-3 w-full max-w-40" />
          <Skeleton className="h-3 w-full max-w-16" />
          <Skeleton className="h-3 w-full max-w-16" />
          <Skeleton className="h-3 w-full max-w-20" />
          <Skeleton className="h-3 w-full max-w-16" />
          <Skeleton className="h-3 w-full max-w-10" />
        </div>
      ))}
    </div>
  )
}

export default function AdminProjectsPage() {
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)
  const { data, isLoading, isError, refetch } = useAdminProjects()
  const deleteMutation = useDeleteAdminProject()
  const [pendingDelete, setPendingDelete] = useState<AdminProject | null>(null)

  const confirmDelete = () => {
    if (!pendingDelete) return
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => {
        pushToast(`Deleted “${pendingDelete.title}”.`)
        setPendingDelete(null)
      },
      onError: () => {
        pushToast('Could not delete the project. Please try again.', 'error')
        setPendingDelete(null)
      },
    })
  }

  return (
    <>
      <Seo title="Admin Dashboard" description="Manage Signature City projects." />
      <AdminHeader />

      <main className="min-h-svh bg-cream-100 pb-24">
        <Container className="pt-10 md:pt-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-700 uppercase">
                <span aria-hidden className="h-px w-10 bg-gold-500/70" />
                Project Catalogue
              </p>
              <h1 className="font-display text-3xl text-ink-900 md:text-4xl">Projects</h1>
              <p className="mt-2 text-sm text-ink-500">
                Core project details shown across the public site.
              </p>
            </div>

            <Button onClick={() => navigate('/admin/projects/new')} className="shrink-0">
              <Plus className="h-4 w-4" aria-hidden />
              Add Project
            </Button>
          </div>

          <div className="mt-8">
            {isError ? (
              <div className="border border-ink-200 bg-cream-50">
                <ErrorState
                  title="Could not load projects"
                  description="The projects endpoint is unavailable right now. Check the backend and try again."
                  onRetry={() => void refetch()}
                />
              </div>
            ) : isLoading ? (
              <TableSkeleton />
            ) : data && data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse border border-ink-200 bg-cream-50">
                  <thead>
                    <tr className="bg-ink-900 text-left text-cream-50">
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Project
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Start Price
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Featured
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-bold tracking-[0.18em] uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-ink-200 transition-colors last:border-b-0 hover:bg-gold-50"
                      >
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-ink-900">{project.title}</p>
                          <p className="mt-0.5 font-mono text-xs text-ink-500">
                            /projects/{project.slug} · {project.location}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-ink-600">
                          {STATUS_LABELS[project.status]}
                        </td>
                        <td className="px-4 py-4 text-sm text-ink-600 tabular-nums">
                          {project.startingPriceInr
                            ? formatCurrencyInr(project.startingPriceInr)
                            : 'On request'}
                        </td>
                        <td className="px-4 py-4">
                          {project.isFeatured ? (
                            <Badge tone="gold" dot>
                              Featured
                            </Badge>
                          ) : (
                            <span className="text-ink-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Badge tone={project.isActive ? 'green' : 'muted'} dot={project.isActive}>
                            {project.isActive ? 'Active' : 'Hidden'}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {project.slug === 'omega-estates' || project.slug === 'signature-city-sulur' || project.slug === 'hitech-city' || project.slug === 'emerald-city' || project.slug === 'up-town' ? (
                              <>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                                >
                                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gold-500 font-semibold text-ink-900 hover:bg-gold-400"
                                  onClick={() => navigate(project.slug === 'omega-estates' ? '/admin/omega' : `/admin/projects/${project.id}/plots`)}
                                >
                                  Plot Gallery
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-700 hover:border-red-700/40 hover:bg-red-50"
                                  onClick={() => setPendingDelete(project)}
                                >
                                  Delete
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/projects/${project.id}/plots`)}
                                >
                                  Plot Gallery
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                                >
                                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-700 hover:border-red-700/40 hover:bg-red-50"
                                  onClick={() => setPendingDelete(project)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-ink-200 bg-cream-50">
                <EmptyState
                  icon={Building2}
                  title="No projects yet"
                  description="Add your first project to start managing the catalogue."
                  action={
                    <Button onClick={() => navigate('/admin/projects/new')}>
                      <Plus className="h-4 w-4" aria-hidden />
                      Add Project
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </Container>
      </main>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete project?"
        description={
          pendingDelete
            ? `“${pendingDelete.title}” and its linked content will be permanently removed. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete project"
        busy={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
