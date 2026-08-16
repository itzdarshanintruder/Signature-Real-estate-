import { useEffect, useId, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { EASE } from '@/animations/motion'
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll'
import { cn } from '@/utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** Accessible name for the dialog. */
  label: string
  children: ReactNode
  className?: string
  closeOnBackdrop?: boolean
  showCloseButton?: boolean
}

/** Accessible modal — focus trap, ESC to close, scroll lock, backdrop close. */
export function Modal({
  open,
  onClose,
  label,
  children,
  className,
  closeOnBackdrop = true,
  showCloseButton = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close dialog"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE.brand }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 z-0 cursor-default bg-ink-950/90 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE.brand }}
            className={cn(
              'relative z-10 max-h-[90svh] w-full overflow-y-auto outline-none',
              className,
            )}
          >
            <div id={titleId} className="sr-only">
              {label}
            </div>
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute top-4 right-4 z-10 cursor-pointer rounded-sm border border-cream-50/20 p-2 text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
