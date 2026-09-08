import type { ImageAsset } from '@/types/content'

export type GalleryCategory = string

export interface GalleryItem {
  id: string
  category: GalleryCategory
  image: ImageAsset
}

export const galleryItems: GalleryItem[] = [
  { id: 'g1', category: 'Master Plan', image: { alt: 'Signature City overall master plan' } },
  { id: 'g2', category: 'Master Plan', image: { alt: 'Avenue layout and zoning detail' } },
  { id: 'g3', category: 'Lifestyle', image: { alt: 'Landscaped parks and walking trails' } },
  { id: 'g4', category: 'Lifestyle', image: { alt: 'The Signature City clubhouse at dusk' } },
  { id: 'g5', category: 'Lifestyle', image: { alt: 'Community hall interior' } },
  { id: 'g6', category: 'Progress', image: { alt: 'Internal road laying works' } },
  { id: 'g7', category: 'Progress', image: { alt: 'Landscaping and planting underway' } },
  { id: 'g8', category: 'Approvals', image: { alt: 'DTCP approval certificate' } },
  { id: 'g9', category: 'Approvals', image: { alt: 'RERA registration details' } },
]
