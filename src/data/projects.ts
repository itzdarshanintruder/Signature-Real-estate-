import type { Project } from '@/types/project'

/**
 * SAMPLE PROJECT DATA — Phase 4 static layer.
 * In Phase 5 these resolve from the Xano `projects` table via `services/projects.api.ts`.
 * Swap in real imagery by adding `src` to each project's image assets.
 */

export const projects: Project[] = [
  {
    id: 'p1',
    slug: 'signature-city-sulur',
    title: 'Signature City — Sulur',
    location: 'Near Sulur, Coimbatore',
    district: 'Sulur, Coimbatore',
    status: 'available',
    plotSizes: ['20×30', '24×40', '30×40', '30×50'],
    startingPriceInr: 9_60_000,
    acreage: '12 Acres',
    tagline: '232 premium plots, minutes from the airport',
    description:
      'The flagship release of Signature City — a 12-acre, DTCP approved gated enclave of 232 premium residential plots near Sulur, with black top roads, parks and 24×7 security.',
    shortDescription:
      'The flagship gated enclave near Sulur — 12 acres, black top roads, parks and 24×7 security.',
    overview: [
      'Signature City is a 12-acre, DTCP approved gated community of 232 premium residential plots near Sulur, Coimbatore. Wide black top roads (24, 30 and 33 ft), shaded avenue trees and landscaped parks wrap a layout that is planned around people, not just parcels.',
      'Every plot enjoys a clear title, dedicated groundwater, solar-lit avenues and round-the-clock security behind a full compound wall and grand arch. The airport is 20 minutes away, while schools, hospitals and colleges sit within a 2 to 11 minute drive.',
    ],
    features: [
      'DTCP approved · 232 premium plots',
      '12-acre gated community with 24×7 security',
      'Black top roads 24 / 30 / 33 ft',
      'Grand arch + full compound wall',
      'Solar street lights on every avenue',
      'Ground water + underground drainage',
    ],
    amenities: ['Gated Community', '24×7 Security', 'Parks', 'Avenue Trees', 'Solar Street Lights'],
    images: [
      { alt: 'Signature City master plan near Sulur', caption: 'Layout overview' },
      { alt: 'Avenue view of Signature City near Sulur', caption: 'Avenue view' },
    ],
    gallery: [
      { alt: 'Signature City master plan', caption: 'Master layout' },
      { alt: 'Avenue view of Signature City', caption: 'The avenues' },
      { alt: 'Signature City grand arch', caption: 'Grand arch' },
      { alt: 'Landscaped park within Signature City', caption: 'Central green' },
      { alt: 'Solar street lights along Signature City roads', caption: 'Solar-lit streets' },
      { alt: 'Kids play area in Signature City', caption: 'Play area' },
    ],
    masterPlan: { alt: 'Signature City master plan diagram', caption: 'Master plan' },
    availablePlots: [
      { id: 'p1-a', size: '20×30', dimensions: '600 sq. ft.', facing: 'East', priceInr: 9_60_000, status: 'available' },
      { id: 'p1-b', size: '24×40', dimensions: '960 sq. ft.', facing: 'North', priceInr: 15_36_000, status: 'available' },
      { id: 'p1-c', size: '30×40', dimensions: '1200 sq. ft.', facing: 'Garden-facing', priceInr: 19_20_000, status: 'reserved' },
      { id: 'p1-d', size: '30×40', dimensions: '1200 sq. ft.', facing: 'West', priceInr: 19_20_000, status: 'available' },
      { id: 'p1-e', size: '30×50', dimensions: '1500 sq. ft.', facing: 'Corner', priceInr: 24_00_000, status: 'available' },
    ],
    pricing: [
      { size: '20×30', dimensions: '600 sq. ft.', startPriceInr: 9_60_000 },
      { size: '24×40', dimensions: '960 sq. ft.', startPriceInr: 15_36_000 },
      { size: '30×40', dimensions: '1200 sq. ft.', startPriceInr: 19_20_000, note: 'Most popular' },
      { size: '30×50', dimensions: '1500 sq. ft.', startPriceInr: 24_00_000 },
    ],
    milestones: [
      { phase: 'Completed', title: 'Layout approval', description: 'DTCP approval secured and layout registered.' },
      { phase: 'Completed', title: 'Internal roads', description: 'Black top avenue formation complete.' },
      { phase: 'In progress', title: 'Parks & arch', description: 'Landscaping and grand arch underway.' },
      { phase: 'Upcoming', title: 'Handover', description: 'Final amenities ready for resident families.' },
    ],
    investmentBenefits: [
      'Clear, DTCP-approved title on every plot',
      'Steady appreciation in Coimbatore’s growth corridor',
      'Ready infrastructure — black top roads, water and drainage',
      'Bank loan eligible with minimal paperwork',
    ],
    nearbyPlaces: [
      { name: 'Sulur Bus Stop', category: 'Transit', distance: '2 min' },
      { name: 'Vidya Vikas Matric Hr Sec School', category: 'School', distance: '3 min' },
      { name: 'Suguna Vidyalaya Matric Hr Sec School', category: 'School', distance: '4 min' },
      { name: 'Sulur Government Hospital', category: 'Hospital', distance: '5 min' },
      { name: 'Hindusthan College of Engineering', category: 'School', distance: '8 min' },
      { name: 'Coimbatore International Airport', category: 'Transit', distance: '20 min' },
    ],
    faq: [
      {
        question: 'Is Signature City DTCP approved?',
        answer: 'Yes — the complete 12-acre layout is DTCP approved, and every plot carries a clear title with individual sale deeds.',
      },
      {
        question: 'Can I get a home loan for a plot here?',
        answer: 'Absolutely. Plots are bank-loan eligible, and our team can connect you with partner lenders for a quick pre-approval.',
      },
      {
        question: 'What are the internal amenities?',
        answer: 'A gated layout with 24×7 security, grand arch, compound wall, black top roads, parks, solar street lights, avenue trees and groundwater.',
      },
      {
        question: 'When can construction begin?',
        answer: 'Immediately after registration and approval of your building plan — most owners break ground within 90 days of purchase.',
      },
    ],
    isFeatured: true,
  },
  {
    id: 'p2',
    slug: 'the-golden-grove',
    title: 'The Golden Grove',
    location: 'Premium Block A · Near Sulur',
    district: 'Premium Zone',
    status: 'premium',
    plotSizes: ['30×40', '30×50'],
    startingPriceInr: 21_00_000,
    acreage: '2.2 Acres',
    tagline: 'Garden-facing, reserved',
    description:
      'Our most intimate block — a limited set of garden-facing and corner plots where every home looks out onto greens, not neighbours.',
    shortDescription:
      'A limited set of garden-facing and corner plots, each opening onto greens.',
    overview: [
      'The Golden Grove is our most intimate block — a limited release of garden-facing and corner plots where privacy is designed in. Every home looks out onto greens rather than neighbours, and the extended setbacks give your architect more to work with.',
      'Set beside the estate parks and ringed by mature avenue trees, this is the block for those who want fewer homes and more horizon.',
    ],
    features: [
      'Limited garden-facing plots',
      'Corner plots with double access',
      'Extended setbacks for homes',
      'Privileged access to parks',
    ],
    amenities: ['Landscaped Parks', '24×7 Security', 'Gated Community'],
    images: [{ alt: 'The Golden Grove premium block', caption: 'Premium block' }],
    gallery: [
      { alt: 'The Golden Grove garden-facing plots', caption: 'Garden frontage' },
      { alt: 'Corner plot with double access', caption: 'Corner plots' },
      { alt: 'Parks beside The Golden Grove', caption: 'Parks' },
      { alt: 'Mature avenue trees around the block', caption: 'Avenue trees' },
    ],
    masterPlan: { alt: 'The Golden Grove block plan', caption: 'Block plan — The Golden Grove' },
    availablePlots: [
      { id: 'p2-a', size: '30×40', dimensions: '1200 sq. ft.', facing: 'Garden-facing', priceInr: 22_00_000, status: 'available' },
      { id: 'p2-b', size: '30×40', dimensions: '1200 sq. ft.', facing: 'East', priceInr: 21_00_000, status: 'reserved' },
      { id: 'p2-c', size: '30×50', dimensions: '1500 sq. ft.', facing: 'Corner', priceInr: 27_00_000, status: 'available' },
      { id: 'p2-d', size: '30×50', dimensions: '1500 sq. ft.', facing: 'Garden-facing', priceInr: 28_00_000, status: 'sold' },
    ],
    pricing: [
      { size: '30×40', dimensions: '1200 sq. ft.', startPriceInr: 21_00_000 },
      { size: '30×50', dimensions: '1500 sq. ft.', startPriceInr: 27_00_000, note: 'Corner + garden' },
    ],
    milestones: [
      { phase: 'Completed', title: 'Approvals', description: 'Block approval and plot layout finalised.' },
      { phase: 'In progress', title: 'Landscaping', description: 'Green belts and garden frontages underway.' },
      { phase: 'Upcoming', title: 'Parks access', description: 'Residents gain privileged park access.' },
    ],
    investmentBenefits: [
      'Rare, limited-supply garden-facing plots',
      'Highest-value plots in Signature City',
      'Strong resale demand for green frontage',
      'Clear DTCP-approved title',
    ],
    nearbyPlaces: [
      { name: 'Vidya Vikas Matric Hr Sec School', category: 'School', distance: '3 min' },
      { name: 'Sulur Government Hospital', category: 'Hospital', distance: '5 min' },
      { name: 'Sulur Daily Market', category: 'Shopping', distance: '4 min' },
      { name: 'Sulur Railway Station', category: 'Transit', distance: '10 min' },
      { name: 'Kumaraguru College of Technology', category: 'School', distance: '12 min' },
    ],
    faq: [
      {
        question: 'Why is The Golden Grove priced higher?',
        answer: 'Garden-facing and corner plots are the most scarce — and the most desired — layouts in the estate, with premium frontage and greater privacy.',
      },
      {
        question: 'How many plots are in the block?',
        answer: 'The block is intentionally small — under 40 plots — to keep the community intimate and the landscaping generous.',
      },
      {
        question: 'Are the plots bank-loan eligible?',
        answer: 'Yes, every plot in The Golden Grove is DTCP approved and eligible for home loans.',
      },
    ],
    isFeatured: true,
  },
  {
    id: 'p3',
    slug: 'heritage-avenues',
    title: 'Heritage Avenues',
    location: 'Avenue Block B · Near Sulur',
    district: 'Northern Belt',
    status: 'launching',
    plotSizes: ['20×30', '24×40'],
    startingPriceInr: 9_60_000,
    acreage: '3.1 Acres',
    tagline: 'Launching soon',
    description:
      'A tree-lined extension to the Signature community, designed in the same spirit — calm, secure and thoughtfully planned.',
    shortDescription:
      'A tree-lined extension of the community — early-bird pricing now open.',
    overview: [
      'Heritage Avenues extends the Signature spirit north — a tree-lined layout of calm streets where a park sits within a few steps of every home. The design carries the same discipline as Phase One: black top roads, clean utilities and a secure perimeter.',
      'Launch pricing rewards early registrations, making this one of the most accessible entries into Signature City.',
    ],
    features: [
      'Tree-lined avenues',
      'Perimeter landscaping',
      'Community parks every 4 streets',
      'Early-bird pricing',
    ],
    amenities: ['Landscaped Parks', 'Solar Street Lights', 'Avenue Trees'],
    images: [{ alt: 'Heritage Avenues upcoming phase', caption: 'Launching phase' }],
    gallery: [
      { alt: 'Heritage Avenues tree-lined street', caption: 'Avenue view' },
      { alt: 'Perimeter landscaping of Heritage Avenues', caption: 'Perimeter' },
      { alt: 'Community park concept', caption: 'Park concept' },
    ],
    masterPlan: { alt: 'Heritage Avenues master plan', caption: 'Master plan — Heritage Avenues' },
    availablePlots: [
      { id: 'p3-a', size: '20×30', dimensions: '600 sq. ft.', facing: 'East', priceInr: 9_60_000, status: 'available' },
      { id: 'p3-b', size: '24×40', dimensions: '960 sq. ft.', facing: 'North', priceInr: 15_36_000, status: 'available' },
      { id: 'p3-c', size: '20×30', dimensions: '600 sq. ft.', facing: 'Garden-facing', priceInr: 10_20_000, status: 'reserved' },
    ],
    pricing: [
      { size: '20×30', dimensions: '600 sq. ft.', startPriceInr: 9_60_000, note: 'Launch price' },
      { size: '24×40', dimensions: '960 sq. ft.', startPriceInr: 15_36_000, note: 'Launch price' },
    ],
    milestones: [
      { phase: 'Completed', title: 'Approval', description: 'DTCP approval secured for the layout.' },
      { phase: 'In progress', title: 'Pre-sales', description: 'Early registrations open with launch pricing.' },
      { phase: 'Upcoming', title: 'Roads & services', description: 'Avenue formation and utilities to begin.' },
    ],
    investmentBenefits: [
      'Lowest entry price into Signature City',
      'Launch pricing with early-bird benefits',
      'Same DTCP-approved clear-title standard',
      'Positioned on the Sulur growth axis',
    ],
    nearbyPlaces: [
      { name: 'Sulur Bus Stop', category: 'Transit', distance: '2 min' },
      { name: 'Suguna Vidyalaya Matric Hr Sec School', category: 'School', distance: '4 min' },
      { name: 'Sulur Daily Market', category: 'Shopping', distance: '4 min' },
      { name: 'Hindusthan College of Engineering', category: 'School', distance: '8 min' },
      { name: 'Coimbatore International Airport', category: 'Transit', distance: '20 min' },
    ],
    faq: [
      {
        question: 'When does Heritage Avenues launch?',
        answer: 'Pre-sales are open now at launch pricing. The formal launch event is scheduled within the next quarter.',
      },
      {
        question: 'What does early-bird pricing include?',
        answer: 'Early registrations lock the base launch price and get first pick of garden-facing plots.',
      },
      {
        question: 'Is the layout approved yet?',
        answer: 'Yes — the full layout is DTCP approved before any plot is offered for sale.',
      },
    ],
    isFeatured: false,
  },
  {
    id: 'p4',
    slug: 'crown-meadows',
    title: 'Crown Meadows',
    location: 'Green Belt Block · Near Sulur',
    district: 'Green Zone',
    status: 'available',
    plotSizes: ['24×40', '30×40'],
    startingPriceInr: 15_36_000,
    acreage: '2.6 Acres',
    tagline: 'Open skies, open spaces',
    description:
      'Spacious plots facing the community greens — ideal for those who want generous setbacks and open views.',
    shortDescription:
      'Green-facing plots with wide 30 ft roads and open views.',
    overview: [
      'Crown Meadows sits on the sunnier edge of the layout — open skies, wide 30 ft internal roads and plots that face the community greens rather than the street.',
      'The block trades intimacy for space: generous setbacks, low density and uninterrupted views of the landscaped park at its heart.',
    ],
    features: [
      'Green-facing plots',
      'Wide 30 ft internal roads',
      'Proximity to parks',
    ],
    amenities: ['Landscaped Parks', '24×7 Security', 'Gated Community'],
    images: [{ alt: 'Crown Meadows open plots', caption: 'Open plots' }],
    gallery: [
      { alt: 'Crown Meadows green-facing plots', caption: 'Green frontage' },
      { alt: 'Wide 30 ft internal road', caption: 'Wide roads' },
      { alt: 'Central park of Crown Meadows', caption: 'Central park' },
    ],
    masterPlan: { alt: 'Crown Meadows master plan', caption: 'Master plan — Crown Meadows' },
    availablePlots: [
      { id: 'p4-a', size: '24×40', dimensions: '960 sq. ft.', facing: 'Green-facing', priceInr: 16_50_000, status: 'available' },
      { id: 'p4-b', size: '30×40', dimensions: '1200 sq. ft.', facing: 'East', priceInr: 20_50_000, status: 'available' },
      { id: 'p4-c', size: '30×40', dimensions: '1200 sq. ft.', facing: 'Green-facing', priceInr: 21_50_000, status: 'reserved' },
      { id: 'p4-d', size: '24×40', dimensions: '960 sq. ft.', facing: 'North', priceInr: 16_00_000, status: 'sold' },
    ],
    pricing: [
      { size: '24×40', dimensions: '960 sq. ft.', startPriceInr: 16_00_000 },
      { size: '30×40', dimensions: '1200 sq. ft.', startPriceInr: 20_50_000, note: 'Green-facing +' },
    ],
    milestones: [
      { phase: 'Completed', title: 'Layout approval', description: 'DTCP approval and registration complete.' },
      { phase: 'In progress', title: 'Central park', description: 'Landscaping the central green underway.' },
      { phase: 'Upcoming', title: 'Parks link', description: 'Connecting service road to the parks.' },
    ],
    investmentBenefits: [
      'Open, green-facing plots with clear title',
      'Low density — larger green reserves',
      'Wide roads suited to generous home designs',
      'Bank loan eligible',
    ],
    nearbyPlaces: [
      { name: 'Sulur Daily Market', category: 'Shopping', distance: '4 min' },
      { name: 'Vidya Vikas Matric Hr Sec School', category: 'School', distance: '3 min' },
      { name: 'Sulur Government Hospital', category: 'Hospital', distance: '5 min' },
      { name: 'Sulur Railway Station', category: 'Transit', distance: '10 min' },
      { name: 'KG Hospital, Coimbatore', category: 'Hospital', distance: '11 min' },
    ],
    faq: [
      {
        question: 'What makes Crown Meadows different?',
        answer: 'Its green-facing orientation and wide roads — a lower-density block built around a central landscaped park.',
      },
      {
        question: 'Are plots available immediately?',
        answer: 'Yes, a limited number of green-facing and standard plots are available now with clear titles.',
      },
      {
        question: 'Can I book a site visit?',
        answer: 'Certainly — book a site visit and we’ll walk you through the park and available frontages.',
      },
    ],
    isFeatured: true,
  },
  {
    id: 'p5',
    slug: 'ivory-courts',
    title: 'Ivory Courts',
    location: 'South Block · Near Sulur',
    district: 'Established',
    status: 'sold-out',
    plotSizes: ['20×30'],
    startingPriceInr: 12_50_000,
    acreage: '1.6 Acres',
    tagline: 'A chapter completed',
    description:
      'Our first completed block — sold out, with families already building their homes and a vibrant community taking root.',
    shortDescription:
      'Our first completed block — sold out, with homes already rising.',
    overview: [
      'Ivory Courts is Signature City’s first completed chapter — fully sold, with families already building and a vibrant community taking root. Its streets are a living proof of concept for everything the estate promises.',
      'Occasionally a resale plot appears here; register your interest and we’ll let you know first.',
    ],
    features: ['Fully sold', 'Residents building homes', 'Active community'],
    amenities: ['Compound Wall', 'Solar Street Lights', 'Avenue Trees'],
    images: [{ alt: 'Ivory Courts established community', caption: 'Established block' }],
    gallery: [
      { alt: 'Ivory Courts homes under construction', caption: 'Homes rising' },
      { alt: 'Ivory Courts streetscape', caption: 'Streetscape' },
    ],
    masterPlan: { alt: 'Ivory Courts master plan', caption: 'Master plan — Ivory Courts' },
    availablePlots: [
      { id: 'p5-a', size: '20×30', dimensions: '600 sq. ft.', facing: 'East', priceInr: 12_50_000, status: 'sold' },
      { id: 'p5-b', size: '20×30', dimensions: '600 sq. ft.', facing: 'West', priceInr: 12_50_000, status: 'sold' },
    ],
    pricing: [{ size: '20×30', dimensions: '600 sq. ft.', startPriceInr: 12_50_000, note: 'Resale on request' }],
    milestones: [
      { phase: 'Completed', title: 'Full sale', description: 'All plots sold within 14 months of launch.' },
      { phase: 'Completed', title: 'Construction', description: 'Residents building homes across the block.' },
      { phase: 'Ongoing', title: 'Community', description: 'Active residents’ association and events.' },
    ],
    investmentBenefits: [
      'Proven demand — sold out at premium',
      'Resale value appreciation demonstrated',
      'Active, settled community',
      'Ideal for investors seeking resale stock',
    ],
    nearbyPlaces: [
      { name: 'Sulur Bus Stop', category: 'Transit', distance: '2 min' },
      { name: 'Suguna Vidyalaya Matric Hr Sec School', category: 'School', distance: '4 min' },
      { name: 'Sulur Daily Market', category: 'Shopping', distance: '4 min' },
      { name: 'Coimbatore Junction', category: 'Transit', distance: '16 min' },
    ],
    faq: [
      {
        question: 'Are there any plots left in Ivory Courts?',
        answer: 'The block is fully sold. We occasionally see resale plots — join the interest list to hear about them first.',
      },
      {
        question: 'Can you help find a resale plot?',
        answer: 'Yes — register your interest and our team will connect you with verified resale listings when they appear.',
      },
    ],
    isFeatured: false,
  },
  {
    id: 'p6',
    slug: 'the-estate-block',
    title: 'The Estate Block',
    location: 'Premium Block B · Near Sulur',
    district: 'Premium Zone',
    status: 'premium',
    plotSizes: ['35×50', '40×50'],
    startingPriceInr: 28_00_000,
    acreage: '2.1 Acres',
    tagline: 'For those who build legacies',
    description:
      'Our largest plots, in the most private corner of Signature City. An exclusive block for a select few addresses.',
    shortDescription:
      'Our largest plots in the most private corner of the estate.',
    overview: [
      'The Estate Block is the rarest offering in Signature City — our largest plots, set in the most private corner of the estate with a dedicated service road and exclusive park access.',
      'With 35×50 and 40×50 frontages, these addresses are designed for grand homes and lasting legacies — a deliberately small number of plots for a select few owners.',
    ],
    features: [
      'Largest available plots',
      'Private, quiet corner of the estate',
      'Dedicated service road',
      'Exclusive estate amenities',
    ],
    amenities: ['Gated Community', '24×7 Security', 'Landscaped Parks'],
    images: [{ alt: 'The Estate Block exclusive plots', caption: 'Exclusive block' }],
    gallery: [
      { alt: 'The Estate Block large frontage', caption: 'Grand frontages' },
      { alt: 'Private service road of the Estate Block', caption: 'Service road' },
      { alt: 'Estate parks', caption: 'Estate parks' },
    ],
    masterPlan: { alt: 'The Estate Block plan', caption: 'Block plan — The Estate Block' },
    availablePlots: [
      { id: 'p6-a', size: '35×50', dimensions: '1750 sq. ft.', facing: 'East', priceInr: 28_00_000, status: 'available' },
      { id: 'p6-b', size: '40×50', dimensions: '2000 sq. ft.', facing: 'North', priceInr: 32_00_000, status: 'available' },
      { id: 'p6-c', size: '40×50', dimensions: '2000 sq. ft.', facing: 'Corner', priceInr: 34_00_000, status: 'reserved' },
    ],
    pricing: [
      { size: '35×50', dimensions: '1750 sq. ft.', startPriceInr: 28_00_000 },
      { size: '40×50', dimensions: '2000 sq. ft.', startPriceInr: 32_00_000, note: 'Corner +' },
    ],
    milestones: [
      { phase: 'Completed', title: 'Approval', description: 'Exclusive block approved with service road.' },
      { phase: 'In progress', title: 'Service road', description: 'Dedicated service road complete.' },
      { phase: 'Upcoming', title: 'Estate parks', description: 'Reserved wing of the parks to open.' },
    ],
    investmentBenefits: [
      'Rare 2000 sq. ft. frontages',
      'Exclusive, low-density private block',
      'Dedicated service road access',
      'Positioned for highest long-term value',
    ],
    nearbyPlaces: [
      { name: 'Sulur Government Hospital', category: 'Hospital', distance: '5 min' },
      { name: 'Sulur Railway Station', category: 'Transit', distance: '10 min' },
      { name: 'KG Hospital, Coimbatore', category: 'Hospital', distance: '11 min' },
      { name: 'Coimbatore Junction', category: 'Transit', distance: '16 min' },
      { name: 'Brookefields Mall', category: 'Shopping', distance: '22 min' },
    ],
    faq: [
      {
        question: 'How many plots are in The Estate Block?',
        answer: 'Fewer than 20 — an intentionally exclusive release of the largest plots in Signature City.',
      },
      {
        question: 'What is the minimum build size?',
        answer: 'There’s no enforced minimum; the frontages are designed for grand homes with generous setbacks.',
      },
      {
        question: 'Are these plots bank-loan eligible?',
        answer: 'Yes — each plot carries a clear DTCP-approved title and qualifies for bank finance.',
      },
    ],
    isFeatured: false,
  },
]
