import { useEffect, useState } from 'react'
import { useForm, type DeepPartial } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { FieldError, Input, Label, Select, Textarea } from '@/components/ui/Input'
import type { AdminProject, ProjectInput } from '@/types/admin'

const PROJECT_STATUSES = ['available', 'premium', 'launching', 'sold-out'] as const
const PROJECT_STATUS_LABELS: Record<(typeof PROJECT_STATUSES)[number], string> = {
  available: 'Available',
  premium: 'Premium',
  launching: 'Launching Soon',
  'sold-out': 'Sold Out',
}

const coerceOptionalNumber = (value: unknown): unknown => {
  const trimmed = typeof value === 'string' ? value.trim() : value
  if (trimmed === '' || trimmed == null) return undefined
  const asNumber = Number(trimmed)
  return Number.isNaN(asNumber) ? NaN : asNumber
}

const coerceRequiredNumber = (value: unknown): unknown => {
  const trimmed = typeof value === 'string' ? value.trim() : value
  if (trimmed === '' || trimmed == null) return NaN
  const asNumber = Number(trimmed)
  return Number.isNaN(asNumber) ? NaN : asNumber
}

const linesToList = (value: string): string[] =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

const commasToList = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export const AVAILABLE_DISTRICTS = [
  'Salem',
  'Coimbatore',
  'Madurai',
  'Tiruchirappalli',
  'Namakkal',
  'Dindigul',
] as const

const projectSchema = z.object({
  title: z.string().trim().min(1, 'Please enter a project title').max(120, 'Keep the title under 120 characters'),
  slug: z
    .string()
    .trim()
    .min(1, 'Please enter a slug')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, digits and hyphens only'),
  status: z.enum(PROJECT_STATUSES),
  district: z.enum(AVAILABLE_DISTRICTS, {
    errorMap: () => ({ message: 'Please select a valid district' }),
  }),
  location: z.string().trim().min(1, 'Please enter a location'),
  acreage: z.string().trim().min(1, 'Please enter an acreage'),
  tagline: z.string().trim(),
  description: z.string().trim(),
  shortDescription: z.string().trim(),
  startingPrice: z.preprocess(
    coerceOptionalNumber,
    z
      .number({ invalid_type_error: 'Enter a valid price' })
      .positive('Price must be greater than 0')
      .optional(),
  ),
  plotSizesText: z.string().trim(),
  overviewText: z.string().trim(),
  featuresText: z.string().trim(),
  amenitiesText: z.string().trim(),
  investmentBenefitsText: z.string().trim(),
  displayOrder: z.preprocess(
    coerceRequiredNumber,
    z.number({ invalid_type_error: 'Enter a valid order' }).min(0, 'Order cannot be negative'),
  ),
})

type ProjectFormValues = z.infer<typeof projectSchema>

function toFormValues(project?: AdminProject | null): DeepPartial<ProjectFormValues> {
  return {
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    status: project?.status ?? 'available',
    district: (project?.district as (typeof AVAILABLE_DISTRICTS)[number]) ?? undefined,
    location: project?.location ?? '',
    acreage: project?.acreage ?? '',
    tagline: project?.tagline ?? '',
    description: project?.description ?? '',
    shortDescription: project?.shortDescription ?? '',
    startingPrice: project?.startingPriceInr ?? undefined,
    plotSizesText: project?.plotSizes.join(', ') ?? '',
    overviewText: project?.overview.join('\n') ?? '',
    featuresText: project?.features.join('\n') ?? '',
    amenitiesText: project?.amenities.join(', ') ?? '',
    investmentBenefitsText: project?.investmentBenefits.join('\n') ?? '',
    displayOrder: project?.displayOrder ?? 0,
  }
}

