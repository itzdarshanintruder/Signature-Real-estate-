import { useEffect, useState } from 'react'
import { useForm, type DeepPartial } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { FieldError, Input, Label, Select, Textarea } from '@/components/ui/Input'
import {
  PLOT_STATUSES,
  PLOT_STATUS_LABELS,
  type Plot,
  type PlotInput,
} from '@/types/admin'

/* ---------- Numeric coercion (handles HTML number inputs which yield strings) ---------- */

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

/* ---------- Schema ---------- */

const plotSchema = z.object({
  name: z.string().trim().min(1, 'Please enter a project or plot name').max(120, 'Keep the name under 120 characters'),
  location: z.string().trim().min(1, 'Please enter a location'),
  plotNumber: z.string().trim().min(1, 'Please enter a plot number'),
  area: z.preprocess(
    coerceRequiredNumber,
    z.number({ invalid_type_error: 'Enter a valid area' }).positive('Area must be greater than 0'),
  ),
  price: z.preprocess(
    coerceRequiredNumber,
    z.number({ invalid_type_error: 'Enter a valid price' }).positive('Price must be greater than 0'),
  ),
  description: z.string().trim(),
  status: z.enum(['available', 'sold', 'reserved', 'coming-soon']),
  amenitiesText: z.string().trim(),
  latitude: z.preprocess(
    coerceOptionalNumber,
    z
      .number({ invalid_type_error: 'Enter a valid latitude' })
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90')
      .optional(),
  ),
  longitude: z.preprocess(
    coerceOptionalNumber,
    z
      .number({ invalid_type_error: 'Enter a valid longitude' })
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180')
      .optional(),
  ),
})

type PlotFormValues = z.infer<typeof plotSchema>

function toFormValues(plot?: Plot | null): DeepPartial<PlotFormValues> {
  return {
    name: plot?.name ?? '',
    location: plot?.location ?? '',
    plotNumber: plot?.plotNumber ?? '',
    area: plot?.area,
    price: plot?.price,
    description: plot?.description ?? '',
    status: plot?.status ?? 'available',
    amenitiesText: plot?.amenities.join(', ') ?? '',
    latitude: plot?.latitude ?? undefined,
    longitude: plot?.longitude ?? undefined,
  }
}

function fromFormValues(values: PlotFormValues): PlotInput {
  const amenities = values.amenitiesText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  return {
    ...values,
    amenities,
    latitude: values.latitude ?? null,
    longitude: values.longitude ?? null,
  }
}

interface PlotFormProps {
  plot?: Plot | null
  mode: 'create' | 'edit'
  submitting: boolean
  onSubmit: (input: PlotInput) => void
  onCancel: () => void
}

