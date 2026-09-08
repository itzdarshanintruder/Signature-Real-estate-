import { useQuery } from '@tanstack/react-query'
import { fetchProjectBySlug, fetchProjects } from '@/services/projects.api'
import { fetchGallery } from '@/services/gallery.api'
import { fetchSiteContent } from '@/services/site-content.api'
import { fetchAmenities } from '@/services/amenities.api'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: () => fetchProjectBySlug(slug),
    staleTime: 5 * 60 * 1000,
  })
}

export function useGallery() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: fetchGallery,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSiteContent() {
  return useQuery({
    queryKey: ['site-content'],
    queryFn: fetchSiteContent,
    staleTime: Infinity,
  })
}

export function useAmenities() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: fetchAmenities,
    staleTime: 5 * 60 * 1000,
  })
}
