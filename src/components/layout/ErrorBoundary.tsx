import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Signature City] Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center bg-cream-100 px-6 py-24 text-center">
          <p className="font-display text-2xl text-ink-900">Something went wrong</p>
          <p className="mt-3 max-w-md text-ink-500">
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 cursor-pointer rounded-sm bg-gold-500 px-8 py-3 font-semibold text-ink-900 transition-colors hover:bg-gold-400"
          >
            Reload page
          </button>
        </main>
      )
    }
    return this.props.children
  }
}
