import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { PageHeader } from '@/components/ui/PageHeader'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Image } from '@/components/ui/Image'
import { Modal } from '@/components/ui/Modal'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { CTABand } from '@/components/sections/CTABand'
import { useGallery } from '@/hooks/use-content'
import type { GalleryCategory } from '@/data/gallery'

const CATEGORIES: ('All' | GalleryCategory)[] = [
  'All',
  'Master Plan',
  'Lifestyle',
  'Progress',
  'Approvals',
]

export default function GalleryPage() {
  const { data: items, isLoading, isError, refetch } = useGallery()
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const visible =
    items?.filter((item) => category === 'All' || item.category === category) ?? []

  const close = useCallback(() => setLightbox(null), [])
  const step = useCallback(
    (direction: 1 | -1) => {
      setLightbox((current) => {
        if (current === null || visible.length === 0) return current
        return (current + direction + visible.length) % visible.length
      })
    },
    [visible.length],
  )

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, step])

  const active = lightbox !== null ? visible[lightbox] : null

  return (
    <>
      <Seo
        title="Gallery"
        description="Browse the Signature City gallery — master plans, lifestyle spaces, progress and approvals."
      />
      <PageHeader
        eyebrow="The Gallery"
        title="A Glimpse of the Good Life"
        description="Master plans, landscaped avenues, community spaces and the approvals behind every promise."
      >
        <Tabs
          value={category}
          onValueChange={(value) => {
            setCategory(value as (typeof CATEGORIES)[number])
            setLightbox(null)
          }}
          className="w-full"
        >
          <TabsList aria-label="Filter gallery by category">
            {CATEGORIES.map((item) => (
              <TabsTrigger key={item} value={item}>
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </PageHeader>

      <Section tone="cream">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {isError ? (
              <div className="col-span-full">
                <ErrorState onRetry={() => void refetch()} />
              </div>
            ) : isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square w-full" />
                ))
              : visible.map((item, index) => (
                  <Reveal key={item.id} delay={(index % 4) * 60}>
                    <button
                      type="button"
                      onClick={() => setLightbox(index)}
                      aria-label={`View larger: ${item.image.alt}`}
                      className="group block w-full cursor-pointer text-left"
                    >
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        aspect="aspect-square"
                        className="transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-ink-500 uppercase">
                        {item.category}
                      </p>
                    </button>
                  </Reveal>
                ))}
          </div>
        </Container>
      </Section>

      {/* Lightbox */}
      <Modal
        open={active !== null}
        onClose={close}
        label={active ? `${active.image.alt} — gallery image` : 'Gallery image'}
        className="max-w-4xl p-4"
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            step(-1)
          }}
          aria-label="Previous image"
          className="absolute top-1/2 left-3 z-10 -translate-y-1/2 cursor-pointer rounded-sm border border-cream-50/20 p-2.5 text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-300 md:left-8"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <figure className="max-w-4xl">
          {active ? (
            <Image
              src={active.image.src}
              alt={active.image.alt}
              aspect="aspect-[4/3]"
              eager
              className="shadow-lg"
            />
          ) : null}
          <figcaption className="mt-4 flex items-center justify-between text-sm text-cream-50/70">
            <span>{active?.image.alt}</span>
            <span className="text-gold-400 tabular-nums">
              {(lightbox ?? 0) + 1} / {visible.length}
            </span>
          </figcaption>
        </figure>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            step(1)
          }}
          aria-label="Next image"
          className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer rounded-sm border border-cream-50/20 p-2.5 text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-300 md:right-8"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </Modal>

      <CTABand />
    </>
  )
}
