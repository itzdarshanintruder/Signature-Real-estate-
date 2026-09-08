import { IS_API_ENABLED } from '@/config/env'
import * as staticContent from '@/data/site-content'
import type { Amenity, FaqItem, GrowthDatum, Stat, Testimonial } from '@/types/content'
import { apiFetch, unwrap } from '@/services/api-client'

export interface SiteContent {
  heroContent: typeof staticContent.heroContent
  heroCard: typeof staticContent.heroCard
  trustBar: typeof staticContent.trustBar
  stats: Stat[]
  locationHighlights: typeof staticContent.locationHighlights
  premiumPlots: typeof staticContent.premiumPlots
  investment: typeof staticContent.investment
  investmentGrowth: GrowthDatum[]
  whyChoose: typeof staticContent.whyChoose
  amenities: Amenity[]
  amenityPillars: { icon: string; title: string; description: string; points: string[] }[]
  testimonials: Testimonial[]
  faqItems: FaqItem[]
  about: typeof staticContent.about
  journey: typeof staticContent.journey
}

/**
 * Defensive DTO mapper — every section falls back to the static layer when the
 * Xano `/site_content` payload omits it, so a partial CMS edit never blanks a page.
 */
export function mapSiteContent(raw: Partial<SiteContent>): SiteContent {
  return {
    heroContent: raw.heroContent ?? staticContent.heroContent,
    heroCard: raw.heroCard ?? staticContent.heroCard,
    trustBar: raw.trustBar ?? staticContent.trustBar,
    stats: raw.stats ?? staticContent.stats,
    locationHighlights: raw.locationHighlights ?? staticContent.locationHighlights,
    premiumPlots: raw.premiumPlots ?? staticContent.premiumPlots,
    investment: raw.investment ?? staticContent.investment,
    investmentGrowth: raw.investmentGrowth ?? staticContent.investmentGrowth,
    whyChoose: raw.whyChoose ?? staticContent.whyChoose,
    amenities: raw.amenities ?? staticContent.amenities,
    amenityPillars: raw.amenityPillars ?? staticContent.amenityPillars,
    testimonials: raw.testimonials ?? staticContent.testimonials,
    faqItems: raw.faqItems ?? staticContent.faqItems,
    about: raw.about ?? staticContent.about,
    journey: raw.journey ?? staticContent.journey,
  }
}

export async function fetchSiteContent(): Promise<SiteContent> {
  if (!IS_API_ENABLED) return staticContent
  const response = await apiFetch<{ data: Partial<SiteContent> }>('/site_content')
  return mapSiteContent(await unwrap(response))
}
