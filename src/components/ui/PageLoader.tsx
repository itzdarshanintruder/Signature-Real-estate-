export function PageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-ink-900" role="status" aria-label="Loading">
      <svg viewBox="0 0 64 64" className="h-14 w-14 animate-pulse" fill="none">
        <path d="M32 8 L52 28 L32 56 L12 28 Z" stroke="#2b8b8f" strokeWidth="3" />
        <path d="M32 20 L40 28 L32 44 L24 28 Z" stroke="#2b8b8f" strokeWidth="1.5" opacity="0.7" />
      </svg>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
