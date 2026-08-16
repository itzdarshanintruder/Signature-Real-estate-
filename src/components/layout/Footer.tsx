import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Linkedin, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { NAV_ITEMS, SITE } from '@/constants/site'

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: SITE.socials.instagram },
  { icon: Facebook, label: 'Facebook', href: SITE.socials.facebook },
  { icon: Youtube, label: 'YouTube', href: SITE.socials.youtube },
  { icon: Linkedin, label: 'LinkedIn', href: SITE.socials.linkedin },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-900 text-cream-50/70">
      <div className="hairline-gold" aria-hidden />
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl font-semibold tracking-[0.16em] text-cream-50">
              SIGNATURE <span className="text-gold-400">CITY</span>
            </p>
            <p className="mt-1 text-[0.65rem] tracking-[0.42em] text-gold-400 uppercase">
              Premium Residential Plots
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed">
              DTCP approved residential plots, planned with the care of an architect and
              the integrity of a promise kept.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-cream-50/15 text-cream-50/70 transition-colors duration-300 hover:border-gold-500 hover:text-gold-300"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <p className="text-xs font-bold tracking-[0.24em] text-gold-400 uppercase">Explore</p>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="transition-colors duration-300 hover:text-gold-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Projects */}
          <nav aria-label="Projects">
            <p className="text-xs font-bold tracking-[0.24em] text-gold-400 uppercase">Projects</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/projects/signature-city-phase-one" className="transition-colors hover:text-gold-300">
                  Phase One
                </Link>
              </li>
              <li>
                <Link to="/projects/the-golden-grove" className="transition-colors hover:text-gold-300">
                  The Golden Grove
                </Link>
              </li>
              <li>
                <Link to="/projects/heritage-avenues" className="transition-colors hover:text-gold-300">
                  Heritage Avenues
                </Link>
              </li>
              <li>
                <Link to="/projects/crown-meadows" className="transition-colors hover:text-gold-300">
                  Crown Meadows
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold tracking-[0.24em] text-gold-400 uppercase">Contact</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                <span>
                  {SITE.address[0]}
                  <br />
                  {SITE.address[1]}
                </span>
              </li>
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-3 transition-colors hover:text-gold-300"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 transition-colors hover:text-gold-300"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                {SITE.hours}
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-cream-50/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream-50/50 md:flex-row">
          <p>© {year} Signature City. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="transition-colors hover:text-gold-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-gold-300">
              Terms of Use
            </Link>
          </div>
        </Container>
      </div>
      <p className="border-t border-cream-50/5 px-4 py-4 text-center text-[0.65rem] leading-relaxed text-cream-50/35">
        RERA Disclaimer: This website is for informational purposes only and does not constitute an
        offer or contract. Images are indicative. Please verify all details and approvals with our
        sales team before purchase.
      </p>
    </footer>
  )
}
