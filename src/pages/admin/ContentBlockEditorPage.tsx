import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ContentBlockForm } from '@/components/admin/ContentBlockForm'
import { Container } from '@/components/ui/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Seo } from '@/components/ui/Seo'
import { useAdminSiteContent, useUpdateSiteContent } from '@/hooks/use-admin-content'
import { useUiStore } from '@/store/ui-store'
import { SITE_CONTENT_KEY_LABELS } from '@/types/admin'

export default function ContentBlockEditorPage() {
  const { key } = useParams<{ key: string }>()
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)

  const { data: rows, isLoading, isError } = useAdminSiteContent()
  const row = rows?.find((candidate) => candidate.key === key)

  const updateMutation = useUpdateSiteContent(row?.id ?? '')

  const handleSubmit = (input: { content: unknown; isActive: boolean }) => {
    if (!row) return
    updateMutation.mutate(input, {
      onSuccess: () => {
        pushToast(`Updated “${SITE_CONTENT_KEY_LABELS[row.key]}”.`)
        navigate('/admin/content')
      },
      onError: () => pushToast('Could not save the block. Please try again.', 'error'),
    })
  }

  return (
    <>
      <Seo
        title={key ? `Edit ${SITE_CONTENT_KEY_LABELS[key as keyof typeof SITE_CONTENT_KEY_LABELS] ?? key}` : 'Edit Content Block'}
        description="Edit a Signature City content block."
      />
      <AdminHeader />

      <main className="min-h-svh bg-cream-100 pb-24">
        <Container className="pt-10">
          <Link
            to="/admin/content"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors hover:text-gold-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to content
          </Link>

          <div className="mt-6 mb-8">
            <h1 className="font-display text-3xl text-ink-900 md:text-4xl">
              {key ? (SITE_CONTENT_KEY_LABELS[key as keyof typeof SITE_CONTENT_KEY_LABELS] ?? key) : 'Content Block'}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-500">
              Edit the JSON for this block. Invalid JSON is not saved.
            </p>
          </div>

          {isLoading ? (
            <div className="border border-ink-200 bg-cream-50 p-6">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="mt-5 h-11 w-40" />
            </div>
          ) : isError || !row ? (
            <div className="border border-ink-200 bg-cream-50">
              <ErrorState
                title="Block not found"
                description="We could not load this content block. It may have been deleted."
                onRetry={() => navigate('/admin/content')}
              />
            </div>
          ) : (
            <div className="border border-ink-200 bg-cream-50 p-6 md:p-8">
              <ContentBlockForm
                row={row}
                submitting={updateMutation.isPending}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/admin/content')}
              />
            </div>
          )}
        </Container>
      </main>
    </>
  )
}
