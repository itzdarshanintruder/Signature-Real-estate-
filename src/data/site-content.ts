import type { Amenity, FaqItem, GrowthDatum, Stat, Testimonial, WhyChooseStep } from '@/types/content'

/**
 * SAMPLE CONTENT LAYER — Phase 4 static copy.
 * Every value here is placeholder marketing copy that marketing can replace.
 * In Phase 5 these resolve from Xano `site_content` instead.
 */

export const heroContent = {
  eyebrow: 'DTCP Approved · Near Sulur, Coimbatore',
  title: ['Own Your', 'Signature Address'],
  subtitle:
    'A gated community of 232 premium residential plots on 12 acres near Sulur, Coimbatore — designed for quiet luxury, long-term value, and a life well lived.',
  primaryCta: { label: 'Explore Projects', to: '/projects' },
  secondaryCta: { label: 'Book a Site Visit', to: '/contact' },
  trust: ['DTCP Approved', '100% Clear Title', 'Bank Loan Assistance'],
} as const

export const heroCard = {
  title: 'Phase One — Now Selling',
  details: ['Plot sizes 600 – 2035 sq. ft.', 'Gated community · 24×7 security'],
  footnote: 'DTCP Approved · RERA Compliant',
} as const

export const trustBar = [
  { icon: 'shield-check', title: 'DTCP Approved', description: 'Fully approved layout' },
  { icon: 'file-check', title: 'Clear Title', description: 'Verified, clean documents' },
  { icon: 'land-plot', title: 'Bank Loans', description: 'Assistance available' },
  { icon: 'building', title: 'RERA Compliant', description: 'Registered project' },
] as const

export const stats: Stat[] = [
  { value: 12, suffix: 'Acres', label: 'Premium Land Holding' },
  { value: 232, suffix: '', label: 'Residential Plots' },
  { value: 100, suffix: '%', label: 'Clear Title Guarantee' },
  { value: 24, suffix: '×7', label: 'Gated Security' },
]

export const locationHighlights = {
  eyebrow: 'Prime Location',
  title: 'Minutes from Everything That Matters',
  copy: 'Perfectly positioned near Sulur on Coimbatore’s fastest-growing corridor, Signature City keeps everyday essentials close and the airport even closer.',
  points: [
    { icon: 'route', title: 'Bus Stops', detail: '2 min drive' },
    { icon: 'building', title: 'Schools', detail: '2 – 5 min drive' },
    { icon: 'home', title: 'Hospitals', detail: '2 – 11 min drive' },
    { icon: 'gem', title: 'Colleges', detail: '4 – 11 min drive' },
    { icon: 'zap', title: 'Railway Stations', detail: '8 – 16 min drive' },
    { icon: 'map-pin', title: 'Coimbatore Airport', detail: '20 min drive' },
    { icon: 'land-plot', title: 'City Centre', detail: '20 – 22 min drive' },
  ],
}

export const premiumPlots = {
  eyebrow: 'Premium Blocks',
  title: 'Reserved for the Discerning',
  copy: 'A limited set of corner and garden-facing plots with wider avenues — designed for those who prefer the finer details.',
  features: [
    { icon: 'corner', title: 'Corner Plots', description: 'Double road access, more privacy' },
    { icon: 'trees', title: 'Garden-Facing', description: 'Facing the landscaped greens' },
    { icon: 'route', title: 'Wider Avenues', description: 'Spacious internal roads' },
  ],
}

export const investment = {
  eyebrow: 'Investment',
  title: 'Built for Long-Term Value',
  copy: 'Prime land near Sulur, clear title, and proven demand — the fundamentals of a sound investment in Coimbatore’s appreciating growth corridor.',
  points: [
    {
      title: 'Steady Appreciation',
      description: 'Land in growth corridors historically outpaces finished homes.',
    },
    {
      title: 'Complete Legal Clarity',
      description: 'DTCP approved layout with 100% clear title on every plot.',
    },
    {
      title: 'Infrastructure in Motion',
      description: 'Airport, ring roads, schools, and hospitals are expanding your way.',
    },
    {
      title: 'Growing Demand',
      description: 'Families and investors are moving toward spacious, secure communities.',
    },
  ],
}

/** Indicative land-value growth index — sample for the Investment chart. */
export const investmentGrowth: GrowthDatum[] = [
  { year: '2018', value: 100 },
  { year: '2019', value: 112 },
  { year: '2020', value: 121 },
  { year: '2021', value: 138 },
  { year: '2022', value: 155 },
  { year: '2023', value: 168 },
  { year: '2024', value: 186 },
  { year: '2025', value: 202 },
  { year: '2026', value: 218 },
]

export const whyChoose = {
  eyebrow: 'Why Signature City',
  title: 'Land Planned With a Rare Kind of Care',
  copy: 'For over two decades, our group has planned land with the same discipline architects bring to buildings — so every plot you buy feels considered, secure and quietly luxurious.',
  steps: [
    {
      icon: 'shield',
      title: 'Approved From Day One',
      description: 'Every layout is DTCP approved before a single plot is released.',
    },
    {
      icon: 'file-check',
      title: 'Clear Title, Verified',
      description: 'All documents are checked, registered and handed over with every plot.',
    },
    {
      icon: 'route',
      title: 'Planning Ahead of the City',
      description: 'Wide avenues, parks and utilities sized for the neighbourhood of tomorrow.',
    },
    {
      icon: 'users',
      title: 'With You Past the Sale',
      description: 'From registration to construction norms, our team stays by your side.',
    },
  ] satisfies WhyChooseStep[],
  trust: [
    { value: '20+', label: 'Years of Craft' },
    { value: '30+', label: 'Layouts Delivered' },
    { value: '232', label: 'Plot Owners' },
  ],
}

