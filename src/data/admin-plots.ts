import type { Plot } from '@/types/admin'

/**
 * DEV SEED DATA — admin plot management.
 * Stand-in for a Xano `plots` table until admin CRUD endpoints exist.
 * Image `url` is intentionally left empty so the branded placeholder renders.
 */
export const seedPlots: Plot[] = [
  {
    id: 'plot-1',
    name: 'Signature City — Phase One',
    location: 'Near Sulur, Coimbatore',
    plotNumber: 'SC-1',
    area: 2035,
    price: 32_00_000,
    description:
      'Premium DTCP-approved residential plot inside the flagship 12-acre gated enclave near Sulur, with clear title and 24×7 security.',
    status: 'available',
    amenities: ['Gated community', '24×7 security', 'Black top roads', 'Ground water'],
    latitude: 11.0269,
    longitude: 77.0657,
    gallery: [
      {
        id: 'plot-1-img-1',
        fileName: 'phase-one-master-plan.jpg',
        isCover: true,
        position: 0,
        alt: 'Phase One master plan',
      },
      {
        id: 'plot-1-img-2',
        fileName: 'phase-one-avenue.webp',
        isCover: false,
        position: 1,
        alt: 'Avenue view of Phase One',
      },
    ],
    updatedAt: '2026-07-28T10:15:00.000Z',
  },
  {
    id: 'plot-2',
    name: 'Signature City — Garden Block',
    location: 'Green Belt 2, Near Sulur',
    plotNumber: 'SC-GB-7',
    area: 1200,
    price: 19_50_000,
    description:
      'Corner plot facing the landscaped park, ideal for a compact family home or boutique residence.',
    status: 'reserved',
    amenities: ['Corner plot', 'Park frontage', 'Solar street lights'],
    latitude: 11.0201,
    longitude: 77.0712,
    gallery: [],
    updatedAt: '2026-08-02T08:40:00.000Z',
  },
  {
    id: 'plot-3',
    name: 'Signature City — Avenue Homes',
    location: 'Avenue Block A, Near Sulur',
    plotNumber: 'SC-AH-14',
    area: 1500,
    price: 24_00_000,
    description:
      'Large avenue-facing plot on the internal green belt with generous setback and private gated entry.',
    status: 'available',
    amenities: ['Avenue facing', 'Private entry', 'Gated community'],
    latitude: 11.0325,
    longitude: 77.0621,
    gallery: [
      {
        id: 'plot-3-img-1',
        fileName: 'avenue-homes-layout.png',
        isCover: true,
        position: 0,
        alt: 'Avenue Homes layout',
      },
    ],
    updatedAt: '2026-07-19T14:05:00.000Z',
  },
  {
    id: 'plot-4',
    name: 'Signature City — North Block',
    location: 'North Block, Near Sulur',
    plotNumber: 'SC-NB-3',
    area: 600,
    price: 9_80_000,
    description: 'Compact north-facing plot in the upcoming North Block release. Registrations open soon.',
    status: 'coming-soon',
    amenities: ['North facing', 'Coming soon'],
    gallery: [],
    updatedAt: '2026-08-05T16:20:00.000Z',
  },
]
