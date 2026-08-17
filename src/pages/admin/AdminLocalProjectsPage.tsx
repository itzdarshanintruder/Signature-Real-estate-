/**
 * AdminLocalProjectsPage.tsx
 * Frontend-only project management page — no backend required.
 * Admin can add, edit, delete projects stored in localStorage.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  X,
  CheckCircle2,
  Star,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  FileText,
} from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Seo } from '@/components/ui/Seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FieldError, Input, Label, Select, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useLocalStore, type LocalProject, type ProjectStatus } from '@/store/local-store'
import { formatCurrencyInr } from '@/utils/formatters'

// ─── Schema ───────────────────────────────────────────────────────────────────

export const AVAILABLE_DISTRICTS = [
  'Salem',
  'Coimbatore',
  'Tiruchirappalli (Trichy)',
  'Namakkal',
  'Dindigul',
] as const

export type District = (typeof AVAILABLE_DISTRICTS)[number]

const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'premium', label: 'Premium' },
  { value: 'launching', label: 'Launching Soon' },
  { value: 'sold-out', label: 'Sold Out' },
]

const STATUS_TONE: Record<ProjectStatus, 'green' | 'gold' | 'muted' | 'red'> = {
  available: 'green',
  premium: 'gold',
  launching: 'muted',
  'sold-out': 'red',
}

const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  location: z.string().trim().min(1, 'Location is required'),
  district: z.enum(AVAILABLE_DISTRICTS, {
    errorMap: () => ({ message: 'Please select a valid district' }),
  }),
  status: z.enum(['available', 'premium', 'launching', 'sold-out']),
  youtubeUrl: z
    .string()
    .trim()
    .min(1, 'YouTube Video URL is mandatory')
    .refine(
      (val) =>
        val.includes('youtube.com') ||
        val.includes('youtu.be') ||
        val.startsWith('http://') ||
        val.startsWith('https://'),
      { message: 'Please enter a valid YouTube or video link' },
    ),
  imageUrl: z.string().trim().min(1, 'Project image URL is mandatory'),
  layoutImageUrl: z.string().trim().min(1, 'Layout image URL is mandatory'),
  tagline: z.string().trim(),
  shortDescription: z.string().trim(),
  description: z.string().trim(),
  acreage: z.string().trim(),
  plotSizesText: z.string().trim(),
  featuresText: z.string().trim(),
  amenitiesText: z.string().trim(),
  startingPriceInr: z.preprocess(
    (v) => {
      const s = String(v ?? '').trim()
      return s === '' ? undefined : Number(s)
    },
    z.number().positive('Must be > 0').optional(),
  ),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof projectSchema>

// ─── Helpers ─────────────────────────────────────────────────────────────────

const split = (text: string) =>
  text
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `project-${Date.now()}`
}

function toFormValues(p?: LocalProject | null): FormValues {
  return {
    title: p?.title ?? '',
    location: p?.location ?? '',
    district: (p?.district as District) || 'Coimbatore',
    status: p?.status ?? 'available',
    youtubeUrl: p?.youtubeUrl ?? '',
    imageUrl: p?.imageUrl ?? '',
    layoutImageUrl: p?.layoutImageUrl ?? '',
    tagline: p?.tagline ?? '',
    shortDescription: p?.shortDescription ?? '',
    description: p?.description ?? '',
    acreage: p?.acreage ?? '',
    plotSizesText: p?.plotSizes.join(', ') ?? '',
    featuresText: p?.features.join('\n') ?? '',
    amenitiesText: p?.amenities.join(', ') ?? '',
    startingPriceInr: p?.startingPriceInr,
    isFeatured: p?.isFeatured ?? false,
    isActive: p?.isActive ?? true,
  }
}

// ─── Project Form Panel ───────────────────────────────────────────────────────

interface ProjectFormPanelProps {
  editing?: LocalProject | null
  onClose: () => void
}

function ProjectFormPanel({ editing, onClose }: ProjectFormPanelProps) {
  const addProject = useLocalStore((s) => s.addProject)
  const updateProject = useLocalStore((s) => s.updateProject)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: toFormValues(editing),
  })

  const isFeatured = watch('isFeatured')
  const isActive = watch('isActive')
  const imageUrl = watch('imageUrl')
  const layoutImageUrl = watch('layoutImageUrl')

  const onSubmit = (values: FormValues) => {
    const data = {
      title: values.title,
      slug: editing?.slug || generateSlug(values.title),
      location: values.location,
      district: values.district,
      status: values.status,
      youtubeUrl: values.youtubeUrl,
      imageUrl: values.imageUrl,
      layoutImageUrl: values.layoutImageUrl,
      tagline: values.tagline,
      shortDescription: values.shortDescription,
      description: values.description,
      acreage: values.acreage,
      plotSizes: split(values.plotSizesText),
      features: split(values.featuresText),
      amenities: split(values.amenitiesText),
      startingPriceInr: values.startingPriceInr,
      isFeatured: values.isFeatured,
      isActive: values.isActive,
    }

    if (editing) {
      updateProject(editing.id, data)
    } else {
      addProject(data)
    }

    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 900)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-ink-900/60 backdrop-blur-sm">
      <aside
        className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-cream-100 shadow-2xl"
        aria-label="Project form"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-200 bg-cream-100 px-6 py-4">
          <h2 className="font-display text-xl text-ink-900">
            {editing ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex-1 space-y-6 p-6">
          {/* Title */}
          <div>
            <Label htmlFor="lp-title" required>Title</Label>
            <Input
              id="lp-title"
              placeholder="e.g. Signature City – Sulur"
              invalid={Boolean(errors.title)}
              {...register('title')}
            />
            <FieldError message={errors.title?.message} />
          </div>

          {/* Status + District */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="lp-status" required>Status</Label>
              <Select id="lp-status" {...register('status')}>
                {PROJECT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="lp-district" required>District</Label>
              <Select
                id="lp-district"
                invalid={Boolean(errors.district)}
                {...register('district')}
              >
                {AVAILABLE_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.district?.message} />
            </div>
          </div>

          {/* Location + Acreage */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="lp-location" required>Location</Label>
              <Input
                id="lp-location"
                placeholder="e.g. Near Sulur, Coimbatore"
                invalid={Boolean(errors.location)}
                {...register('location')}
              />
              <FieldError message={errors.location?.message} />
            </div>
            <div>
              <Label htmlFor="lp-acreage">Acreage</Label>
              <Input id="lp-acreage" placeholder="e.g. 12 acres" {...register('acreage')} />
            </div>
          </div>

          {/* Price + Plot Sizes */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="lp-price">Starting Price (₹)</Label>
              <Input
                id="lp-price"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 960000"
                invalid={Boolean(errors.startingPriceInr)}
                {...register('startingPriceInr')}
              />
              <FieldError message={errors.startingPriceInr?.message} />
            </div>
            <div>
              <Label htmlFor="lp-plot-sizes">Plot Sizes</Label>
              <Input
                id="lp-plot-sizes"
                placeholder="e.g. 20×30, 20×40"
                {...register('plotSizesText')}
              />
              <p className="mt-1 text-xs text-ink-400">Comma-separated</p>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <Label htmlFor="lp-tagline">Tagline</Label>
            <Input
              id="lp-tagline"
              placeholder="e.g. The flagship address near Sulur"
              {...register('tagline')}
            />
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="lp-short-desc">Short Description</Label>
            <Input
              id="lp-short-desc"
              placeholder="Card copy shown on the listing page"
              {...register('shortDescription')}
            />
          </div>

          {/* YouTube Video & Media URLs */}
          <div>
            <Label htmlFor="lp-youtube-url" required>
              YouTube Video URL
            </Label>
            <Input
              id="lp-youtube-url"
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
              invalid={Boolean(errors.youtubeUrl)}
              {...register('youtubeUrl')}
            />
            <p className="mt-1 text-xs text-ink-400">
              Paste the YouTube video link to showcase this project.
            </p>
            <FieldError message={errors.youtubeUrl?.message} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Project Main Image Upload */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="lp-image-url" required>
                Project Main Image
              </Label>
              <div
                className={`relative flex flex-col items-center justify-center rounded-sm border-2 border-dashed p-4 transition-colors ${
                  errors.imageUrl
                    ? 'border-red-500/50 bg-red-500/5'
                    : 'border-ink-200 bg-white hover:border-gold-500 hover:bg-gold-50/20'
                }`}
              >
                {imageUrl ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-ink-900 shadow-sm">
                    <img
                      src={imageUrl}
                      alt="Project Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setValue('imageUrl', '', { shouldValidate: true })}
                      className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/80 text-white shadow-md hover:bg-red-600"
                      title="Remove image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex w-full cursor-pointer flex-col items-center justify-center py-4 text-center">
                    <Upload className="mb-2 h-7 w-7 text-gold-600" />
                    <span className="text-sm font-semibold text-ink-900">
                      Click to upload project image
                    </span>
                    <span className="mt-0.5 text-xs text-ink-400">PNG, JPG, WebP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setValue('imageUrl', reader.result, { shouldValidate: true })
                          }
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                )}

                <div className="mt-3 w-full border-t border-ink-100 pt-2">
                  <span className="mb-1 block text-[0.65rem] font-bold tracking-wider text-ink-400 uppercase">
                    Or paste image link:
                  </span>
                  <Input
                    id="lp-image-url"
                    placeholder="https://... (direct image URL)"
                    invalid={Boolean(errors.imageUrl)}
                    {...register('imageUrl')}
                  />
                </div>
              </div>
              <FieldError message={errors.imageUrl?.message} />
            </div>

            {/* Layout / Master Plan Upload */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="lp-layout-image-url" required>
                Master Layout / Site Plan Image
              </Label>
              <div
                className={`relative flex flex-col items-center justify-center rounded-sm border-2 border-dashed p-4 transition-colors ${
                  errors.layoutImageUrl
                    ? 'border-red-500/50 bg-red-500/5'
                    : 'border-ink-200 bg-white hover:border-gold-500 hover:bg-gold-50/20'
                }`}
              >
                {layoutImageUrl ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-ink-900 shadow-sm">
                    <img
                      src={layoutImageUrl}
                      alt="Layout Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setValue('layoutImageUrl', '', { shouldValidate: true })}
                      className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/80 text-white shadow-md hover:bg-red-600"
                      title="Remove layout image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex w-full cursor-pointer flex-col items-center justify-center py-4 text-center">
                    <FileText className="mb-2 h-7 w-7 text-gold-600" />
                    <span className="text-sm font-semibold text-ink-900">
                      Click to upload layout plan
                    </span>
                    <span className="mt-0.5 text-xs text-ink-400">PNG, JPG, WebP blueprint</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setValue('layoutImageUrl', reader.result, { shouldValidate: true })
                          }
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                )}

                <div className="mt-3 w-full border-t border-ink-100 pt-2">
                  <span className="mb-1 block text-[0.65rem] font-bold tracking-wider text-ink-400 uppercase">
                    Or paste layout link:
                  </span>
                  <Input
                    id="lp-layout-image-url"
                    placeholder="https://... (direct layout URL)"
                    invalid={Boolean(errors.layoutImageUrl)}
                    {...register('layoutImageUrl')}
                  />
                </div>
              </div>
              <FieldError message={errors.layoutImageUrl?.message} />
            </div>
          </div>

          {/* Full Description */}
          <div>
            <Label htmlFor="lp-desc">Full Description</Label>
            <Textarea
              id="lp-desc"
              placeholder="Detailed project description for the detail page"
              {...register('description')}
            />
          </div>

          {/* Features + Amenities */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="lp-features">Features (one per line)</Label>
              <Textarea
                id="lp-features"
                placeholder={'DTCP approved\nClear titles\nGated community'}
                {...register('featuresText')}
              />
            </div>
            <div>
              <Label htmlFor="lp-amenities">Amenities (comma-separated)</Label>
              <Textarea
                id="lp-amenities"
                placeholder="24×7 security, Club house, Children's park"
                {...register('amenitiesText')}
              />
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setValue('isFeatured', !isFeatured)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                isFeatured
                  ? 'border-gold-500 bg-gold-50 text-gold-700'
                  : 'border-ink-200 bg-white text-ink-400 hover:border-ink-300'
              }`}
            >
              <Star className="h-4 w-4" />
              {isFeatured ? 'Featured' : 'Mark as Featured'}
            </button>
            <button
              type="button"
              onClick={() => setValue('isActive', !isActive)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-ink-200 bg-white text-ink-400 hover:border-ink-300'
              }`}
            >
              {isActive ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              {isActive ? 'Visible to users' : 'Hidden from users'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {saved ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Saved!
                </span>
              ) : editing ? (
                'Update Project'
              ) : (
                'Save Project'
              )}
            </Button>
          </div>
        </form>
      </aside>
    </div>
  )
}

