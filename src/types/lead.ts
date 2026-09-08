export type LeadInterest = 'site-visit' | 'brochure' | 'invest' | 'general'

export interface Lead {
  name: string
  phone: string
  email?: string
  interest: LeadInterest
  projectSlug?: string
  message?: string
  consent: boolean
  /** Honeypot — must stay empty. */
  company?: string
}
