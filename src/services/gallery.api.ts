import { IS_API_ENABLED } from '@/config/env'
import { galleryItems as staticGallery } from '@/data/gallery'
import type { GalleryItem } from '@/data/gallery'
import { apiFetch } from '@/services/api-client'

interface GalleryApiItem {
  id: number
  title: string
  image_url: string
  category: string
  description: string
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  if (!IS_API_ENABLED) return staticGallery

  const data = await apiFetch<GalleryApiItem[]>('/project_images')

  return data.map((item) => ({
    id: String(item.id),
    category: item.category,
    image: {
      src: item.image_url,
      alt: item.title,
    },
  }))
}