import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Mail, Phone, X } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { buttonStyles } from '@/components/ui/button-styles'
import { NAV_ITEMS, SITE } from '@/constants/site'
import { useUiStore } from '@/store/ui-store'
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll'
import { cn } from '@/utils/cn'

function Wordmark() {
  return (
    <Link
      to="/"
      aria-label={`${SITE.name} — home`}
      className="group flex items-center gap-3"
    >
      <img
        src="/logo.jpg"
        alt="VIP Housing and Properties Logo"
        className="h-10 w-10 rounded-full object-cover border border-gold-500/30 transition-transform duration-300 group-hover:scale-105"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-[0.12em] text-cream-50">
          VIP HOUSING
        </span>
        <span className="font-display text-[0.62rem] tracking-[0.25em] text-gold-400">
          &amp; PROPERTIES
        </span>
      </span>
    </Link>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const isNavOpen = useUiStore((state) => state.isNavOpen)
  const setNavOpen = useUiStore((state) => state.setNavOpen)
  const location = useLocation()

  useLockBodyScroll(isNavOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname, setNavOpen])

  useEffect(() => {
    if (!isNavOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isNavOpen, setNavOpen])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Slim top strip */}
        <div className="hidden border-b border-cream-50/10 bg-ink-950 text-cream-50/70 md:block">
          <Container className="flex h-9 items-center justify-between">
            <div className="flex items-center gap-7">
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold-300"
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden />
                {SITE.phone}
              </a>
              <a
                href="mailto:dtcppplotsale@gmail.com"
                className="hidden items-center gap-2 text-sm font-medium transition-colors hover:text-gold-300 lg:flex"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden />
                dtcppplotsale@gmail.com
              </a>
            </div>
            <p className="text-xs tracking-[0.22em] text-gold-400/90 uppercase">
              DTCP Approved · RERA Compliant
            </p>
          </Container>
        </div>


        {/* Main bar */}
        <div
          className={cn(
            'transition-all duration-300',
            scrolled
              ? 'border-b border-gold-500/20 bg-ink-900/90 backdrop-blur-md'
              : 'bg-gradient-to-b from-ink-950/80 to-transparent',
          )}
        >
          <Container className="flex h-16 items-center justify-between md:h-20">
            <Wordmark />

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-6">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'relative py-2 text-sm font-semibold tracking-[0.08em] uppercase transition-colors duration-300',
                          isActive
                            ? 'text-gold-400'
                            : 'text-cream-50/80 hover:text-cream-50',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {item.label}
                          <span
                            aria-hidden
                            className={cn(
                              'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold-400 transition-transform duration-300',
                              isActive ? 'scale-x-100' : 'scale-x-0',
                            )}
                          />
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className={buttonStyles('primary', 'sm', 'hidden sm:inline-flex')}
              >
                Enquire Now
              </Link>
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                aria-label="Open menu"
                aria-expanded={isNavOpen}
                className="cursor-pointer rounded-sm p-2 text-cream-50 transition-colors hover:text-gold-400 lg:hidden"
              >
                <Menu className="h-6 w-6" aria-hidden />
              </button>
            </div>
          </Container>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden',
          isNavOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!isNavOpen}
      >
        <div
          className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
          onClick={() => setNavOpen(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            'absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto border-l border-gold-500/20 bg-ink-900 p-6 transition-transform duration-300',
            isNavOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-sm tracking-[0.3em] text-gold-400">
              MENU
            </span>
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
              className="cursor-pointer rounded-sm p-2 text-cream-50 transition-colors hover:text-gold-400"
            >
              <X className="h-6 w-6" aria-hidden />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-10 flex flex-col gap-1">
            {NAV_ITEMS.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={{ transitionDelay: `${index * 40}ms` }}
                className={({ isActive }) =>
                  cn(
                    'font-display border-b border-cream-50/10 py-4 text-2xl transition-colors duration-300',
                    isActive ? 'text-gold-400' : 'text-cream-50 hover:text-gold-300',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-4 pt-10">
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-3 text-cream-50/80 transition-colors hover:text-gold-300"
            >
              <Phone className="h-5 w-5 text-gold-400" aria-hidden />
              <span className="text-sm font-semibold">{SITE.phone}</span>
            </a>
            <Link to="/contact" className={buttonStyles('primary', 'md', 'w-full')}>
              Book a Site Visit
            </Link>
          </div>
        </aside>
      </div>
    </>
  )
}
