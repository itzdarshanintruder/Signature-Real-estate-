import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { NearbyPlaceForm } from '@/components/admin/NearbyPlaceForm'
import { Container } from '@/components/ui/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Seo } from '@/components/ui/Seo'
import {
  useAdminNearbyPlace,
  useCreateNearbyPlace,
  useUpdateNearbyPlace,
} from '@/hooks/use-admin-nearby-places'
import { useUiStore } from '@/store/ui-store'
import type { NearbyPlaceInput } from '@/types/admin'

export default function NearbyPlaceEditorPage() {
  const { placeId } = useParams<{ placeId: string }>()
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)

  const isEditing = Boolean(placeId)
  const { data: place, isLoading, isError } = useAdminNearbyPlace(placeId)
  const createMutation = useCreateNearbyPlace()
  const updateMutation = useUpdateNearbyPlace(placeId ?? '')

  const submitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = (input: NearbyPlaceInput) => {
    if (isEditing && placeId) {
      updateMutation.mutate(input, {
        onSuccess: () => {
          pushToast(`Updated “${input.name}”.`)
          navigate('/admin/nearby-places')
        },
        onError: () => pushToast('Could not update the place. Please try again.', 'error'),
      })
      return
    }

    createMutation.mutate(input, {
      onSuccess: () => {
        pushToast(`Added “${input.name}”.`)
        navigate('/admin/nearby-places')
      },
      onError: () => pushToast('Could not save the place. Please try again.', 'error'),
    })
  }

  const title = isEditing ? 'Edit Nearby Place' : 'Add New Place'

  return (
    <>
      <Seo
        title={title}
        description="Create or update a Signature City nearby place."
      />
      <AdminHeader />

      <main className="min-h-svh bg-cream-100 pb-24">
        <Container className="pt-10">
          <Link
            to="/admin/nearby-places"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors hover:text-gold-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to nearby places
          </Link>

          <div className="mt-6 mb-8">
            <h1 className="font-display text-3xl text-ink-900 md:text-4xl">{title}</h1>
            <p className="mt-2 max-w-xl text-sm text-ink-500">
              {isEditing
                ? 'Update the place details below. Changes are published immediately.'
                : 'Fill in the details below to add a new nearby place.'}
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
                <Skeleton className="h-11 w-40" />
              </div>
            </div>
          ) : isEditing && isError ? (
            <div className="border border-ink-200 bg-cream-50">
              <ErrorState
                title="Place not found"
                description="We could not load this place. It may have been deleted."
                onRetry={() => navigate('/admin/nearby-places')}
              />
            </div>
          ) : (
            <div className="border border-ink-200 bg-cream-50 p-6 md:p-8">
              <NearbyPlaceForm
                place={place ?? null}
                mode={isEditing ? 'edit' : 'create'}
                submitting={submitting}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/admin/nearby-places')}
              />
            </div>
          )}
        </Container>
      </main>
    </>
  )
}
