import { useEffect, useState } from 'react'
import { useForm, type DeepPartial } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { FieldError, Input, Label, Select } from '@/components/ui/Input'
import { useAdminProjects } from '@/hooks/use-admin-projects'
import {
  NEARBY_PLACE_CATEGORIES,
  type AdminNearbyPlace,
  type NearbyPlaceInput,
} from '@/types/admin'

const coerceRequiredNumber = (value: unknown): unknown => {
  const trimmed = typeof value === 'string' ? value.trim() : value
  if (trimmed === '' || trimmed == null) return NaN
  const asNumber = Number(trimmed)
  return Number.isNaN(asNumber) ? NaN : asNumber
}

const nearbyPlaceSchema = z.object({
  name: z.string().trim().min(1, 'Please enter a place name').max(80, 'Keep the name under 80 characters'),
  category: z.enum(NEARBY_PLACE_CATEGORIES),
  distance: z
    .string()
    .trim()
    .min(1, 'Please enter a distance')
    .max(24, 'Keep the distance under 24 characters'),
  projectId: z.string().trim().optional(),
  displayOrder: z.preprocess(
    coerceRequiredNumber,
    z.number({ invalid_type_error: 'Enter a valid order' }).min(0, 'Order cannot be negative'),
  ),
})

type NearbyPlaceFormValues = z.infer<typeof nearbyPlaceSchema>

function toFormValues(place?: AdminNearbyPlace | null): DeepPartial<NearbyPlaceFormValues> {
  return {
    name: place?.name ?? '',
    category: place?.category ?? 'Transit',
    distance: place?.distance ?? '',
    projectId: place?.projectId ?? '',
    displayOrder: place?.displayOrder ?? 0,
  }
}

function fromFormValues(values: NearbyPlaceFormValues, isActive: boolean): NearbyPlaceInput {
  return {
    name: values.name,
    category: values.category,
    distance: values.distance,
    projectId: values.projectId ? values.projectId : null,
    displayOrder: values.displayOrder,
    isActive,
  }
}

interface NearbyPlaceFormProps {
  place?: AdminNearbyPlace | null
  mode: 'create' | 'edit'
  submitting: boolean
  onSubmit: (input: NearbyPlaceInput) => void
  onCancel: () => void
}

export function NearbyPlaceForm({
  place,
  mode,
  submitting,
  onSubmit,
  onCancel,
}: NearbyPlaceFormProps) {
  const { data: projects = [] } = useAdminProjects()
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<NearbyPlaceFormValues>({
    resolver: zodResolver(nearbyPlaceSchema),
    defaultValues: toFormValues(place),
  })

  const [isActive, setIsActive] = useState(place?.isActive ?? true)
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
        onSubmit={handleSubmit((values) => onSubmit(fromFormValues(values, isActive)))}
        noValidate
      >
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="place-name" required>
                Place Name
              </Label>
              <Input
                id="place-name"
                placeholder="e.g. Hindusthan College"
                invalid={Boolean(errors.name)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'place-name-error' : undefined}
                {...register('name')}
              />
              <FieldError id="place-name-error" message={errors.name?.message} />
            </div>

            <div>
              <Label htmlFor="place-category" required>
                Category
              </Label>
              <Select
                id="place-category"
                invalid={Boolean(errors.category)}
                aria-invalid={Boolean(errors.category)}
                {...register('category')}
              >
                {NEARBY_PLACE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.category?.message} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="place-distance" required>
                Distance
              </Label>
              <Input
                id="place-distance"
                placeholder="e.g. 2.4 km"
                invalid={Boolean(errors.distance)}
                aria-invalid={Boolean(errors.distance)}
                aria-describedby={errors.distance ? 'place-distance-error' : undefined}
                {...register('distance')}
              />
              <FieldError id="place-distance-error" message={errors.distance?.message} />
            </div>

            <div>
              <Label htmlFor="place-order" required>
                Display Order
              </Label>
              <Input
                id="place-order"
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
            <Label htmlFor="place-project">Project</Label>
            <Select
              id="place-project"
              invalid={Boolean(errors.projectId)}
              aria-invalid={Boolean(errors.projectId)}
              aria-describedby="place-project-hint"
              {...register('projectId')}
            >
              <option value="">Site-wide (no project)</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </Select>
            <p id="place-project-hint" className="mt-1.5 text-xs text-ink-500">
              Leave as site-wide to show this place on every project page.
            </p>
            <FieldError message={errors.projectId?.message} />
          </div>

          <div>
            <Checkbox
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              label="Active"
              description="Hidden from the site when unchecked."
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-ink-200 pt-6 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={handleCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={submitting}>
              {mode === 'create' ? 'Save Place' : 'Update Place'}
            </Button>
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
