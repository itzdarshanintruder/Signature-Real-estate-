import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowLeft, LayoutDashboard, LogOut, MapPinned } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/utils/cn'

const adminNav = [
  { label: 'Contacts', to: '/admin', icon: LayoutDashboard },
  { label: 'Plots', to: '/admin/plots', icon: MapPinned },
]

/** Slim dark admin bar — section nav, session email, sign out. */
export function AdminHeader() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="border-b border-gold-500/20 bg-ink-900">
      <Container className="flex h-16 flex-wrap items-center gap-x-6 gap-y-2">
        <p className="font-display text-sm tracking-[0.3em] text-gold-400 uppercase">
          Signature City · Admin
        </p>

        <nav aria-label="Admin sections" className="flex items-center gap-1">
          {adminNav.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'text-gold-400' : 'text-cream-50/70 hover:text-cream-50',
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {user?.email ? (
            <span className="hidden text-sm text-cream-50/60 sm:inline">{user.email}</span>
          ) : null}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cream-50/70 transition-colors hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to site
          </Link>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/admin/login', { replace: true })
            }}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-cream-50/70 transition-colors hover:text-gold-400"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </Container>
    </header>
  )
}