// ─── Project Row ──────────────────────────────────────────────────────────────

interface ProjectRowProps {
  project: LocalProject
  onEdit: (p: LocalProject) => void
  onDelete: (p: LocalProject) => void
}

function ProjectRow({ project, onEdit, onDelete }: ProjectRowProps) {
  const statusLabel = PROJECT_STATUSES.find((s) => s.value === project.status)?.label ?? project.status

  return (
    <tr className="border-b border-ink-200 transition-colors last:border-b-0 hover:bg-gold-50">
      <td className="px-4 py-4">
        <p className="text-sm font-semibold text-ink-900">{project.title}</p>
        <p className="mt-0.5 font-mono text-xs text-ink-400">
          /projects/{project.slug} · {project.location}
        </p>
      </td>
      <td className="px-4 py-4">
        <Badge tone={STATUS_TONE[project.status]} dot>
          {statusLabel}
        </Badge>
      </td>
      <td className="px-4 py-4 text-sm tabular-nums text-ink-600">
        {project.startingPriceInr ? formatCurrencyInr(project.startingPriceInr) : '—'}
      </td>
      <td className="px-4 py-4">
        {project.isFeatured ? (
          <Badge tone="gold" dot>Featured</Badge>
        ) : (
          <span className="text-ink-300">—</span>
        )}
      </td>
      <td className="px-4 py-4">
        <Badge tone={project.isActive ? 'green' : 'muted'} dot={project.isActive}>
          {project.isActive ? 'Active' : 'Hidden'}
        </Badge>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(project)}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-700 hover:border-red-300 hover:bg-red-50"
            onClick={() => onDelete(project)}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminLocalProjectsPage() {
  const projects = useLocalStore((s) => s.projects)
  const deleteProject = useLocalStore((s) => s.deleteProject)

  const [panelOpen, setPanelOpen] = useState(false)
  const [editing, setEditing] = useState<LocalProject | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<LocalProject | null>(null)

  const openAdd = () => {
    setEditing(null)
    setPanelOpen(true)
  }

  const openEdit = (p: LocalProject) => {
    setEditing(p)
    setPanelOpen(true)
  }

  const closePanel = () => {
    setPanelOpen(false)
    setEditing(null)
  }

  return (
    <>
      <Seo title="Manage Projects" description="Add and manage real estate projects." />
      <div className="flex h-screen flex-col overflow-hidden bg-cream-100">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto pb-16">
          <Container className="pt-8 md:pt-10">
          {/* Page header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-700 uppercase">
                <span aria-hidden className="h-px w-10 bg-gold-500/70" />
                Project Catalogue
              </p>
              <h1 className="font-display text-3xl text-ink-900 md:text-4xl">Projects</h1>
              <p className="mt-2 text-sm text-ink-500">
                Projects added here are shown on the public listing page. Customers can submit
                interest enquiries from there.
              </p>
            </div>
            <Button onClick={openAdd} className="shrink-0">
              <Plus className="h-4 w-4" aria-hidden />
              Add Project
            </Button>
          </div>

          {/* Table */}
          <div className="mt-8">
            {projects.length === 0 ? (
              <div className="border border-ink-200 bg-cream-50">
                <EmptyState
                  icon={Building2}
                  title="No projects yet"
                  description="Add your first project — it will appear on the public Projects page immediately."
                  action={
                    <Button onClick={openAdd}>
                      <Plus className="h-4 w-4" />
                      Add First Project
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-collapse border border-ink-200 bg-cream-50">
                  <thead>
                    <tr className="bg-ink-900 text-left text-cream-50">
                      {['Project', 'Status', 'Start Price', 'Featured', 'Visibility', 'Actions'].map(
                        (col) => (
                          <th
                            key={col}
                            scope="col"
                            className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase last:text-right"
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <ProjectRow
                        key={project.id}
                        project={project}
                        onEdit={openEdit}
                        onDelete={setConfirmDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Container>
      </main>
      </div>

      {/* Slide-in form panel */}
      {panelOpen && <ProjectFormPanel editing={editing} onClose={closePanel} />}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-ink-200 bg-white p-6 shadow-2xl">
            <h2 className="font-display text-lg text-ink-900">Delete project?</h2>
            <p className="mt-2 text-sm text-ink-500">
              "{confirmDelete.title}" will be permanently removed. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                className="bg-red-700 hover:bg-red-800"
                onClick={() => {
                  deleteProject(confirmDelete.id)
                  setConfirmDelete(null)
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
