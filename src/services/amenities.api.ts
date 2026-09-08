import { apiFetch } from '@/services/api-client'

export interface Amenity {
  id: number
  name: string
  icon: string
  description: string
  category: string
  sort_order: number
  is_active: boolean
}

export async function fetchAmenities(): Promise<Amenity[]> {
  return apiFetch<Amenity[]>('/amenities')
}