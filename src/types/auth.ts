/** Credentials sent to `POST /auth/login`. */
export interface LoginCredentials {
  email: string
  password: string
}

/** Shape of `POST /auth/login` success body (Xano custom auth). */
export interface LoginResponse {
  authToken: string
  refreshToken?: string
  [key: string]: unknown
}

/** An admin user record from the `admin_users` table, as returned by `/auth/me`. */
export interface AdminUser {
  id: number
  email: string
  name?: string | null
  role?: string | null
  created_at?: number | string
  [key: string]: unknown
}

/** Current session state of the admin auth flow. */
export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated'
