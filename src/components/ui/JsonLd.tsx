import { useEffect, useRef } from 'react'

interface JsonLdProps {
  data: Record<string, unknown>
}

let uid = 0

/**
 * Injects a JSON-LD structured-data script into <head>, updated in place and
 * removed on unmount. Each instance owns a uniquely-keyed script element, so
 * route transitions (including overlapping AnimatePresence frames) can never
 * accumulate duplicate scripts.
 */
export function JsonLd({ data }: JsonLdProps) {
  const keyRef = useRef<string>('')
  if (!keyRef.current) {
    uid += 1
    keyRef.current = `jsonld-${uid}`
  }
  const serialized = JSON.stringify(data)

  useEffect(() => {
    const selector = `script[data-jsonld="${keyRef.current}"]`
    let script = document.head.querySelector<HTMLScriptElement>(selector)

    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-jsonld', keyRef.current)
      document.head.appendChild(script)
    }

    script.textContent = serialized
    return () => {
      script?.remove()
    }
  }, [serialized])

  return null
}
