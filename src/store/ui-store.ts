import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  tone: 'success' | 'error'
}

interface UiState {
  isNavOpen: boolean
  toasts: Toast[]
  setNavOpen: (open: boolean) => void
  pushToast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  isNavOpen: false,
  toasts: [],
  setNavOpen: (open) => set({ isNavOpen: open }),
  pushToast: (message, tone = 'success') => {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 4200)
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
