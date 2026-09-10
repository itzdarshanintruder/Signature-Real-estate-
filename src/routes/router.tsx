import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { PageLoader } from '@/components/ui/PageLoader'
import { AdminRouteGuard } from '@/components/admin/AdminRouteGuard'

const HomePage = lazy(() => import('@/pages/home/HomePage'))
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage'))
const LocalProjectsPage = lazy(() => import('@/pages/projects/LocalProjectsPage'))
const ProjectDetailsPage = lazy(() => import('@/pages/projects/ProjectDetailsPage'))
const OmegaEstatesPage = lazy(() => import('@/pages/projects/omega-estates/OmegaEstatesPage'))
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
const AdminLocalProjectsPage = lazy(() => import('@/pages/admin/AdminLocalProjectsPage'))
const AdminProjectsPage = lazy(() => import('@/pages/admin/AdminProjectsPage'))
const ProjectEditorPage = lazy(() => import('@/pages/admin/ProjectEditorPage'))
const AdminLeadsPage = lazy(() => import('@/pages/admin/AdminLeadsPage'))
const OmegaAdminPage = lazy(() => import('@/pages/admin/omega/OmegaAdminPage'))
const OmegaPlotEditorPage = lazy(() => import('@/pages/admin/omega/OmegaPlotEditorPage'))
const ProjectPlotsAdminPage = lazy(() => import('@/pages/admin/ProjectPlotsAdminPage'))
const ProjectPlotEditorPage = lazy(() => import('@/pages/admin/ProjectPlotEditorPage'))


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
            <Route path="/our-projects" element={<LocalProjectsPage />} />
            <Route path="/projects/omega-estates" element={<OmegaEstatesPage />} />
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
          <Route
            path="/admin/local-projects"
            element={
              <AdminRouteGuard>
                <AdminLocalProjectsPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AdminRouteGuard>
                <AdminProjectsPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/projects/new"
            element={
              <AdminRouteGuard>
                <ProjectEditorPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/projects/:id/edit"
            element={
              <AdminRouteGuard>
                <ProjectEditorPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/projects/:projectId/plots"
            element={
              <AdminRouteGuard>
                <ProjectPlotsAdminPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/projects/:projectId/plots/new"
            element={
              <AdminRouteGuard>
                <ProjectPlotEditorPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/projects/:projectId/plots/:id/edit"
            element={
              <AdminRouteGuard>
                <ProjectPlotEditorPage />
              </AdminRouteGuard>
            }
          />

          <Route
            path="/admin/leads"
            element={
              <AdminRouteGuard>
                <AdminLeadsPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/omega"
            element={
              <AdminRouteGuard>
                <OmegaAdminPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/omega/new"
            element={
              <AdminRouteGuard>
                <OmegaPlotEditorPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/omega/:id/edit"
            element={
              <AdminRouteGuard>
                <OmegaPlotEditorPage />
              </AdminRouteGuard>
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}
