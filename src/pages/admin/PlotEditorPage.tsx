import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PlotForm } from '@/components/admin/PlotForm'
import { Container } from '@/components/ui/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Seo } from '@/components/ui/Seo'
import { useCreatePlot, usePlot, useUpdatePlot } from '@/hooks/use-plots'
import { useUiStore } from '@/store/ui-store'
import type { PlotInput } from '@/types/admin'

export default function PlotEditorPage() {
  const { plotId } = useParams()
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)

  const isEditing = Boolean(plotId)
  const { data: plot, isLoading, isError } = usePlot(plotId)
  const createMutation = useCreatePlot()
  const updateMutation = useUpdatePlot(plotId ?? '')

  const submitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = (input: PlotInput) => {
    if (isEditing && plotId) {
      updateMutation.mutate(input, {
        onSuccess: () => {
          pushToast(`Updated “${input.name}”.`)
          navigate('/admin/plots')
        },
        onError: () => pushToast('Could not update the plot. Please try again.', 'error'),
      })
      return
    }

    createMutation.mutate(input, {
      onSuccess: () => {
        pushToast(`Added “${input.name}”.`)
        navigate('/admin/plots')
      },
      onError: () => pushToast('Could not save the plot. Please try again.', 'error'),
    })
  }

  const title = isEditing ? 'Edit Plot' : 'Add New Plot'

  return (
    <>
      <Seo
        title={title}
        description="Create or update a Signature City plot and its details."
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

          <div className="mt-6 mb-8">
            <h1 className="font-display text-3xl text-ink-900 md:text-4xl">{title}</h1>
            <p className="mt-2 max-w-xl text-sm text-ink-500">
              {isEditing
                ? 'Update the plot details below. Changes are published immediately.'
                : 'Fill in the details below to add a new plot to the catalogue.'}
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
                title="Plot not found"
                description="We could not load this plot. It may have been deleted."
                onRetry={() => navigate('/admin/plots')}
              />
            </div>
          ) : (
            <div className="border border-ink-200 bg-cream-50 p-6 md:p-8">
              <PlotForm
                plot={plot}
                mode={isEditing ? 'edit' : 'create'}
                submitting={submitting}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/admin/plots')}
              />
            </div>
          )}
        </Container>
      </main>
    </>
  )
}
