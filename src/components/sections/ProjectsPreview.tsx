import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { useProjects } from '@/hooks/use-content'

export function ProjectsPreview() {
  const { data: projects, isLoading } = useProjects()
  const featured = projects?.filter((project) => project.isFeatured).slice(0, 3) ?? []

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading
          eyebrow="Our Developments"
          title="Signature Projects"
          subtitle="A curated release of premium residential plots — each phase planned as a complete, secure community."
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : featured.map((project, index) => (
                <Reveal key={project.id} delay={index * 100} className="h-full">
                  <ProjectCard project={project} />
                </Reveal>
              ))}
        </div>

        <Reveal className="mt-14 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 font-semibold text-gold-700 underline-offset-8 transition-colors hover:text-gold-600 hover:underline"
          >
            View All Projects
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </Container>
    </Section>
  )
}
