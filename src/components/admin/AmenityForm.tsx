import { useEffect, useState } from 'react'
import { useForm, type DeepPartial } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { FieldError, Input, Label, Select, Textarea } from '@/components/ui/Input'
import type { AdminAmenity, AmenityInput } from '@/types/admin'

const AMENITY_CATEGORIES = ['Lifestyle', 'Security', 'Community', 'Infrastructure'] as const

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

const amenitySchema = z.object({
  title: z.string().trim().min(1, 'Please enter an amenity name').max(120, 'Keep the name under 120 characters'),
  description: z.string().trim().max(500, 'Keep the description under 500 characters'),
  icon: z.string().trim().min(1, 'Please enter a lucide icon key').max(60),
  category: z.string().trim().min(1, 'Please choose a category'),
  displayOrder: z.preprocess(
    coerceRequiredNumber,
    z.number({ invalid_type_error: 'Enter a valid order' }).min(0, 'Order cannot be negative'),
  ),
})

type AmenityFormValues = z.infer<typeof amenitySchema>

function toFormValues(amenity?: AdminAmenity | null): DeepPartial<AmenityFormValues> {
  return {
    title: amenity?.title ?? '',
    description: amenity?.description ?? '',
    icon: amenity?.icon ?? '',
    category: amenity?.category ?? 'Lifestyle',
    displayOrder: amenity?.displayOrder ?? 0,
  }
}

function fromFormValues(
  values: AmenityFormValues,
  isActive: boolean,
): AmenityInput {
  return { ...values, isActive }
}

interface AmenityFormProps {
  amenity?: AdminAmenity | null
  mode: 'create' | 'edit'
  submitting: boolean
  onSubmit: (input: AmenityInput) => void
  onCancel: () => void
}

export function AmenityForm({
  amenity,
  mode,
  submitting,
  onSubmit,
  onCancel,
}: AmenityFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<AmenityFormValues>({
    resolver: zodResolver(amenitySchema),
    defaultValues: toFormValues(amenity),
  })

  const [isActive, setIsActive] = useState(amenity?.isActive ?? true)
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
              <Label htmlFor="amenity-title" required>
                Amenity Name
              </Label>
              <Input
                id="amenity-title"
                placeholder="e.g. 24×7 Security"
                invalid={Boolean(errors.title)}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'amenity-title-error' : undefined}
                {...register('title')}
              />
              <FieldError id="amenity-title-error" message={errors.title?.message} />
            </div>

            <div>
              <Label htmlFor="amenity-icon" required>
                Icon Key
              </Label>
              <Input
                id="amenity-icon"
                placeholder="e.g. shield"
                invalid={Boolean(errors.icon)}
                aria-invalid={Boolean(errors.icon)}
                aria-describedby="amenity-icon-hint"
                {...register('icon')}
              />
              <p id="amenity-icon-hint" className="mt-1.5 text-xs text-ink-500">
                A lucide icon key, e.g. shield, trees, or car.
              </p>
              <FieldError message={errors.icon?.message} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="amenity-category" required>
                Category
              </Label>
              <Select
                id="amenity-category"
                invalid={Boolean(errors.category)}
                aria-invalid={Boolean(errors.category)}
                {...register('category')}
              >
                {AMENITY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.category?.message} />
            </div>

            <div>
              <Label htmlFor="amenity-order" required>
                Display Order
              </Label>
              <Input
                id="amenity-order"
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
            <Label htmlFor="amenity-description">Description</Label>
            <Textarea
              id="amenity-description"
              placeholder="What this amenity means for residents…"
              invalid={Boolean(errors.description)}
              aria-invalid={Boolean(errors.description)}
              {...register('description')}
            />
            <FieldError message={errors.description?.message} />
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
              {mode === 'create' ? 'Save Amenity' : 'Update Amenity'}
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
