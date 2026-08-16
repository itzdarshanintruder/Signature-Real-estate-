import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { buttonStyles } from '@/components/ui/button-styles'

export default function NotFoundPage() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink-900 px-6 text-center text-cream-50">
      <Seo title="Page Not Found" />
      <div aria-hidden className="bg-arch-grid absolute inset-0" />
      <div aria-hidden className="bg-gold-glow absolute inset-0" />
      <div className="relative">
        <p className="font-display text-8xl text-gold-400 md:text-9xl">404</p>
        <h1 className="mt-4 font-display text-3xl text-cream-50 md:text-4xl">
          This Plot Doesn't Exist
        </h1>
        <p className="mx-auto mt-4 max-w-md text-cream-50/70">
          The page you're looking for may have moved, or never existed. Let's get you back to
          solid ground.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/" className={buttonStyles('primary', 'lg')}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Home
          </Link>
          <Link to="/projects" className={buttonStyles('outline', 'lg')}>
            Explore Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
