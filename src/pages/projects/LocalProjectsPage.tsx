/**
 * LocalProjectsPage.tsx
 * Public-facing page showing projects added by admin via localStorage.
 * Users can click "I'm Interested" to submit an enquiry.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  MapPin,
  Ruler,
  IndianRupee,
  CheckCircle2,
  X,
  PhoneCall,
  Building2,
  Star,
  ArrowRight,
  Play,
  Maximize2,
} from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FieldError, Input, Label, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { CTABand } from '@/components/sections/CTABand'
import { useLocalStore, type LocalProject } from '@/store/local-store'
import { formatCurrencyInr } from '@/utils/formatters'
import { apiFetch } from '@/services/api-client'

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = LocalProject['status']

const STATUS_TONE: Record<ProjectStatus, 'green' | 'gold' | 'muted' | 'red'> = {
  available: 'green',
  premium: 'gold',
  launching: 'muted',
  'sold-out': 'red',
}

const STATUS_LABEL: Record<ProjectStatus, string> = {
  available: 'Available',
  premium: 'Premium',
  launching: 'Launching Soon',
  'sold-out': 'Sold Out',
}

// ─── Interest Form Schema ─────────────────────────────────────────────────────

const interestSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name'),
  email: z.string().trim().email('Enter a valid email').or(z.literal('')).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  message: z.string().trim().optional(),
})

type InterestFormValues = z.infer<typeof interestSchema>

// ─── Interest Modal ───────────────────────────────────────────────────────────

interface InterestModalProps {
  project: LocalProject
  onClose: () => void
}

function InterestModal({ project, onClose }: InterestModalProps) {
  const addLead = useLocalStore((s) => s.addLead)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InterestFormValues>({
    resolver: zodResolver(interestSchema),
  })

  const onSubmit = async (values: InterestFormValues) => {
  try {
    await apiFetch('/api/leads', {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        email: values.email ?? '',
        phone: values.phone,
        message: values.message ?? '',
        interest: 'site-visit',
        projectSlug: String(project.id),
      }),
    })

    // Keep local store also updated
    addLead({
      projectId: project.id,
      projectTitle: project.title,
      name: values.name,
      email: values.email ?? '',
      phone: values.phone,
      message: values.message ?? '',
    })

    setSubmitted(true)
  } catch (error) {
    console.error('Enquiry submission error:', error)
    alert('Unable to submit enquiry. Please try again.')
  }
}
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden border border-ink-200 bg-white shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-sm p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          /* Success state */
          <div className="flex flex-col items-center px-8 py-12 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </span>
            <h2 className="font-display text-2xl text-ink-900">Thank you!</h2>
            <p className="mt-2 text-sm text-ink-500">
              Your interest in <strong>{project.title}</strong> has been recorded. Our team will
              reach out to you shortly.
            </p>
            <Button onClick={onClose} className="mt-6 w-full">
              Done
            </Button>
          </div>
        ) : (
          /* Form */
          <>
            <div className="border-b border-ink-100 bg-ink-900 px-6 py-5">
              <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
                Express Interest
              </p>
              <h2 className="mt-1 font-display text-xl text-cream-50">{project.title}</h2>
              <p className="mt-0.5 text-sm text-cream-50/60">{project.location}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 px-6 py-6">
              <div>
                <Label htmlFor="interest-name" required>
                  Full Name
                </Label>
                <Input
                  id="interest-name"
                  placeholder="Your name"
                  invalid={Boolean(errors.name)}
                  {...register('name')}
                />
                <FieldError message={errors.name?.message} />
              </div>

              <div>
                <Label htmlFor="interest-phone" required>
                  Mobile Number
                </Label>
                <Input
                  id="interest-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  invalid={Boolean(errors.phone)}
                  {...register('phone')}
                />
                <FieldError message={errors.phone?.message} />
              </div>

              <div>
                <Label htmlFor="interest-email">Email (optional)</Label>
                <Input
                  id="interest-email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                />
              </div>

              <div>
                <Label htmlFor="interest-message">Message (optional)</Label>
                <Textarea
                  id="interest-message"
                  placeholder="Any questions or specific requirements?"
                  rows={3}
                  {...register('message')}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                <PhoneCall className="h-4 w-4" />
                Submit Enquiry
              </Button>

              <p className="text-center text-xs text-ink-400">
                Your details will only be used to contact you about this project.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: LocalProject
  onInterest: (p: LocalProject) => void
  onViewLayout: (url: string, title: string) => void
}

