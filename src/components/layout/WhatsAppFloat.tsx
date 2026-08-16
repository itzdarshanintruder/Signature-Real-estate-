import { MessageCircle } from 'lucide-react'
import { SITE } from '@/constants/site'

export function WhatsAppFloat() {
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Hi Signature City, I would like to know more about your plots.',
  )}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-ink-900 shadow-gold transition-transform duration-300 hover:scale-105 md:right-7 md:bottom-7"
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 animate-[ping-soft_2.4s_ease-out_infinite] rounded-full bg-gold-500/50"
      />
      <MessageCircle className="h-6 w-6" aria-hidden />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-sm border border-gold-500/30 bg-ink-900 px-3 py-2 text-xs font-semibold text-cream-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Chat on WhatsApp
      </span>
    </a>
  )
}
