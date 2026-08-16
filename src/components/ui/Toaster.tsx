import { CheckCircle2, XCircle, X } from 'lucide-react'
import { useUiStore } from '@/store/ui-store'

export function Toaster() {
  const toasts = useUiStore((state) => state.toasts)
  const dismissToast = useUiStore((state) => state.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-md items-center gap-3 border border-gold-500/30 bg-ink-900/95 px-4 py-3 text-cream-50 shadow-gold backdrop-blur animate-fade-up"
        >
          {toast.tone === 'success' ? (
            <CheckCircle2 aria-hidden className="h-5 w-5 shrink-0 text-gold-400" />
          ) : (
            <XCircle aria-hidden className="h-5 w-5 shrink-0 text-red-400" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="ml-auto cursor-pointer p-1 text-cream-50/60 transition-colors hover:text-cream-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
