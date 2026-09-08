import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AmenityForm } from '@/components/admin/AmenityForm'
import { Container } from '@/components/ui/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Seo } from '@/components/ui/Seo'
import { useAdminAmenity, useCreateAmenity, useUpdateAmenity } from '@/hooks/use-admin-amenities'
import { useUiStore } from '@/store/ui-store'
import type { AmenityInput } from '@/types/admin'

export default function AmenityEditorPage() {
  const { amenityId } = useParams<{ amenityId: string }>()
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)

  const isEditing = Boolean(amenityId)
  const { data: amenity, isLoading, isError } = useAdminAmenity(amenityId)
  const createMutation = useCreateAmenity()
  const updateMutation = useUpdateAmenity(amenityId ?? '')

  const submitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = (input: AmenityInput) => {
    if (isEditing && amenityId) {
      updateMutation.mutate(input, {
        onSuccess: () => {
          pushToast(`Updated “${input.title}”.`)
          navigate('/admin/amenities')
        },
        onError: () => pushToast('Could not update the amenity. Please try again.', 'error'),
      })
      return
    }

    createMutation.mutate(input, {
      onSuccess: () => {
        pushToast(`Added “${input.title}”.`)
        navigate('/admin/amenities')
      },
      onError: () => pushToast('Could not save the amenity. Please try again.', 'error'),
    })
  }

  const title = isEditing ? 'Edit Amenity' : 'Add New Amenity'

  return (
    <>
      <Seo
        title={title}
        description="Create or update a Signature City amenity."
      />
      <AdminHeader />

      <main className="min-h-svh bg-cream-100 pb-24">
        <Container className="pt-10">
          <Link
            to="/admin/amenities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors hover:text-gold-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to amenities
          </Link>

          <div className="mt-6 mb-8">
            <h1 className="font-display text-3xl text-ink-900 md:text-4xl">{title}</h1>
            <p className="mt-2 max-w-xl text-sm text-ink-500">
              {isEditing
                ? 'Update the amenity details below. Changes are published immediately.'
                : 'Fill in the details below to add a new amenity.'}
            </p>
          </div>

          {isEditing && isLoading ? (
            <div className="border border-ink-200 bg-cream-50 p-6">
              <div className="space-y-5">
                <Skeleton className="h-11 w-full" />
                <div className="grid gap-5 md:grid-cols-2">
                  <Skeleton className="h-11" />
                  <Skeleton className="h-11" />
                </div>
                <Skeleton className="h-32" />
                <Skeleton className="h-11 w-40" />
              </div>
            </div>
          ) : isEditing && isError ? (
            <div className="border border-ink-200 bg-cream-50">
              <ErrorState
                title="Amenity not found"
                description="We could not load this amenity. It may have been deleted."
                onRetry={() => navigate('/admin/amenities')}
              />
            </div>
          ) : (
            <div className="border border-ink-200 bg-cream-50 p-6 md:p-8">
              <AmenityForm
                amenity={amenity ?? null}
                mode={isEditing ? 'edit' : 'create'}
                submitting={submitting}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/admin/amenities')}
              />
            </div>
          )}
        </Container>
      </main>
    </>
  )
}
