export interface ImageAsset {
  /** Cloudinary / remote URL. Omit to render the branded placeholder. */
  src?: string
  alt: string
  caption?: string
}

export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export interface Amenity {
  title: string
  description: string
  icon: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface GrowthDatum {
  year: string
  /** Relative growth index — 100 = baseline year. */
  value: number
}

export interface WhyChooseStep {
  icon: string
  title: string
  description: string
}
