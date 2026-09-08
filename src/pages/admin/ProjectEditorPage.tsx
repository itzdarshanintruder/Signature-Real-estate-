import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { Container } from '@/components/ui/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Seo } from '@/components/ui/Seo'
import { useAdminProject, useCreateAdminProject, useUpdateAdminProject } from '@/hooks/use-admin-projects'
import { useUiStore } from '@/store/ui-store'
import type { ProjectInput } from '@/types/admin'

export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)

  const isEditing = Boolean(id)
  const { data: project, isLoading, isError } = useAdminProject(id)
  const createMutation = useCreateAdminProject()
  const updateMutation = useUpdateAdminProject(id ?? '')

  const submitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = (input: ProjectInput) => {
    if (isEditing && id) {
      updateMutation.mutate(input, {
        onSuccess: () => {
          pushToast(`Updated “${input.title}”.`)
          navigate('/admin/projects')
        },
        onError: () => pushToast('Could not update the project. Please try again.', 'error'),
      })
      return
    }

    createMutation.mutate(input, {
      onSuccess: () => {
        pushToast(`Added “${input.title}”.`)
        navigate('/admin/projects')
      },
      onError: () => pushToast('Could not save the project. Please try again.', 'error'),
    })
  }

  const title = isEditing ? 'Edit Project' : 'Add New Project'

  return (
    <>
      <Seo
        title={title}
        description="Create or update a project and its details."
      />
      <AdminHeader />

      <main className="min-h-svh bg-cream-100 pb-24">
        <Container className="pt-10">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors hover:text-gold-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to projects
          </Link>

          <div className="mt-6 mb-8">
            <h1 className="font-display text-3xl text-ink-900 md:text-4xl">{title}</h1>
            <p className="mt-2 max-w-xl text-sm text-ink-500">
              {isEditing
                ? 'Update the project details below. Changes are published immediately.'
                : 'Fill in the details below to add a new project to the catalogue.'}
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
                title="Project not found"
                description="We could not load this project. It may have been deleted."
                onRetry={() => navigate('/admin/projects')}
              />
            </div>
          ) : (
            <div className="border border-ink-200 bg-cream-50 p-6 md:p-8">
              <ProjectForm
                project={project ?? null}
                mode={isEditing ? 'edit' : 'create'}
                onSubmit={handleSubmit}
                submitting={submitting}
                onCancel={() => navigate('/admin/projects')}
              />
            </div>
          )}
        </Container>
      </main>
    </>
  )
}