function LocalProjectCard({ project, onInterest, onViewLayout }: ProjectCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden border border-ink-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/8">
      {/* Project Image Banner with status & video trigger */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-900">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // fallback if image link fails
              ;(e.target as HTMLElement).style.display = 'none'
            }}
          />
        ) : null}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />

        {/* Featured badge */}
        {project.isFeatured && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gold-500/90 px-2.5 py-1 text-xs font-semibold text-ink-900 shadow-md">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </span>
        )}

        {/* YouTube video play button */}
        {project.youtubeUrl ? (
          <a
            href={project.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg transition-transform hover:scale-110 hover:bg-red-600"
            title="Watch Project Video on YouTube"
          >
            <Play className="h-5 w-5 fill-current pl-0.5" />
          </a>
        ) : null}

        {/* Status + Title on image */}
        <div className="absolute bottom-3 left-4 right-4">
          <Badge tone={STATUS_TONE[project.status]} dot>
            {STATUS_LABEL[project.status]}
          </Badge>
          <p className="mt-1 font-display text-xl leading-tight text-white group-hover:text-gold-300 transition-colors drop-shadow-sm">
            {project.title}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
          <span className="flex items-center gap-1.5 font-medium text-ink-700">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-500" />
            {project.location} ({project.district})
          </span>
          {project.acreage && (
            <span className="flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5 shrink-0 text-gold-500" />
              {project.acreage}
            </span>
          )}
          {project.startingPriceInr && (
            <span className="flex items-center gap-1.5 font-semibold text-ink-900">
              <IndianRupee className="h-3.5 w-3.5 shrink-0 text-gold-500" />
              From {formatCurrencyInr(project.startingPriceInr)}
            </span>
          )}
        </div>

        {project.shortDescription && (
          <p className="line-clamp-2 text-sm text-ink-500">{project.shortDescription}</p>
        )}

        {/* Layout Plan / Media Button */}
        {project.layoutImageUrl ? (
          <button
            type="button"
            onClick={() => onViewLayout(project.layoutImageUrl, `${project.title} — Master Layout`)}
            className="flex items-center justify-center gap-2 rounded border border-gold-500/40 bg-gold-50/60 px-3 py-2 text-xs font-semibold text-gold-800 transition-colors hover:bg-gold-100 hover:border-gold-500"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            View Master Layout / Site Plan
          </button>
        ) : null}

        {project.plotSizes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.plotSizes.map((size) => (
              <span
                key={size}
                className="rounded-full border border-ink-200 bg-cream-50 px-2.5 py-0.5 text-xs text-ink-600"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {project.amenities.length > 0 && (
          <ul className="space-y-1">
            {project.amenities.slice(0, 3).map((amenity) => (
              <li key={amenity} className="flex items-center gap-2 text-xs text-ink-500">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold-500" />
                {amenity}
              </li>
            ))}
            {project.amenities.length > 3 && (
              <li className="text-xs text-ink-400">+{project.amenities.length - 3} more</li>
            )}
          </ul>
        )}

        <div className="mt-auto pt-2">
          <Button
            onClick={() => onInterest(project)}
            disabled={project.status === 'sold-out'}
            className="w-full"
            size="md"
          >
            {project.status === 'sold-out' ? (
              'Sold Out'
            ) : (
              <>
                I'm Interested
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTER_DISTRICTS = ['All', 'Salem', 'Coimbatore', 'Tiruchirappalli (Trichy)', 'Namakkal', 'Dindigul'] as const

export default function LocalProjectsPage() {
  const allProjects = useLocalStore((s) => s.projects).filter((p) => p.isActive)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All')
  const [interested, setInterested] = useState<LocalProject | null>(null)
  const [layoutModal, setLayoutModal] = useState<{ url: string; title: string } | null>(null)

  const projects = allProjects.filter((p) => {
    if (selectedDistrict === 'All') return true
    return p.district === selectedDistrict
  })

  return (
    <>
      <Seo
        title="Our Projects"
        description="Explore Signature City's residential plot projects across Salem, Coimbatore, Trichy, Namakkal, and Dindigul."
      />

      <PageHeader
        eyebrow="Our Developments"
        title="Signature Projects"
        description="Every project is a complete, secure community — DTCP approved, clear title, and planned for modern living."
      />

      <Section tone="cream" className="pt-10 md:pt-14">
        <Container>
          {/* District Filter Tabs */}
          <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-ink-200 pb-4">
            <span className="mr-2 text-xs font-bold tracking-wider text-ink-500 uppercase">
              District:
            </span>
            {FILTER_DISTRICTS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDistrict(d)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedDistrict === d
                    ? 'bg-ink-900 text-cream-50 shadow-sm'
                    : 'bg-white text-ink-600 hover:bg-gold-50 hover:text-ink-900 border border-ink-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {projects.length === 0 ? (
            <EmptyState
              icon={Building2}
              title={selectedDistrict === 'All' ? 'Projects coming soon' : `No projects in ${selectedDistrict}`}
              description={
                selectedDistrict === 'All'
                  ? 'Our team is finalising the project listings. Check back shortly.'
                  : 'Try selecting another district or "All" to browse available projects.'
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <LocalProjectCard
                  key={project.id}
                  project={project}
                  onInterest={setInterested}
                  onViewLayout={(url, title) => setLayoutModal({ url, title })}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <CTABand />

      {/* Interest Enquiry Modal */}
      {interested && (
        <InterestModal project={interested} onClose={() => setInterested(null)} />
      )}

      {/* Master Layout Image Modal */}
      {layoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLayoutModal(null)
          }}
        >
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-lg border border-gold-500/30 bg-ink-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-800 bg-ink-900/90 px-5 py-3">
              <h3 className="font-display text-base text-cream-50">{layoutModal.title}</h3>
              <button
                type="button"
                onClick={() => setLayoutModal(null)}
                className="rounded-sm p-1.5 text-cream-50/70 hover:bg-ink-800 hover:text-cream-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[80vh] overflow-auto p-4">
              <img
                src={layoutModal.url}
                alt={layoutModal.title}
                className="h-auto w-full rounded object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
