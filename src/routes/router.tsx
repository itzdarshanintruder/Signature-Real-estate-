import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { PageLoader } from '@/components/ui/PageLoader'
import { AdminRouteGuard } from '@/components/admin/AdminRouteGuard'

const HomePage = lazy(() => import('@/pages/home/HomePage'))
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage'))
const ProjectDetailsPage = lazy(() => import('@/pages/projects/ProjectDetailsPage'))
const GalleryPage = lazy(() => import('@/pages/gallery/GalleryPage'))
const AmenitiesPage = lazy(() => import('@/pages/amenities/AmenitiesPage'))
const AboutPage = lazy(() => import('@/pages/about/AboutPage'))
const ContactPage = lazy(() => import('@/pages/contact/ContactPage'))
const FaqPage = lazy(() => import('@/pages/faq/FaqPage'))
const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'))
const TermsPage = lazy(() => import('@/pages/legal/TermsPage'))
const NotFoundPage = lazy(() => import('@/pages/not-found/NotFoundPage'))
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'))
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminPlotsPage = lazy(() => import('@/pages/admin/AdminPlotsPage'))
const PlotEditorPage = lazy(() => import('@/pages/admin/PlotEditorPage'))
const GalleryManagerPage = lazy(() => import('@/pages/admin/GalleryManagerPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/amenities" element={<AmenitiesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/plots"
            element={
              <AdminRouteGuard>
                <AdminPlotsPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/plots/new"
            element={
              <AdminRouteGuard>
                <PlotEditorPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/plots/:plotId/edit"
            element={
              <AdminRouteGuard>
                <PlotEditorPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/plots/:plotId/gallery"
            element={
              <AdminRouteGuard>
                <GalleryManagerPage />
              </AdminRouteGuard>
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}
