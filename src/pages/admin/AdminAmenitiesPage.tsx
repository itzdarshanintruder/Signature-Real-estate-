import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPinned, Plus, Pencil } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Seo } from '@/components/ui/Seo'
import { useAdminAmenities, useDeleteAmenity } from '@/hooks/use-admin-amenities'
import { useUiStore } from '@/store/ui-store'
import type { AdminAmenity } from '@/types/admin'

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
          <Skeleton className="h-3 w-full max-w-32" />
          <Skeleton className="h-3 w-full max-w-40" />
          <Skeleton className="h-3 w-full max-w-16" />
          <Skeleton className="h-3 w-full max-w-12" />
          <Skeleton className="h-3 w-full max-w-16" />
          <Skeleton className="h-3 w-full max-w-10" />
        </div>
      ))}
    </div>
  )
}

export default function AdminAmenitiesPage() {
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)
  const { data, isLoading, isError, refetch } = useAdminAmenities()
  const deleteMutation = useDeleteAmenity()
  const [pendingDelete, setPendingDelete] = useState<AdminAmenity | null>(null)

  const confirmDelete = () => {
    if (!pendingDelete) return
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => {
        pushToast(`Deleted “${pendingDelete.title}”.`)
        setPendingDelete(null)
      },
      onError: () => {
        pushToast('Could not delete the amenity. Please try again.', 'error')
        setPendingDelete(null)
      },
    })
  }

  return (
    <>
      <Seo title="Admin Dashboard" description="Manage Signature City amenities." />
      <AdminHeader />

      <main className="min-h-svh bg-cream-100 pb-24">
        <Container className="pt-10 md:pt-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-700 uppercase">
                <span aria-hidden className="h-px w-10 bg-gold-500/70" />
                Community Features
              </p>
              <h1 className="font-display text-3xl text-ink-900 md:text-4xl">Amenities</h1>
              <p className="mt-2 text-sm text-ink-500">
                Shared spaces and services shown on project pages.
              </p>
            </div>

            <Button onClick={() => navigate('/admin/amenities/new')} className="shrink-0">
              <Plus className="h-4 w-4" aria-hidden />
              Add Amenity
            </Button>
          </div>

          <div className="mt-8">
            {isError ? (
              <div className="border border-ink-200 bg-cream-50">
                <ErrorState
                  title="Could not load amenities"
                  description="The amenities endpoint is unavailable right now. Check the backend and try again."
                  onRetry={() => void refetch()}
                />
              </div>
            ) : isLoading ? (
              <TableSkeleton />
            ) : data && data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse border border-ink-200 bg-cream-50">
                  <thead>
                    <tr className="bg-ink-900 text-left text-cream-50">
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Amenity
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Icon
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Category
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Order
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
                    {data.map((amenity) => (
                      <tr
                        key={amenity.id}
                        className="border-b border-ink-200 transition-colors last:border-b-0 hover:bg-gold-50"
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-ink-900">
                          {amenity.title}
                          <span className="mt-0.5 block max-w-sm text-xs font-normal text-ink-500">
                            {amenity.description}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-ink-500">{amenity.icon}</td>
                        <td className="px-4 py-4 text-sm text-ink-600">{amenity.category}</td>
                        <td className="px-4 py-4 text-sm text-ink-500 tabular-nums">
                          {amenity.displayOrder}
                        </td>
                        <td className="px-4 py-4">
                          <Badge tone={amenity.isActive ? 'green' : 'muted'} dot={amenity.isActive}>
                            {amenity.isActive ? 'Active' : 'Hidden'}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => navigate(`/admin/amenities/${amenity.id}/edit`)}
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-700 hover:border-red-700/40 hover:bg-red-50"
                              onClick={() => setPendingDelete(amenity)}
                            >
                              Delete
                            </Button>
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
                  icon={MapPinned}
                  title="No amenities yet"
                  description="Add the first amenity to populate project pages."
                  action={
                    <Button onClick={() => navigate('/admin/amenities/new')}>
                      <Plus className="h-4 w-4" aria-hidden />
                      Add Amenity
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
        title="Delete amenity?"
        description={
          pendingDelete ? `“${pendingDelete.title}” will be permanently removed. This cannot be undone.` : undefined
        }
        confirmLabel="Delete amenity"
        busy={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
