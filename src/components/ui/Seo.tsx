import { useEffect } from 'react'

const APP_NAME = 'Signature City'
/** TODO: replace with the production domain before launch. */
const SITE_URL = 'https://www.signaturecity.in'
const DEFAULT_IMAGE = '/og-default.png'
const DEFAULT_DESCRIPTION =
  'Signature City — premium DTCP approved residential plots in a gated community. Clear titles, bank loans, and thoughtful planning.'

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attribute, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

interface SeoProps {
  title: string
  description?: string
  /** Canonical path, e.g. `/projects`. Defaults to the current pathname. */
  path?: string
  image?: string
  type?: 'website' | 'article'
}

/**
 * Per-route SEO: title, description, canonical, Open Graph and Twitter cards.
 */
export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title === APP_NAME ? title : `${title} — ${APP_NAME}`
    const url = `${SITE_URL}${path ?? window.location.pathname}`
    const imageUrl = `${SITE_URL}${image}`

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:image:width', '1200')
    upsertMeta('property', 'og:image:height', '630')
    upsertMeta('property', 'og:site_name', APP_NAME)
    upsertMeta('property', 'og:locale', 'en_IN')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)
    upsertCanonical(url)
  }, [title, description, path, image, type])

  return null
}
