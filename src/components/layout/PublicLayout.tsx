import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { PageTransition } from '@/animations/page-transition'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SkipLink } from '@/components/layout/SkipLink'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { Toaster } from '@/components/ui/Toaster'

export function PublicLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toaster />
    </div>
  )
}
