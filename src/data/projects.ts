import type { Project } from '@/types/project'

/**
 * PROJECT DATA
 * District → Project mapping:
 *   Coimbatore  → Signature City
 *   Namakkal    → Hitech City
 *   Madurai     → Emerald City
 *   Trichy      → Up Town, Eden Garden
 */

export const projects: Project[] = [
  // ─── Coimbatore ────────────────────────────────────────────────────────────
  {
    id: 'p1',
    slug: 'signature-city',
    title: 'Signature City',
    location: 'Near Sulur, Coimbatore',
    district: 'Coimbatore',
    status: 'available',
    plotSizes: ['20×30', '24×40', '30×40', '30×50'],
    startingPriceInr: 9_60_000,
    acreage: '12 Acres',
    tagline: '232 premium plots, minutes from the airport',
    description:
      'The flagship release — a 12-acre, DTCP approved gated enclave of 232 premium residential plots near Sulur, with black top roads, parks and 24×7 security.',
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
      { src: '/projects/signature-city/entrance.jpg', alt: 'Signature City master plan near Sulur', caption: 'Layout overview' },
      { src: '/projects/signature-city/amenities.jpg', alt: 'Avenue view of Signature City near Sulur', caption: 'Avenue view' },
    ],
    gallery: [
      { src: '/projects/signature-city/master-plan.jpg', alt: 'Signature City master plan', caption: 'Master layout' },
      { src: '/projects/signature-city/amenities.jpg', alt: 'Avenue view of Signature City', caption: 'The avenues' },
      { src: '/projects/signature-city/location-mapping.jpg', alt: 'Signature City grand arch', caption: 'Grand arch' },
      { src: '/projects/signature-city/route-map.jpg', alt: 'Landscaped park within Signature City', caption: 'Central green' },
      { src: '/projects/signature-city/entrance.jpg', alt: 'Solar street lights along Signature City roads', caption: 'Solar-lit streets' },
      { src: '/projects/signature-city/amenities.jpg', alt: 'Kids play area in Signature City', caption: 'Play area' },
    ],
    masterPlan: { src: '/projects/signature-city/master-plan.jpg', alt: 'Signature City master plan diagram', caption: 'Master plan' },
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
      "Steady appreciation in Coimbatore's growth corridor",
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

  // ─── Namakkal ──────────────────────────────────────────────────────────────
  {
    id: 'p2',
    slug: 'hitech-city',
    title: 'Hitech City',
    location: 'Namakkal',
    district: 'Namakkal',
    status: 'available',
    plotSizes: ['20×30', '24×40', '30×40'],
    startingPriceInr: 10_00_000,
    acreage: '8 Acres',
    tagline: 'Modern living in the heart of Namakkal',
    description:
      'Hitech City is a DTCP approved residential plot layout in Namakkal — designed for modern families with wide roads, parks and full compound security.',
    shortDescription:
      'A DTCP approved gated community in Namakkal with wide roads, parks and 24×7 security.',
    overview: [
      'Hitech City brings the Signature standard to Namakkal — a thoughtfully planned layout of DTCP approved residential plots with wide internal roads, shaded avenue trees and a secure gated perimeter.',
      'Every plot enjoys a clear title, underground utilities and solar-lit streets, giving families the foundation to build confidently.',
    ],
    features: [
      'DTCP approved layout',
      'Wide black top roads',
      'Gated community with 24×7 security',
      'Solar street lights',
      'Underground drainage',
      'Avenue trees',
    ],
    amenities: ['Gated Community', '24×7 Security', 'Parks', 'Avenue Trees', 'Solar Street Lights'],
    images: [{ src: '/projects/hitech-city/entrance.jpg', alt: 'Hitech City layout, Namakkal', caption: 'Layout overview' }],
    gallery: [
      { src: '/projects/hitech-city/layout.jpg', alt: 'Hitech City avenue view', caption: 'Avenue view' },
      { src: '/projects/hitech-city/entrance.jpg', alt: 'Hitech City grand entrance', caption: 'Grand entrance' },
      { src: '/projects/hitech-city/amenities.jpg', alt: 'Landscaped park, Hitech City', caption: 'Central park' },
      { src: '/projects/hitech-city/proximities.jpg', alt: 'Solar street lights, Hitech City', caption: 'Solar-lit streets' },
    ],
    masterPlan: { src: '/projects/hitech-city/layout.jpg', alt: 'Hitech City master plan, Namakkal', caption: 'Master plan' },
    availablePlots: [
      { id: 'p2-a', size: '20×30', dimensions: '600 sq. ft.', facing: 'East', priceInr: 10_00_000, status: 'available' },
      { id: 'p2-b', size: '24×40', dimensions: '960 sq. ft.', facing: 'North', priceInr: 15_00_000, status: 'available' },
      { id: 'p2-c', size: '30×40', dimensions: '1200 sq. ft.', facing: 'Garden-facing', priceInr: 19_50_000, status: 'available' },
    ],
    pricing: [
      { size: '20×30', dimensions: '600 sq. ft.', startPriceInr: 10_00_000 },
      { size: '24×40', dimensions: '960 sq. ft.', startPriceInr: 15_00_000 },
      { size: '30×40', dimensions: '1200 sq. ft.', startPriceInr: 19_50_000, note: 'Most popular' },
    ],
    milestones: [
      { phase: 'Completed', title: 'Layout approval', description: 'DTCP approval secured and layout registered.' },
      { phase: 'In progress', title: 'Internal roads', description: 'Black top avenue formation underway.' },
      { phase: 'Upcoming', title: 'Handover', description: 'Final amenities and handover to residents.' },
    ],
    investmentBenefits: [
      'Clear DTCP-approved title on every plot',
      'Growing demand in Namakkal\'s residential belt',
      'Bank loan eligible',
      'Ready infrastructure',
    ],
    nearbyPlaces: [
      { name: 'Namakkal Bus Stand', category: 'Transit', distance: '5 min' },
      { name: 'Government Hospital, Namakkal', category: 'Hospital', distance: '6 min' },
      { name: 'Namakkal Railway Station', category: 'Transit', distance: '8 min' },
      { name: 'Salem–Namakkal Highway', category: 'Transit', distance: '10 min' },
    ],
    faq: [
      {
        question: 'Is Hitech City DTCP approved?',
        answer: 'Yes — the full layout is DTCP approved with individual clear-title sale deeds for every plot.',
      },
      {
        question: 'Can I get a home loan?',
        answer: 'Absolutely. Plots are bank-loan eligible and our team will assist with pre-approval.',
      },
      {
        question: 'What amenities are included?',
        answer: 'Wide black top roads, gated perimeter, 24×7 security, parks, solar street lights and underground drainage.',
      },
    ],
    isFeatured: true,
  },

  // ─── Madurai ───────────────────────────────────────────────────────────────
  {
    id: 'p3',
    slug: 'emerald-city',
    title: 'Emerald City',
    location: 'Madurai',
    district: 'Madurai',
    status: 'available',
    plotSizes: ['20×30', '24×40', '30×40'],
    startingPriceInr: 9_50_000,
    acreage: '10 Acres',
    tagline: 'Green living in the heart of Madurai',
    description:
      'Emerald City is a DTCP approved residential plot layout in Madurai — a lush, green-planned community designed for families seeking modern amenities with natural surroundings.',
    shortDescription:
      'A DTCP approved green community in Madurai with parks, wide roads and 24×7 security.',
    overview: [
      'Emerald City brings premium plot living to Madurai — a thoughtfully planned, DTCP approved layout where every street is lined with avenue trees and every home has access to landscaped parks.',
      'Wide internal roads, underground drainage and solar-lit avenues create a foundation ready for immediate construction.',
    ],
    features: [
      'DTCP approved layout',
      'Wide black top roads',
      'Gated community with 24×7 security',
      'Landscaped parks',
      'Avenue trees',
      'Solar street lights',
    ],
    amenities: ['Gated Community', '24×7 Security', 'Parks', 'Avenue Trees', 'Solar Street Lights'],
    images: [{ src: '/projects/emerald-city/entrance.jpg', alt: 'Emerald City layout, Madurai', caption: 'Layout overview' }],
    gallery: [
      { src: '/projects/emerald-city/overview.jpg', alt: 'Emerald City avenue view, Madurai', caption: 'Avenue view' },
      { src: '/projects/emerald-city/entrance.jpg', alt: 'Emerald City grand entrance', caption: 'Grand entrance' },
      { src: '/projects/emerald-city/proximities.jpg', alt: 'Emerald City central park', caption: 'Central park' },
      { src: '/projects/emerald-city/route-map.jpg', alt: 'Solar street lights, Emerald City', caption: 'Solar-lit streets' },
    ],
    masterPlan: { src: '/projects/emerald-city/master-plan.jpg', alt: 'Emerald City master plan, Madurai', caption: 'Master plan' },
    availablePlots: [
      { id: 'p3-a', size: '20×30', dimensions: '600 sq. ft.', facing: 'East', priceInr: 9_50_000, status: 'available' },
      { id: 'p3-b', size: '24×40', dimensions: '960 sq. ft.', facing: 'North', priceInr: 14_50_000, status: 'available' },
      { id: 'p3-c', size: '30×40', dimensions: '1200 sq. ft.', facing: 'Garden-facing', priceInr: 18_50_000, status: 'available' },
    ],
    pricing: [
      { size: '20×30', dimensions: '600 sq. ft.', startPriceInr: 9_50_000 },
      { size: '24×40', dimensions: '960 sq. ft.', startPriceInr: 14_50_000 },
      { size: '30×40', dimensions: '1200 sq. ft.', startPriceInr: 18_50_000, note: 'Most popular' },
    ],
    milestones: [
      { phase: 'Completed', title: 'Layout approval', description: 'DTCP approval secured and layout registered.' },
      { phase: 'In progress', title: 'Internal roads', description: 'Black top avenue formation underway.' },
      { phase: 'Upcoming', title: 'Handover', description: 'Final amenities and handover to residents.' },
    ],
    investmentBenefits: [
      'Clear DTCP-approved title on every plot',
      'Prime location in Madurai growth belt',
      'Bank loan eligible',
      'Ready infrastructure',
    ],
    nearbyPlaces: [
      { name: 'Madurai Junction', category: 'Transit', distance: '10 min' },
      { name: 'Government Rajaji Hospital', category: 'Hospital', distance: '12 min' },
      { name: 'Madurai Airport', category: 'Transit', distance: '15 min' },
      { name: 'Meenakshi Amman Temple', category: 'Landmark', distance: '14 min' },
    ],
    faq: [
      {
        question: 'Is Emerald City DTCP approved?',
        answer: 'Yes — the full layout is DTCP approved with individual clear-title sale deeds for every plot.',
      },
      {
        question: 'Can I get a home loan?',
        answer: 'Absolutely. Plots are bank-loan eligible and our team will assist with pre-approval.',
      },
      {
        question: 'What amenities are included?',
        answer: 'Wide black top roads, gated perimeter, 24×7 security, parks, solar street lights and avenue trees.',
      },
    ],
    isFeatured: true,
  },

  // ─── Trichy ────────────────────────────────────────────────────────────────
  {
    id: 'p4',
    slug: 'up-town',
    title: 'Up Town',
    location: 'Trichy',
    district: 'Trichy',
    status: 'available',
    plotSizes: ['20×30', '24×40', '30×40'],
    startingPriceInr: 10_50_000,
    acreage: '9 Acres',
    tagline: 'Urban living redefined in Trichy',
    description:
      'Up Town is a DTCP approved premium residential plot community in Trichy — wide roads, curated amenities and a prime location make this the address families aspire to.',
    shortDescription:
      'A DTCP approved premium gated community in Trichy with wide roads and curated amenities.',
    overview: [
      'Up Town sets a new standard for residential plot living in Trichy — a fully DTCP approved gated layout with wide black top roads, landscaped parks and round-the-clock security.',
      'Strategically located with easy access to Trichy\'s major corridors, Up Town offers clear-title plots ready for immediate construction.',
    ],
    features: [
      'DTCP approved layout',
      'Wide black top roads',
      'Gated community with 24×7 security',
      'Landscaped parks',
      'Solar street lights',
      'Underground drainage',
    ],
    amenities: ['Gated Community', '24×7 Security', 'Parks', 'Avenue Trees', 'Solar Street Lights'],
    images: [{ src: '/projects/up-town/entrance.jpg', alt: 'Up Town layout, Trichy', caption: 'Layout overview' }],
    gallery: [
      { src: '/projects/up-town/overview.jpg', alt: 'Up Town avenue view', caption: 'Avenue view' },
      { src: '/projects/up-town/entrance.jpg', alt: 'Up Town grand entrance', caption: 'Grand entrance' },
      { src: '/projects/up-town/proximities.jpg', alt: 'Up Town central park', caption: 'Central park' },
      { src: '/projects/up-town/route-map.jpg', alt: 'Solar-lit streets, Up Town', caption: 'Solar-lit streets' },
    ],
    masterPlan: { src: '/projects/up-town/master-plan.jpg', alt: 'Up Town master plan, Trichy', caption: 'Master plan' },
    availablePlots: [
      { id: 'p4-a', size: '20×30', dimensions: '600 sq. ft.', facing: 'East', priceInr: 10_50_000, status: 'available' },
      { id: 'p4-b', size: '24×40', dimensions: '960 sq. ft.', facing: 'North', priceInr: 16_00_000, status: 'available' },
      { id: 'p4-c', size: '30×40', dimensions: '1200 sq. ft.', facing: 'Garden-facing', priceInr: 20_50_000, status: 'available' },
    ],
    pricing: [
      { size: '20×30', dimensions: '600 sq. ft.', startPriceInr: 10_50_000 },
      { size: '24×40', dimensions: '960 sq. ft.', startPriceInr: 16_00_000 },
      { size: '30×40', dimensions: '1200 sq. ft.', startPriceInr: 20_50_000, note: 'Most popular' },
    ],
    milestones: [
      { phase: 'Completed', title: 'Layout approval', description: 'DTCP approval secured and layout registered.' },
      { phase: 'In progress', title: 'Internal roads', description: 'Black top avenue formation underway.' },
      { phase: 'Upcoming', title: 'Handover', description: 'Final amenities and handover to residents.' },
    ],
    investmentBenefits: [
      'Clear DTCP-approved title on every plot',
      'Prime location in Trichy growth corridor',
      'Bank loan eligible',
      'Ready infrastructure',
    ],
    nearbyPlaces: [
      { name: 'Trichy Junction', category: 'Transit', distance: '8 min' },
      { name: 'Mahatma Gandhi Memorial Government Hospital', category: 'Hospital', distance: '10 min' },
      { name: 'Trichy International Airport', category: 'Transit', distance: '12 min' },
      { name: 'National Institute of Technology, Trichy', category: 'School', distance: '15 min' },
    ],
    faq: [
      {
        question: 'Is Up Town DTCP approved?',
        answer: 'Yes — the full layout is DTCP approved with individual clear-title sale deeds for every plot.',
      },
      {
        question: 'Can I get a home loan?',
        answer: 'Absolutely. Plots are bank-loan eligible and our team will assist with pre-approval.',
      },
      {
        question: 'What amenities are available?',
        answer: 'Wide black top roads, gated perimeter, 24×7 security, parks, solar street lights and underground drainage.',
      },
    ],
    isFeatured: true,
  },
  {
    id: 'p5',
    slug: 'eden-garden',
    title: 'Eden Garden',
    location: 'Trichy',
    district: 'Trichy',
    status: 'launching',
    plotSizes: ['20×30', '24×40', '30×40'],
    startingPriceInr: 11_00_000,
    acreage: '7 Acres',
    tagline: 'Your garden paradise in Trichy',
    description:
      'Eden Garden is a DTCP approved residential plot layout in Trichy — nestled amidst lush greens and designed for families who cherish nature, space and community.',
    shortDescription:
      'A garden-themed DTCP approved gated community in Trichy with lush green belts and curated amenities.',
    overview: [
      'Eden Garden redefines residential living in Trichy — a serene, garden-themed DTCP approved layout where every street is flanked by mature trees and manicured green belts.',
      'Wide internal roads, dedicated parks and solar-lit avenues create a tranquil environment perfect for families to build their dream homes.',
    ],
    features: [
      'DTCP approved layout',
      'Garden-themed green belts',
      'Wide black top roads',
      'Gated community with 24×7 security',
      'Dedicated parks',
      'Solar street lights',
    ],
    amenities: ['Gated Community', '24×7 Security', 'Parks', 'Avenue Trees', 'Solar Street Lights'],
    images: [{ alt: 'Eden Garden layout, Trichy', caption: 'Layout overview' }],
    gallery: [
      { alt: 'Eden Garden avenue view', caption: 'Garden avenue' },
      { alt: 'Eden Garden green belt', caption: 'Green belt' },
      { alt: 'Eden Garden central park', caption: 'Central park' },
      { alt: 'Eden Garden grand entrance', caption: 'Grand entrance' },
    ],
    masterPlan: { alt: 'Eden Garden master plan, Trichy', caption: 'Master plan' },
    availablePlots: [
      { id: 'p5-a', size: '20×30', dimensions: '600 sq. ft.', facing: 'East', priceInr: 11_00_000, status: 'available' },
      { id: 'p5-b', size: '24×40', dimensions: '960 sq. ft.', facing: 'Garden-facing', priceInr: 16_50_000, status: 'available' },
      { id: 'p5-c', size: '30×40', dimensions: '1200 sq. ft.', facing: 'Park-facing', priceInr: 21_00_000, status: 'available' },
    ],
    pricing: [
      { size: '20×30', dimensions: '600 sq. ft.', startPriceInr: 11_00_000, note: 'Launch price' },
      { size: '24×40', dimensions: '960 sq. ft.', startPriceInr: 16_50_000, note: 'Launch price' },
      { size: '30×40', dimensions: '1200 sq. ft.', startPriceInr: 21_00_000, note: 'Park-facing' },
    ],
    milestones: [
      { phase: 'Completed', title: 'Layout approval', description: 'DTCP approval secured and layout registered.' },
      { phase: 'In progress', title: 'Pre-sales', description: 'Early registrations open with launch pricing.' },
      { phase: 'Upcoming', title: 'Roads & landscaping', description: 'Avenue formation and green belt landscaping to begin.' },
    ],
    investmentBenefits: [
      'Clear DTCP-approved title on every plot',
      'Garden-themed, high-demand community',
      'Bank loan eligible',
      'Launch pricing advantage',
    ],
    nearbyPlaces: [
      { name: 'Trichy Junction', category: 'Transit', distance: '9 min' },
      { name: 'Mahatma Gandhi Memorial Government Hospital', category: 'Hospital', distance: '11 min' },
      { name: 'Trichy International Airport', category: 'Transit', distance: '13 min' },
      { name: 'Bishop Heber College', category: 'School', distance: '10 min' },
    ],
    faq: [
      {
        question: 'Is Eden Garden DTCP approved?',
        answer: 'Yes — the full layout is DTCP approved with individual clear-title sale deeds for every plot.',
      },
      {
        question: 'Can I get a home loan?',
        answer: 'Absolutely. Plots are bank-loan eligible and our team will assist with pre-approval.',
      },
      {
        question: 'What makes Eden Garden special?',
        answer: 'Its garden-themed design — lush green belts, park-facing plots and mature avenue trees create a nature-first living experience.',
      },
    ],
    isFeatured: true,
  },
]
