import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bus,
  Check,
  GraduationCap,
  MapPin,
  Phone,
  Stethoscope,
  Train,
  X,
  ZoomIn,
} from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { buttonStyles } from '@/components/ui/button-styles'
import { SITE } from '@/constants/site'
import { cn } from '@/utils/cn'
import { useOmegaPlots } from '@/hooks/use-omega-plots'
import type { OmegaPlot } from '@/services/admin/omegaPlotService'

// ─── Project constants ────────────────────────────────────────────────────────

const PROJECT = {
  name: 'Omega Estates',
  tagline: 'Premium Villa Plots Near L&T Bypass',
  location: 'Vellalur Village, Madukkarai Taluk, Coimbatore District',
  acreage: '2.68 Acres',
  totalPlots: 47,
  plotSizes: '1,042 – 1,647 sq.ft.',
  dtcp: 'DTCP Approved — 590/2025',
  rera: 'RERA Registered',
  surveyNumbers: '262/1A, 263/1A, 263/3A & 263/2',
} as const

const IMAGES = [
  {
    src: '/projects/omega-estates/entrance.jpg',
    alt: 'Omega Estates grand entrance gate — Premium Villa Plots Near L&T Bypass',
    label: 'Grand Entrance',
  },
  {
    src: '/projects/omega-estates/about.jpg',
    alt: 'Omega Estates aerial view — The Perfect Address for Your Forever Home',
    label: 'Community View',
  },
  {
    src: '/projects/omega-estates/connectivity.jpg',
    alt: 'Omega Estates location connectivity — distances to key landmarks',
    label: 'Location & Connectivity',
  },
  {
    src: '/projects/omega-estates/location-map.jpg',
    alt: 'Omega Estates road map — Vellalur Road, L&T Bypass',
    label: 'Road Map',
  },
] as const

const STATS = [
  { label: 'Total Area', value: '2.68 Acres' },
  { label: 'Premium Plots', value: '47 Plots' },
  { label: 'Plot Sizes', value: '1,042–1,647 sq.ft.' },
  { label: 'DTCP Approval', value: '590/2025' },
] as const

const AMENITIES = [
  'Black Top Road',
  'Round-the-Clock Security',
  'Beautiful Parks',
  'Solar Street Lights',
  'Gated Community',
  'Quality Ground Water',
  'Grand Arch Entrance',
  'Underground Drainage',
] as const

const FEATURES = [
  'DTCP Approved & RERA Registered',
  'Clear title with legal documentation',
  '33-foot & 30-foot wide internal roads',
  '23-foot peripheral roads',
  'A-Block & B-Block layout',
  'Two phases for flexible ownership',
  'Proximity to CBE–Trichy Road',
  'Walking distance to bus stop',
] as const

const NEARBY = [
  { icon: Bus, category: 'Transit', name: 'Rice Mill Bus Stop', time: '3 min drive' },
  { icon: Bus, category: 'Transit', name: 'Kanjikonampalayam Bus Stop', time: '5 min drive' },
  { icon: Bus, category: 'Transit', name: 'Singanallur Bus Stand', time: '15 min drive' },
  { icon: GraduationCap, category: 'Schools', name: 'Panchayat Union Primary School', time: '3 min drive' },
  { icon: GraduationCap, category: 'Schools', name: 'SSVM World School', time: '5 min drive' },
  { icon: Stethoscope, category: 'Hospital', name: 'Govt. Primary Health Centre Vellalur', time: '3 min drive' },
  { icon: Stethoscope, category: 'Hospital', name: 'NG Hospital & Research Centre', time: '9 min drive' },
  { icon: Train, category: 'Railway', name: 'Podanur Junction', time: '14 min drive' },
  { icon: MapPin, category: 'Landmark', name: 'Coimbatore International Airport', time: '29 min drive' },
  { icon: MapPin, category: 'Landmark', name: 'Singanallur Police Station', time: '9 min drive' },
] as const

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: typeof IMAGES
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const img = images[currentIndex]
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream-50/20 bg-ink-900/80 text-cream-50 transition-colors hover:text-gold-400"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Previous image"
          className="absolute left-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-cream-50/20 bg-ink-900/80 text-cream-50 transition-colors hover:text-gold-400 md:left-8"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}

      {/* Image */}
      <div
        className="mx-20 max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.alt}
          className="max-h-[85vh] max-w-[88vw] object-contain shadow-2xl"
        />
        <p className="mt-3 text-center text-sm font-medium text-cream-50/70">{img.label}</p>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Next image"
          className="absolute right-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-cream-50/20 bg-ink-900/80 text-cream-50 transition-colors hover:text-gold-400 md:right-8"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      )}

      {/* Counter */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-cream-50/50">
        {currentIndex + 1} / {images.length}
      </p>
    </div>
  )
}

