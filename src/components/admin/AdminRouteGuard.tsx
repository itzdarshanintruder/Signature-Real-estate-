import { useEffect, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { PageLoader } from '@/components/ui/PageLoader'
import { Toaster } from '@/components/ui/Toaster'
import { useAuthStore } from '@/store/auth-store'

/**
 * Protects the admin dashboard. Validates the in-memory session once on
 * mount, shows a loader while checking, and redirects to `/admin/login`
 * when there is no valid session. Also mounts the toast surface so admin
 * pages can surface success/error notifications.
 */
export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status)
  const validateSession = useAuthStore((state) => state.validateSession)

  useEffect(() => {
    if (status === 'idle') {
      void validateSession()
    }
  }, [status, validateSession])

  if (status === 'idle' || status === 'checking') {
    return <PageLoader />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