export const amenities: Amenity[] = [
  { icon: 'route', title: 'Black Top Roads', description: 'Wide 24 / 30 / 33 ft paved avenues.' },
  { icon: 'trees', title: 'Parks', description: 'Landscaped greens across the layout.' },
  { icon: 'home', title: 'Gated Community', description: 'A secure, exclusive enclave.' },
  { icon: 'shield-check', title: '24×7 Security', description: 'Round-the-clock manned security.' },
  { icon: 'droplets', title: 'Ground Water', description: 'Dedicated groundwater supply for every plot.' },
  { icon: 'building', title: 'Grand Arch', description: 'A landmark entrance to the community.' },
  { icon: 'shield', title: 'Compound Wall', description: 'Complete gated perimeter protection.' },
  { icon: 'lightbulb', title: 'Solar Street Lights', description: 'Solar-powered lighting on every avenue.' },
  { icon: 'trees', title: 'Avenue Trees', description: 'Tree-lined streets for shade and calm.' },
]

export const amenityPillars: { icon: string; title: string; description: string; points: string[] }[] = [
  {
    icon: 'shield',
    title: 'Security & Privacy',
    description: 'A gated enclave engineered so you can relax — every entrance, avenue and corner is watched over.',
    points: ['Grand arch entry', 'Manned 24×7 security', 'Full compound wall', 'Solar-lit avenues'],
  },
  {
    icon: 'route',
    title: 'Infrastructure',
    description: 'Roads and utilities built to last — sized for the neighbourhood of tomorrow.',
    points: ['Black top roads 24/30/33 ft', 'Groundwater supply', 'Underground drainage', 'Street-level amenities'],
  },
  {
    icon: 'trees',
    title: 'Greens & Living',
    description: 'Shared spaces that make everyday living feel effortless, right from day one.',
    points: ['Landscaped parks', 'Avenue trees on every street', 'Clean, planned streets', 'Quiet residential blocks'],
  },
]

export const testimonials: Testimonial[] = [
  {
    quote:
      'The layout, the approvals, the planning — everything spoke of care. We invested without a single hesitation.',
    name: 'R. Mehta',
    role: 'Investor',
  },
  {
    quote:
      'After living in a cramped apartment, buying a Signature plot felt like buying space to finally breathe.',
    name: 'S. Krishnan',
    role: 'Homeowner',
  },
  {
    quote:
      'Clear title, transparent pricing, and a team that actually answers the phone. That is rare these days.',
    name: 'A. Nair',
    role: 'NRI Investor',
  },
]

export const faqItems: FaqItem[] = [
  {
    question: 'Is Signature City DTCP approved?',
    answer:
      'Yes. Signature City is a DTCP approved residential layout near Sulur, Coimbatore. All approvals and layout documents are available for verification at the site office and during a scheduled visit.',
  },
  {
    question: 'Can I take a bank loan for a plot?',
    answer:
      'Absolutely. We assist with documentation for leading banks and housing finance companies. Loan eligibility is evaluated on a case-by-case basis.',
  },
  {
    question: 'What is the plot size range available?',
    answer:
      'Plots range from 600 sq. ft. to 2035 sq. ft. across our phases, including premium corner and garden-facing options in select blocks.',
  },
  {
    question: 'Do you offer flexible payment plans?',
    answer:
      'Yes, we offer structured payment plans tailored to investors and end-users. Speak with our sales team to understand what works best for you.',
  },
  {
    question: 'Can NRIs purchase plots here?',
    answer:
      'Yes. NRIs can purchase plots subject to applicable regulations. Our team assists with documentation and remote site visits via video call.',
  },
  {
    question: 'When can I start construction on my plot?',
    answer:
      'Construction guidelines are shared at the time of purchase. Plot holders can begin building as per the community’s approved norms.',
  },
]

export const about = {
  eyebrow: 'About Signature City',
  title: 'A Promise of Space, Trust & Craft',
  paragraphs: [
    'Signature City is a 12-acre, DTCP approved gated layout of 232 premium residential plots near Sulur, Coimbatore — minutes from the airport, schools, hospitals and colleges, yet quietly positioned away from the city’s noise.',
    'Every plot we release carries the same promise: DTCP approved layout, clean titles, honest pricing, and a community that is designed around the way families actually live.',
    'From the first survey to the final handing over, our team stays with you — because land is not just an asset. It is where stories are built.',
  ],
  values: [
    { icon: 'shield', title: 'Integrity', description: 'Clear titles and honest dealings, always.' },
    { icon: 'gem', title: 'Craft', description: 'Land planned with architectural care.' },
    { icon: 'home', title: 'Community', description: 'Neighbourhoods built around living.' },
  ],
}

export const journey = [
  { year: '2004', title: 'The Beginning', description: 'Our group lays its first approved layout.' },
  { year: '2012', title: 'Scaling', description: '30+ layouts delivered across the region.' },
  { year: '2020', title: 'Signature City', description: 'Our flagship premium community takes shape near Sulur.' },
  { year: 'Today', title: 'Growing', description: 'Phase One now selling · new blocks in planning.' },
]