/** Reusable create/edit form for a plot — zod-validated, dirty-cancel guard. */
export function PlotForm({ plot, mode, submitting, onSubmit, onCancel }: PlotFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PlotFormValues>({
    resolver: zodResolver(plotSchema),
    defaultValues: toFormValues(plot),
  })

  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const hasUnsavedChanges = isDirty && !isSubmitting

  // Warn before leaving the page with unsaved changes.
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
      <form onSubmit={handleSubmit((values) => onSubmit(fromFormValues(values)))} noValidate>
        <div className="space-y-6">
          <div>
            <Label htmlFor="plot-name" required>
              Project / Plot Name
            </Label>
            <Input
              id="plot-name"
              placeholder="e.g. Signature City — Phase One"
              invalid={Boolean(errors.name)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'plot-name-error' : undefined}
              {...register('name')}
            />
            <FieldError id="plot-name-error" message={errors.name?.message} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="plot-location" required>
                Location
              </Label>
              <Input
                id="plot-location"
                placeholder="e.g. Sector 12, Growth Corridor"
                invalid={Boolean(errors.location)}
                aria-invalid={Boolean(errors.location)}
                aria-describedby={errors.location ? 'plot-location-error' : undefined}
                {...register('location')}
              />
              <FieldError id="plot-location-error" message={errors.location?.message} />
            </div>

            <div>
              <Label htmlFor="plot-number" required>
                Plot Number
              </Label>
              <Input
                id="plot-number"
                placeholder="e.g. SC-1"
                invalid={Boolean(errors.plotNumber)}
                aria-invalid={Boolean(errors.plotNumber)}
                aria-describedby={errors.plotNumber ? 'plot-number-error' : undefined}
                {...register('plotNumber')}
              />
              <FieldError id="plot-number-error" message={errors.plotNumber?.message} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="plot-area" required>
                Area (sq. ft.)
              </Label>
              <Input
                id="plot-area"
                type="number"
                inputMode="decimal"
                step="any"
                min={0}
                placeholder="e.g. 2400"
                invalid={Boolean(errors.area)}
                aria-invalid={Boolean(errors.area)}
                aria-describedby={errors.area ? 'plot-area-error' : undefined}
                {...register('area')}
              />
              <FieldError id="plot-area-error" message={errors.area?.message} />
            </div>

            <div>
              <Label htmlFor="plot-price" required>
                Price (₹)
              </Label>
              <Input
                id="plot-price"
                type="number"
                inputMode="decimal"
                step="any"
                min={0}
                placeholder="e.g. 1200000"
                invalid={Boolean(errors.price)}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? 'plot-price-error' : undefined}
                {...register('price')}
              />
              <FieldError id="plot-price-error" message={errors.price?.message} />
            </div>
          </div>

          <div>
            <Label htmlFor="plot-status" required>
              Status
            </Label>
            <Select
              id="plot-status"
              invalid={Boolean(errors.status)}
              aria-invalid={Boolean(errors.status)}
              {...register('status')}
            >
              {PLOT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {PLOT_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
            <FieldError message={errors.status?.message} />
          </div>

          <div>
            <Label htmlFor="plot-description">Description</Label>
            <Textarea
              id="plot-description"
              placeholder="Describe the plot, approvals, and key selling points…"
              invalid={Boolean(errors.description)}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'plot-description-error' : undefined}
              {...register('description')}
            />
            <FieldError id="plot-description-error" message={errors.description?.message} />
          </div>

          <div>
            <Label htmlFor="plot-amenities">Amenities / Features</Label>
            <Input
              id="plot-amenities"
              placeholder="e.g. Gated community, 24×7 security, Wide avenues"
              invalid={Boolean(errors.amenitiesText)}
              aria-invalid={Boolean(errors.amenitiesText)}
              aria-describedby="plot-amenities-hint"
              {...register('amenitiesText')}
            />
            <p id="plot-amenities-hint" className="mt-1.5 text-xs text-ink-500">
              Separate multiple amenities with commas.
            </p>
            <FieldError message={errors.amenitiesText?.message} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="plot-latitude">Latitude</Label>
              <Input
                id="plot-latitude"
                type="number"
                inputMode="decimal"
                step="any"
                placeholder="e.g. 12.9716"
                invalid={Boolean(errors.latitude)}
                aria-invalid={Boolean(errors.latitude)}
                aria-describedby={errors.latitude ? 'plot-latitude-error' : undefined}
                {...register('latitude')}
              />
              <FieldError id="plot-latitude-error" message={errors.latitude?.message} />
            </div>

            <div>
              <Label htmlFor="plot-longitude">Longitude</Label>
              <Input
                id="plot-longitude"
                type="number"
                inputMode="decimal"
                step="any"
                placeholder="e.g. 77.5946"
                invalid={Boolean(errors.longitude)}
                aria-invalid={Boolean(errors.longitude)}
                aria-describedby={errors.longitude ? 'plot-longitude-error' : undefined}
                {...register('longitude')}
              />
              <FieldError id="plot-longitude-error" message={errors.longitude?.message} />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-ink-200 pt-6 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={handleCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={submitting}>
              {mode === 'create' ? 'Save Plot' : 'Update Plot'}
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
