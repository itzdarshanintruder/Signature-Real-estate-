import { create } from 'zustand'
import { queryClient } from '@/app/providers'
import { setAuthToken } from '@/services/api-client'
import { fetchCurrentUser, login as apiLogin } from '@/services/auth.api'
import type { AdminUser, AuthStatus, LoginCredentials } from '@/types/auth'

interface AuthState {
  status: AuthStatus
  token: string | null
  user: AdminUser | null
  login: (credentials: LoginCredentials) => Promise<void>
  /** Client-side logout only — clears the session; no server call. */
  logout: () => void
  /** Validates the in-memory token against `GET /auth/me`. */
  validateSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  user: null,

  login: async (credentials) => {
    set({ status: 'checking' })
    try {
      const token = await apiLogin(credentials)
      setAuthToken(token)
      set({ token, status: 'authenticated' })

      // Best-effort: hydrate the admin profile. The session is already valid
      // once the token exists, so a /auth/me hiccup must not log the user out.
      try {
        const user = await fetchCurrentUser()
        set({ user })
      } catch {
        set({ user: null })
      }
    } catch (error) {
      setAuthToken(null)
      set({ token: null, user: null, status: 'unauthenticated' })
      throw error
    }
  },

  logout: () => {
    setAuthToken(null)
    queryClient.clear()
    set({ token: null, user: null, status: 'unauthenticated' })
  },

  validateSession: async () => {
    const { token } = get()
    if (!token) {
      set({ status: 'unauthenticated' })
      return
    }

    set({ status: 'checking' })
    try {
      const user = await fetchCurrentUser()
      set({ user, status: 'authenticated' })
    } catch {
      setAuthToken(null)
      set({ token: null, user: null, status: 'unauthenticated' })
    }
  },
}))
