/**
 * local-store.ts
 * Frontend-only persistence layer using Zustand + localStorage.
 * Stores projects added by admin and leads submitted by users.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectStatus = 'available' | 'premium' | 'launching' | 'sold-out'

export interface LocalProject {
  id: string
  title: string
  slug: string
  location: string
  district: string
  status: ProjectStatus
  tagline: string
  shortDescription: string
  description: string
  acreage: string
  plotSizes: string[]
  startingPriceInr?: number
  features: string[]
  amenities: string[]
  youtubeUrl: string
  imageUrl: string
  layoutImageUrl: string
  isFeatured: boolean
  isActive: boolean
  createdAt: number
}

export interface LocalLead {
  id: string
  projectId: string
  projectTitle: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: number
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface LocalStore {
  projects: LocalProject[]
  leads: LocalLead[]

  // Project actions
  addProject: (project: Omit<LocalProject, 'id' | 'createdAt'>) => void
  updateProject: (id: string, patch: Partial<Omit<LocalProject, 'id' | 'createdAt'>>) => void
  deleteProject: (id: string) => void

  // Lead actions
  addLead: (lead: Omit<LocalLead, 'id' | 'createdAt'>) => void
  deleteLead: (id: string) => void
}

export const useLocalStore = create<LocalStore>()(
  persist(
    (set) => ({
      projects: [],
      leads: [],

      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              createdAt: Date.now(),
            },
          ],
        })),

      updateProject: (id, patch) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      addLead: (lead) =>
        set((state) => ({
          leads: [
            {
              ...lead,
              id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              createdAt: Date.now(),
            },
            ...state.leads,
          ],
        })),

      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        })),
    }),
    {
      name: 'signature-local-store',
    },
  ),
)
