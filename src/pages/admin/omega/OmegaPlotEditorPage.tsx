import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Trash2, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Input, Label, FieldError } from '@/components/ui/Input'
import { Seo } from '@/components/ui/Seo'
import { useUiStore } from '@/store/ui-store'
import { useCreateOmegaPlot, useOmegaPlot, useUpdateOmegaPlot } from '@/hooks/use-omega-plots'
import type { OmegaPlotImage } from '@/services/admin/omegaPlotService'

const plotSchema = z.object({
  plotNumber: z.string().min(1, 'Plot number is required'),
  block: z.enum(['A', 'B']),
  width: z.coerce.number().optional(),
  length: z.coerce.number().optional(),
  areaSqFt: z.coerce.number().min(1, 'Area must be greater than 0'),
  status: z.enum(['Available', 'Reserved', 'Sold']),
  notes: z.string().optional(),
})

type PlotFormData = z.infer<typeof plotSchema>

export default function OmegaPlotEditorPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const pushToast = useUiStore((state) => state.pushToast)
  
  const { data: plot, isLoading } = useOmegaPlot(id)
  const createMutation = useCreateOmegaPlot()
  const updateMutation = useUpdateOmegaPlot(id!)

  const [images, setImages] = useState<OmegaPlotImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<PlotFormData>({
    resolver: zodResolver(plotSchema),
    defaultValues: {
      block: 'A',
      status: 'Available',
    }
  })

  // Auto-calculate area if both width and length are provided
  const watchWidth = watch('width')
  const watchLength = watch('length')
  useEffect(() => {
    if (watchWidth && watchLength) {
      setValue('areaSqFt', watchWidth * watchLength)
    }
  }, [watchWidth, watchLength, setValue])

  useEffect(() => {
    if (plot) {
      reset({
        plotNumber: plot.plotNumber,
        block: plot.block,
        width: plot.width,
        length: plot.length,
        areaSqFt: plot.areaSqFt,
        status: plot.status,
        notes: plot.notes,
      })
      setImages(plot.images || [])
    }
  }, [plot, reset])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages(prev => [
            ...prev,
            { url: ev.target!.result as string, isCover: prev.length === 0 }
          ])
        }
      }
      reader.readAsDataURL(file)
    })
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, idx) => idx !== indexToRemove)
      // Ensure one cover exists if there are images
      if (newImages.length > 0 && !newImages.some(img => img.isCover)) {
        newImages[0].isCover = true
      }
      return newImages
    })
  }

  const handleSetCover = (indexToSet: number) => {
    setImages(prev => prev.map((img, idx) => ({
      ...img,
      isCover: idx === indexToSet
    })))
  }

  const onSubmit = (data: PlotFormData) => {
    const payload = {
      ...data,
      width: data.width || 0,
      length: data.length || 0,
      notes: data.notes || '',
      images
    }

    if (isEditing) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          pushToast('Plot updated successfully')
          navigate('/admin/omega')
        },
        onError: () => pushToast('Failed to update plot', 'error')
      })
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          pushToast('Plot created successfully')
          navigate('/admin/omega')
        },
        onError: () => pushToast('Failed to create plot', 'error')
      })
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  if (isEditing && isLoading) {
    return (
      <>
        <AdminHeader />
        <Container className="pt-24"><p>Loading plot...</p></Container>
      </>
    )
  }

  return (
    <>
      <Seo title={`${isEditing ? 'Edit' : 'Add'} Omega Plot`} />
      <AdminHeader />

      <header className="border-b border-ink-200 bg-cream-50 pt-10 pb-8">
        <Container>
          <Link
            to="/admin/omega"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-500 transition-colors hover:text-gold-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Omega Plots
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl text-ink-900 md:text-3xl">
              {isEditing ? 'Edit Plot' : 'Add New Plot'}
            </h1>
            <Button onClick={handleSubmit(onSubmit)} loading={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Plot'}
            </Button>
          </div>
        </Container>
      </header>

      <main className="min-h-svh bg-cream-100 py-12">
        <Container>
          <div className="mx-auto max-w-4xl space-y-8">
            <form id="plot-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-8 md:grid-cols-2">
              
              {/* Left col - Details */}
              <div className="space-y-6 rounded-sm border border-ink-200 bg-cream-50 p-6 md:p-8">
                <h2 className="font-display text-lg text-ink-900">Plot Details</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Plot Number</Label>
                    <Input
                      {...register('plotNumber')}
                      invalid={!!errors.plotNumber}
                      placeholder="e.g. 1A"
                    />
                    <FieldError message={errors.plotNumber?.message} />
                  </div>
                  <div>
                    <Label>Block</Label>
                    <select
                      {...register('block')}
                      className="flex h-[50px] w-full border border-ink-300 bg-cream-50 px-4 py-3 text-ink-800 transition-colors duration-300 focus:border-gold-600 focus:outline-none"
                    >
                      <option value="A">Block A</option>
                      <option value="B">Block B</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Width (ft)</Label>
                    <Input
                      type="number"
                      {...register('width')}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label>Length (ft)</Label>
                    <Input
                      type="number"
                      {...register('length')}
                      placeholder="40"
                    />
                  </div>
                  <div>
                    <Label>Area (sq.ft)</Label>
                    <Input
                      type="number"
                      {...register('areaSqFt')}
                      invalid={!!errors.areaSqFt}
                      placeholder="1200"
                    />
                    <FieldError message={errors.areaSqFt?.message} />
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <select
                    {...register('status')}
                    className="flex h-[50px] w-full border border-ink-300 bg-cream-50 px-4 py-3 text-ink-800 transition-colors duration-300 focus:border-gold-600 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                <div>
                  <Label>Notes / Description (optional)</Label>
                  <textarea
                    {...register('notes')}
                    className="flex min-h-24 w-full border border-ink-300 bg-cream-50 px-4 py-3 text-ink-800 placeholder:text-ink-400 transition-colors duration-300 focus:border-gold-600 focus:outline-none"
                    placeholder="e.g. Corner plot facing East"
                  />
                </div>
              </div>

              {/* Right col - Photos */}
              <div className="space-y-6 rounded-sm border border-ink-200 bg-cream-50 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg text-ink-900">Gallery</h2>
                  <Button variant="secondary" onClick={() => fileInputRef.current?.click()} type="button">
                    <Upload className="h-4 w-4" /> Upload
                  </Button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                {images.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center rounded-sm border-2 border-dashed border-ink-200 bg-ink-50 text-ink-400">
                    <p className="text-sm">No photos uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="group relative aspect-square overflow-hidden rounded-sm border border-ink-200 bg-ink-50">
                        <img src={img.url} alt="Plot" className="h-full w-full object-cover" />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-ink-900/60 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 rounded-sm bg-red-600 p-1.5 text-white transition-colors hover:bg-red-700"
                            aria-label="Remove image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          {!img.isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCover(idx)}
                              className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink-800 px-3 py-1 text-xs font-semibold text-cream-50 transition-colors hover:bg-ink-700"
                            >
                              Set as Cover
                            </button>
                          )}
                        </div>

                        {img.isCover && (
                          <div className="absolute top-2 left-2 rounded-sm bg-gold-500 px-2 py-1 text-[10px] font-bold tracking-wider text-ink-900 uppercase shadow-sm">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </form>
          </div>
        </Container>
      </main>
    </>
  )
}
