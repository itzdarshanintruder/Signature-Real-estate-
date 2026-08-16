import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react'
import { Image } from '@/components/ui/Image'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/types/project'
import { formatCurrencyInr } from '@/utils/formatters'

const STATUS_LABEL: Record<Project['status'], string> = {
  available: 'Available',
  premium: 'Premium',
  launching: 'Launching Soon',
  'sold-out': 'Sold Out',
}

const STATUS_TONE: Record<Project['status'], 'gold' | 'green' | 'muted' | 'dark'> = {
  available: 'green',
  premium: 'gold',
  launching: 'muted',
  'sold-out': 'dark',
}

interface ProjectCardProps {
  project: Project
}

/** Premium project card — large image, quick highlights, hover lift and zoom. */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block h-full cursor-pointer"
    >
      <article className="flex h-full flex-col">
        <div className="relative overflow-hidden">
          <Image
           src={project.images?.[0]?.src || "https://picsum.photos/800/600"}
           alt={project.images?.[0]?.alt ?? project.title}
            aspect="aspect-[16/11]"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90"
          />
          <div className="absolute top-4 left-4">
            <Badge tone={STATUS_TONE[project.status]}>{STATUS_LABEL[project.status]}</Badge>
          </div>
          <span
            aria-hidden
            className="absolute top-4 right-4 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-cream-50/95 text-ink-900 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>

        <div className="flex flex-1 flex-col border border-t-0 border-ink-200 bg-cream-50 p-6 transition-colors duration-300 group-hover:border-gold-500/50">
          <p className="text-[0.65rem] font-bold tracking-[0.24em] text-gold-600 uppercase">
            {project.district}
          </p>
          <h3 className="mt-2 font-display text-2xl text-ink-900 transition-colors duration-300 group-hover:text-gold-700">
            {project.title}
          </h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-500">
            <MapPin className="h-4 w-4 text-gold-500" aria-hidden />
            {project.location}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-600 line-clamp-2">
            {project.shortDescription}
          </p>

          <div className="mt-5 grid grid-cols-3 divide-x divide-ink-900/10">
            <div className="pr-3">
              <p className="text-[0.6rem] font-bold tracking-[0.16em] text-ink-400 uppercase">
                Plots
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-800">
                {project.plotSizes.join(' · ')}
              </p>
            </div>
            <div className="px-3">
              <p className="text-[0.6rem] font-bold tracking-[0.16em] text-ink-400 uppercase">
                Land
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-800">{project.acreage}</p>
            </div>
            <div className="pl-3">
              <p className="text-[0.6rem] font-bold tracking-[0.16em] text-ink-400 uppercase">
                From
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-800">
                {project.startingPriceInr
                  ? formatCurrencyInr(project.startingPriceInr)
                  : 'On request'}
              </p>
            </div>
          </div>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-700">
            Explore Project
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </article>
    </Link>
  )
}
