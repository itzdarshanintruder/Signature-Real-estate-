import { useEffect, useState } from 'react'

/** React-ish wrapper around `window.matchMedia`. SSR-safe (defaults to the
 * `initial` value until the first effect runs). */
export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(initial)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const update = (event: MediaQueryListEvent | MediaQueryList) => setMatches(event.matches)
    setMatches(mediaQuery.matches)
    mediaQuery.addEventListener('change', update)
    return () => {
      mediaQuery.removeEventListener('change', update)
    }
  }, [query])

  return matches
}

/** True from the Tailwind `md` breakpoint (≥ 768px) upward. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)', false)
}