function fromFormValues(
  values: ProjectFormValues,
  flags: { isFeatured: boolean; isActive: boolean },
): ProjectInput {
  return {
    title: values.title,
    slug: values.slug,
    status: values.status,
    district: values.district,
    location: values.location,
    acreage: values.acreage,
    tagline: values.tagline,
    description: values.description,
    shortDescription: values.shortDescription,
    startingPriceInr: values.startingPrice ?? null,
    plotSizes: commasToList(values.plotSizesText),
    overview: linesToList(values.overviewText),
    features: linesToList(values.featuresText),
    amenities: commasToList(values.amenitiesText),
    investmentBenefits: linesToList(values.investmentBenefitsText),
    displayOrder: values.displayOrder,
    isFeatured: flags.isFeatured,
    isActive: flags.isActive,
  }
}

interface ProjectFormProps {
  project?: AdminProject | null
  mode: 'create' | 'edit'
  submitting: boolean
  onSubmit: (input: ProjectInput) => void
  onCancel: () => void
}

export function ProjectForm({
  project,
  mode,
  submitting,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: toFormValues(project),
  })

  const [isFeatured, setIsFeatured] = useState(project?.isFeatured ?? false)
  const [isActive, setIsActive] = useState(project?.isActive ?? true)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const hasUnsavedChanges = isDirty && !isSubmitting

  useEffect(() => {
    if (!hasUnsavedChanges) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [hasUnsavedChanges])

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelConfirm(true)
      return
    }
    onCancel()
  }

  return (
    <>
      <form
        onSubmit={handleSubmit((values) =>
          onSubmit(fromFormValues(values, { isFeatured, isActive })),
        )}
        noValidate
      >
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="project-title" required>
                Title
              </Label>
              <Input
                id="project-title"
                placeholder="e.g. Signature City — Sulur"
                invalid={Boolean(errors.title)}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'project-title-error' : undefined}
                {...register('title')}
              />
              <FieldError id="project-title-error" message={errors.title?.message} />
            </div>

            <div>
              <Label htmlFor="project-slug" required>
                Slug
              </Label>
              <Input
                id="project-slug"
                placeholder="e.g. signature-city-sulur"
                invalid={Boolean(errors.slug)}
                aria-invalid={Boolean(errors.slug)}
                aria-describedby="project-slug-hint"
                {...register('slug')}
              />
              <p id="project-slug-hint" className="mt-1.5 text-xs text-ink-500">
                Used in the public URL: /projects/&lt;slug&gt;
              </p>
              <FieldError message={errors.slug?.message} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="project-status" required>
                Status
              </Label>
              <Select
                id="project-status"
                invalid={Boolean(errors.status)}
                aria-invalid={Boolean(errors.status)}
                {...register('status')}
              >
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {PROJECT_STATUS_LABELS[status]}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.status?.message} />
            </div>

            <div>
              <Label htmlFor="project-district" required>
                District
              </Label>
              <Select
                id="project-district"
                invalid={Boolean(errors.district)}
                aria-invalid={Boolean(errors.district)}
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

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="project-location" required>
                Location
              </Label>
              <Input
                id="project-location"
                placeholder="e.g. Near Sulur, Coimbatore"
                invalid={Boolean(errors.location)}
                aria-invalid={Boolean(errors.location)}
                {...register('location')}
              />
              <FieldError message={errors.location?.message} />
            </div>

            <div>
              <Label htmlFor="project-acreage" required>
                Acreage
              </Label>
              <Input
                id="project-acreage"
                placeholder="e.g. 12 acres"
                invalid={Boolean(errors.acreage)}
                aria-invalid={Boolean(errors.acreage)}
                {...register('acreage')}
              />
              <FieldError message={errors.acreage?.message} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="project-starting-price">Starting Price (₹)</Label>
              <Input
                id="project-starting-price"
                type="number"
                inputMode="decimal"
                step="any"
                min={0}
                placeholder="e.g. 960000"
                invalid={Boolean(errors.startingPrice)}
                aria-invalid={Boolean(errors.startingPrice)}
                {...register('startingPrice')}
              />
              <FieldError message={errors.startingPrice?.message} />
            </div>

            <div>
              <Label htmlFor="project-order" required>
                Display Order
              </Label>
              <Input
                id="project-order"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="e.g. 0"
                invalid={Boolean(errors.displayOrder)}
                aria-invalid={Boolean(errors.displayOrder)}
                {...register('displayOrder')}
              />
              <FieldError message={errors.displayOrder?.message} />
            </div>
          </div>

          <div>
            <Label htmlFor="project-tagline">Tagline</Label>
            <Input
              id="project-tagline"
              placeholder="e.g. The flagship address near Sulur"
              invalid={Boolean(errors.tagline)}
              aria-invalid={Boolean(errors.tagline)}
              {...register('tagline')}
            />
            <FieldError message={errors.tagline?.message} />
          </div>

          <div>
            <Label htmlFor="project-short-description">Short Description</Label>
            <Input
              id="project-short-description"
              placeholder="Card copy shown on the projects listing page"
              invalid={Boolean(errors.shortDescription)}
              aria-invalid={Boolean(errors.shortDescription)}
              {...register('shortDescription')}
            />
            <FieldError message={errors.shortDescription?.message} />
          </div>

          <div>
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="SEO / meta description"
              invalid={Boolean(errors.description)}
              aria-invalid={Boolean(errors.description)}
              {...register('description')}
            />
            <FieldError message={errors.description?.message} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="project-plot-sizes">Plot Sizes</Label>
              <Input
                id="project-plot-sizes"
                placeholder="e.g. 20×30, 20×40, 30×50"
                invalid={Boolean(errors.plotSizesText)}
                aria-invalid={Boolean(errors.plotSizesText)}
                aria-describedby="project-plot-sizes-hint"
                {...register('plotSizesText')}
              />
              <p id="project-plot-sizes-hint" className="mt-1.5 text-xs text-ink-500">
                Separate with commas.
              </p>
              <FieldError message={errors.plotSizesText?.message} />
            </div>

            <div>
              <Label htmlFor="project-amenities">Amenities</Label>
              <Input
                id="project-amenities"
                placeholder="e.g. Gated community, 24×7 security"
                invalid={Boolean(errors.amenitiesText)}
                aria-invalid={Boolean(errors.amenitiesText)}
                aria-describedby="project-amenities-hint"
                {...register('amenitiesText')}
              />
              <p id="project-amenities-hint" className="mt-1.5 text-xs text-ink-500">
                Separate with commas.
              </p>
              <FieldError message={errors.amenitiesText?.message} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="project-overview">Overview (one paragraph per line)</Label>
              <Textarea
                id="project-overview"
                placeholder={'Paragraph one\nParagraph two'}
                invalid={Boolean(errors.overviewText)}
                aria-invalid={Boolean(errors.overviewText)}
                {...register('overviewText')}
              />
              <FieldError message={errors.overviewText?.message} />
            </div>

            <div>
              <Label htmlFor="project-features">Features (one per line)</Label>
              <Textarea
                id="project-features"
                placeholder={'DTCP approved\nClear titles'}
                invalid={Boolean(errors.featuresText)}
                aria-invalid={Boolean(errors.featuresText)}
                {...register('featuresText')}
              />
              <FieldError message={errors.featuresText?.message} />
            </div>
          </div>

          <div>
            <Label htmlFor="project-investment-benefits">
              Investment Benefits (one per line)
            </Label>
            <Textarea
              id="project-investment-benefits"
              placeholder={'High appreciation corridor\nSteady rental demand'}
              invalid={Boolean(errors.investmentBenefitsText)}
              aria-invalid={Boolean(errors.investmentBenefitsText)}
              {...register('investmentBenefitsText')}
            />
            <FieldError message={errors.investmentBenefitsText?.message} />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <Checkbox
                checked={isFeatured}
                onChange={(event) => setIsFeatured(event.target.checked)}
                label="Featured"
                description="Shown in the Premium Plots section on the home page."
              />
              <Checkbox
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                label="Active"
                description="Hidden from the public site when unchecked."
              />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                type="button"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={submitting} disabled={submitting}>
                {mode === 'create' ? 'Save Project' : 'Update Project'}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showCancelConfirm}
        title="Discard changes?"
        description="You have unsaved changes in this form. Leaving now will discard them."
        confirmLabel="Discard changes"
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          setShowCancelConfirm(false)
          onCancel()
        }}
      />
    </>
  )
}