// ─── Gallery grid ─────────────────────────────────────────────────────────────

function GalleryGrid({ onOpen }: { onOpen: (index: number) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Large hero image — spans 2 cols on lg */}
      <div
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-sm lg:col-span-2 lg:row-span-1',
          'aspect-[16/10]',
        )}
        onClick={() => onOpen(0)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpen(0)}
        aria-label="View entrance image"
      >
        <img
          src={IMAGES[0].src}
          alt={IMAGES[0].alt}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-ink-900/0 transition-colors duration-300 group-hover:bg-ink-900/25" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ZoomIn className="h-4 w-4 text-cream-50" />
          <span className="text-xs font-semibold text-cream-50">{IMAGES[0].label}</span>
        </div>
      </div>

      {/* Remaining images */}
      {IMAGES.slice(1).map((img, idx) => (
        <div
          key={img.src}
          className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-sm"
          onClick={() => onOpen(idx + 1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onOpen(idx + 1)}
          aria-label={`View ${img.label}`}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-ink-900/0 transition-colors duration-300 group-hover:bg-ink-900/30" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn className="h-4 w-4 text-cream-50" />
            <span className="text-xs font-semibold text-cream-50">{img.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Plot Lightbox ────────────────────────────────────────────────────────────

interface PlotLightboxProps {
  plot: OmegaPlot
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function PlotLightbox({ plot, currentIndex, onClose, onPrev, onNext }: PlotLightboxProps) {
  const img = plot.images[currentIndex]
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950/95 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream-50/20 bg-ink-900/80 text-cream-50 transition-colors hover:text-gold-400"
      >
        <X className="h-5 w-5" />
      </button>

      {plot.images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-cream-50/20 bg-ink-900/80 text-cream-50 transition-colors hover:text-gold-400 md:left-8"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}

      <div className="mx-20 max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <img
          src={img.url}
          alt={`Plot ${plot.plotNumber} view ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-[88vw] object-contain shadow-2xl"
        />
        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-cream-50">Plot {plot.plotNumber} — {plot.areaSqFt} sq.ft.</p>
          {plot.notes && <p className="mt-1 text-xs text-cream-50/60">{plot.notes}</p>}
        </div>
      </div>

      {plot.images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-cream-50/20 bg-ink-900/80 text-cream-50 transition-colors hover:text-gold-400 md:right-8"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      )}

      {plot.images.length > 1 && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-cream-50/50">
          {currentIndex + 1} / {plot.images.length}
        </p>
      )}
    </div>
  )
}

// ─── Plot Gallery Section ─────────────────────────────────────────────────────

function OmegaPlotsExplorer() {
  const { data: plots, isLoading } = useOmegaPlots()
  const [activePlot, setActivePlot] = useState<{ plot: OmegaPlot; imgIndex: number } | null>(null)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      </div>
    )
  }

  if (!plots || plots.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-500">Plot gallery is currently being updated. Please check back later.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plots.map((plot, index) => {
          const cover = plot.images.find((img) => img.isCover) || plot.images[0]
          
          return (
            <div
              key={plot.id}
              className={cn(
                'group relative cursor-pointer overflow-hidden rounded-sm bg-ink-900',
                index % 4 === 0 ? 'sm:col-span-2 sm:row-span-2 aspect-square sm:aspect-auto' : 'aspect-square'
              )}
              onClick={() => cover && setActivePlot({ plot, imgIndex: 0 })}
            >
              {cover ? (
                <img
                  src={cover.url}
                  alt={`Plot ${plot.plotNumber}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-ink-800">
                  <span className="text-xs text-cream-50/30">No Image</span>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* Content */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={cn(
                  'w-fit rounded-sm px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md',
                  plot.status === 'Available' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  plot.status === 'Reserved' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                )}>
                  {plot.status}
                </span>
              </div>

              <div className="absolute right-4 bottom-4 left-4">
                <h3 className="font-display text-2xl text-cream-50">Plot {plot.plotNumber}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm font-medium text-gold-400">{plot.areaSqFt} sq.ft.</p>
                  {plot.images.length > 1 && (
                    <span className="flex items-center gap-1.5 text-xs text-cream-50/50">
                      <ZoomIn className="h-3 w-3" />
                      +{plot.images.length - 1}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {activePlot && (
        <PlotLightbox
          plot={activePlot.plot}
          currentIndex={activePlot.imgIndex}
          onClose={() => setActivePlot(null)}
          onPrev={() => setActivePlot({ plot: activePlot.plot, imgIndex: (activePlot.imgIndex - 1 + activePlot.plot.images.length) % activePlot.plot.images.length })}
          onNext={() => setActivePlot({ plot: activePlot.plot, imgIndex: (activePlot.imgIndex + 1) % activePlot.plot.images.length })}
        />
      )}
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OmegaEstatesPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + IMAGES.length) % IMAGES.length)), [])
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % IMAGES.length)), [])

  return (
    <>
      <Seo
        title="Omega Estates — Premium Villa Plots Near L&T Bypass, Coimbatore"
        description="Omega Estates offers 47 DTCP approved premium villa plots (1,042–1,647 sq.ft.) in Vellalur Village, Madukkarai Taluk, Coimbatore. RERA Registered. 2.68 Acres gated community."
        path="/projects/omega-estates"
      />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-900 pt-36 pb-20 md:pt-44 md:pb-28">
        {/* Background image */}
        <div aria-hidden className="absolute inset-0">
          <img
            src="/projects/omega-estates/entrance.jpg"
            alt=""
            className="h-full w-full object-cover object-center opacity-45"
          />
        </div>
        {/* Gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/65 to-ink-900/50"
        />

        <Container className="relative">
          <Reveal>
            <Breadcrumb
              tone="dark"
              className="mb-8"
              items={[
                { label: 'Home', href: '/' },
                { label: 'Projects', href: '/projects' },
                { label: 'Omega Estates' },
              ]}
            />

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="gold">Premium</Badge>
              <Badge tone="green">DTCP Approved</Badge>
              <Badge tone="muted">RERA Registered</Badge>
              <p className="flex items-center gap-2 text-sm text-cream-50/70">
                <MapPin className="h-4 w-4 text-gold-400" aria-hidden />
                {PROJECT.location}
              </p>
            </div>

            {/* Title */}
            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-cream-50 sm:text-5xl lg:text-6xl">
              Omega Estates
            </h1>
            <p className="mt-3 font-display text-xl text-gold-400 italic">
              {PROJECT.tagline}
            </p>

            {/* Quick stats bar */}
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-cream-50/15 pt-7">
              {STATS.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[0.62rem] font-bold tracking-[0.22em] text-cream-50/50 uppercase">
                    {label}
                  </p>
                  <p className="mt-1 font-display text-lg text-cream-50">{value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <Section tone="white">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Text */}
            <div>
              <SectionHeading
                align="left"
                eyebrow="About the Project"
                title={<>The Perfect Address<br />for Your Forever Home</>}
                className="mb-8 md:mb-8"
              />
              <Reveal>
                <p className="text-base leading-relaxed text-ink-600 md:text-lg">
                  Welcome to Omega Estates, the most elegant and enchanting address near L&T Bypass.
                  It's not every day you come across a great luxury villa plot in such an amazing
                  location — and at an incredible value.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <p className="mt-5 text-base leading-relaxed text-ink-600 md:text-lg">
                  Tucked away from the bustle of the city, Omega Estates introduces a whole new
                  standard of nature in harmony near L&T Bypass. This luxury gated community —
                  DTCP Approved & RERA Registered — is spread across{' '}
                  <strong className="text-ink-800">2.68 Acres</strong> of greenery and consists of{' '}
                  <strong className="text-ink-800">47 premium plots</strong>, ranging from{' '}
                  <strong className="text-ink-800">1,042 sq.ft. to 1,647 sq.ft.</strong>
                </p>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-5 text-base leading-relaxed text-ink-600 md:text-lg">
                  The location is ideal for building a residential luxury villa, just a few minutes
                  away from key landmarks with excellent connectivity to all parts of the city.
                </p>
              </Reveal>

              {/* Key features */}
              <Reveal delay={180} className="mt-10">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      <span className="text-sm leading-relaxed text-ink-600">{f}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={220} className="mt-10 flex flex-wrap gap-3">
                <Link to="/contact" className={buttonStyles('primary', 'md')}>
                  Enquire About Omega Estates
                </Link>
                <a
                  href={`tel:${SITE.phoneHref.replace('tel:', '')}`}
                  className={buttonStyles('secondary', 'md')}
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  Call Us
                </a>
              </Reveal>
            </div>

            {/* About image */}
            <Reveal delay={100}>
              <div className="relative overflow-hidden rounded-sm shadow-xl">
                <img
                  src="/projects/omega-estates/about.jpg"
                  alt="Omega Estates — aerial community view showing wide roads, green spaces and villa plots"
                  className="aspect-[4/3] w-full object-cover object-center"
                />
                {/* Approval badges overlay */}
                <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                  <span className="rounded-sm bg-ink-900/85 px-3 py-1.5 text-xs font-bold tracking-wider text-gold-400 uppercase backdrop-blur-sm">
                    {PROJECT.dtcp}
                  </span>
                  <span className="rounded-sm bg-ink-900/85 px-3 py-1.5 text-xs font-bold tracking-wider text-cream-50/80 uppercase backdrop-blur-sm">
                    {PROJECT.rera}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── GALLERY ───────────────────────────────────────────────────────── */}
      <Section tone="cream" id="gallery">
        <Container>
          <SectionHeading
            eyebrow="Gallery"
            title="See Omega Estates"
            subtitle="Click any image to view full-size. Swipe or use arrow keys to navigate."
          />
          <Reveal>
            <GalleryGrid onOpen={openLightbox} />
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-4 text-center text-xs text-ink-400">
              Click any image to zoom in · {IMAGES.length} images
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ── PLOT GALLERY ──────────────────────────────────────────────────── */}
      <Section tone="dark" id="plots">
        <Container>
          <SectionHeading
            tone="dark"
            eyebrow="Explore Our Plots"
            title="Individual Plot Gallery"
            subtitle="View detailed images and availability for individual premium plots."
          />
          <Reveal>
            <OmegaPlotsExplorer />
          </Reveal>
        </Container>
      </Section>

      {/* ── MASTER LAYOUT ─────────────────────────────────────────────────── */}
      <Section tone="white" id="layout">
        <Container>
          <SectionHeading
            eyebrow="Site Plan"
            title="Master Layout"
            subtitle={`Survey Numbers: ${PROJECT.surveyNumbers} — Measuring ${PROJECT.acreage}`}
          />
          <Reveal>
            <div
              className="group relative cursor-zoom-in overflow-hidden rounded-sm border border-ink-200 bg-cream-50 shadow-md"
              onClick={() => {
                // Open master layout in new tab for best viewing
                window.open('/projects/omega-estates/master-layout.jpg', '_blank', 'noopener')
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') window.open('/projects/omega-estates/master-layout.jpg', '_blank', 'noopener')
              }}
              aria-label="View master layout full size"
            >
              <img
                src="/projects/omega-estates/master-layout.jpg"
                alt="Omega Estates master layout plan — 47 plots across A-Block and B-Block with road widths marked"
                className="w-full object-contain"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-ink-900/0 transition-colors duration-300 group-hover:bg-ink-900/10">
                <span className="flex items-center gap-2 rounded-full bg-ink-900/70 px-4 py-2 text-sm font-semibold text-cream-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn className="h-4 w-4" />
                  Open Full Size
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-ink-400">
              Click to open master layout in full size · Roads and OSR handed over to local Panchayat Taluk
            </p>
          </Reveal>

          {/* Layout legend */}
          <Reveal delay={100} className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              { color: 'bg-blue-200 border-blue-300', label: 'A-Block Plots' },
              { color: 'bg-orange-200 border-orange-300', label: 'B-Block Plots' },
              { color: 'bg-ink-800 border-ink-700', label: 'Roads (33ft / 30ft / 23ft)' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={cn('h-4 w-6 rounded-sm border', color)} aria-hidden />
                <span className="text-sm text-ink-600">{label}</span>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* ── LOCATION & CONNECTIVITY ───────────────────────────────────────── */}
      <Section tone="cream" id="location">
        <Container>
          <SectionHeading
            eyebrow="Location"
            title="Perfectly Connected"
            subtitle="Omega Estates sits at the intersection of Vellalur Road and the Pattanam–L&T Bypass corridor — giving you city connectivity with village serenity."
          />

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Map image */}
            <Reveal>
              <div
                className="group relative cursor-zoom-in overflow-hidden rounded-sm shadow-lg"
                onClick={() => window.open('/projects/omega-estates/location-map.jpg', '_blank', 'noopener')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') window.open('/projects/omega-estates/location-map.jpg', '_blank', 'noopener') }}
                aria-label="View location map full size"
              >
                <img
                  src="/projects/omega-estates/location-map.jpg"
                  alt="Omega Estates road location map showing Vellalur Road, L&T Bypass, CBE–Trichy Road connections"
                  className="w-full object-contain"
                />
                <div className="absolute inset-0 bg-ink-900/0 transition-colors duration-300 group-hover:bg-ink-900/10" />
                <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-sm bg-ink-900/70 px-2.5 py-1.5 text-xs font-semibold text-cream-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn className="h-3.5 w-3.5" /> View Map
                </span>
              </div>
            </Reveal>

            {/* Connectivity list */}
            <div>
              <p className="mb-4 text-[0.65rem] font-bold tracking-[0.2em] text-ink-400 uppercase">
                Distances from Omega Estates
              </p>
              <ul className="divide-y divide-ink-900/8 rounded-sm border border-ink-200 bg-cream-50">
                {NEARBY.map(({ icon: Icon, category, name, time }, i) => (
                  <Reveal as="li" key={name} delay={i * 40} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-50 text-gold-700">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink-800">{name}</p>
                        <p className="text-xs text-ink-400">{category}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
                      {time}
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>

          {/* Connectivity infographic */}
          <Reveal className="mt-12">
            <div
              className="group relative cursor-zoom-in overflow-hidden rounded-sm shadow-md"
              onClick={() => window.open('/projects/omega-estates/connectivity.jpg', '_blank', 'noopener')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') window.open('/projects/omega-estates/connectivity.jpg', '_blank', 'noopener') }}
              aria-label="View connectivity infographic full size"
            >
              <img
                src="/projects/omega-estates/connectivity.jpg"
                alt="Omega Estates connectivity infographic — bus stops, schools, hospitals, railway and important places with drive times"
                className="w-full object-contain"
              />
              <div className="absolute inset-0 bg-ink-900/0 transition-colors duration-300 group-hover:bg-ink-900/10" />
              <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-sm bg-ink-900/70 px-2.5 py-1.5 text-xs font-semibold text-cream-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ZoomIn className="h-3.5 w-3.5" /> Open Full Size
              </span>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── AMENITIES ─────────────────────────────────────────────────────── */}
      <Section tone="dark" id="amenities">
        <Container>
          <SectionHeading
            tone="dark"
            eyebrow="Amenities"
            title="Everything You Need"
            subtitle="Omega Estates is designed for modern, comfortable living with thoughtfully planned infrastructure."
          />
          <Reveal>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {AMENITIES.map((amenity) => (
                <li
                  key={amenity}
                  className="flex items-center gap-3 rounded-sm border border-cream-50/10 bg-cream-50/5 px-4 py-4 transition-colors hover:bg-cream-50/10"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400">
                    <Check className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-sm font-medium text-cream-50/90">{amenity}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* ── ENQUIRE CTA ───────────────────────────────────────────────────── */}
      <Section tone="cream" id="enquire">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <p className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-600 uppercase">
                <span aria-hidden className="h-px w-8 bg-gold-500" />
                Ready to Invest?
                <span aria-hidden className="h-px w-8 bg-gold-500" />
              </p>
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">
                Schedule a Site Visit
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-500">
                Walk the land. See the wide roads, green open spaces and the grand entrance of
                Omega Estates for yourself. Our team is ready to guide you through every plot.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link to="/contact" className={buttonStyles('primary', 'lg')}>
                  Enquire Now
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <a href={SITE.phoneHref} className={buttonStyles('secondary', 'lg')}>
                  <Phone className="h-4 w-4" aria-hidden />
                  {SITE.phone}
                </a>
              </div>

              <p className="mt-6 text-xs text-ink-400">
                DTCP Approved — 590/2025 · RERA Registered · Survey Nos. {PROJECT.surveyNumbers}
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={IMAGES}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}
