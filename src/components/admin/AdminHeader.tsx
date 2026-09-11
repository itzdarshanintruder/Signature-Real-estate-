import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowLeft, Inbox, LayoutDashboard, LogOut, Building2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/utils/cn'

const adminNav = [
  { label: 'Contacts', to: '/admin', icon: LayoutDashboard },
  { label: 'Projects', to: '/admin/projects', icon: Building2 },
  { label: 'Leads', to: '/admin/leads', icon: Inbox },
]

/** Slim dark admin bar — section nav, session email, sign out. */
export function AdminHeader() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="border-b border-gold-500/20 bg-ink-900">
      {/* Row 1: logo + actions */}
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link to="/admin" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo.jpg"
            alt="VIP Housing and Properties Logo"
            className="h-8 w-8 rounded-full object-cover border border-gold-500/40 bg-white"
          />
          <p className="font-display text-sm tracking-[0.2em] text-gold-400 uppercase">
            VIP Housing · Admin
          </p>
        </Link>

        <div className="flex items-center gap-3">
          {user?.email ? (
            <span className="hidden text-sm text-cream-50/60 sm:inline">{user.email}</span>
          ) : null}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cream-50/70 transition-colors hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Back to site</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/admin/login', { replace: true })
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-cream-50/70 transition-colors hover:text-gold-400"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </Container>

      {/* Row 2: section nav tabs */}
      <div className="border-t border-gold-500/10">
        <Container>
          <nav aria-label="Admin sections" className="flex items-center gap-1 overflow-x-auto">
            {adminNav.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 whitespace-nowrap px-3 py-3 text-sm font-semibold transition-colors border-b-2',
                    isActive
                      ? 'border-gold-400 text-gold-400'
                      : 'border-transparent text-cream-50/70 hover:text-cream-50',
                  )
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
        </Container>
      </div>
    </header>
  )
}
