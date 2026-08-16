import { env, IS_AUTH_ENABLED } from '@/config/env'
import { ApiError, apiFetch } from '@/services/api-client'
import type { AdminUser, LoginCredentials, LoginResponse } from '@/types/auth'

const AUTH_BASE_URL = env.VITE_AUTH_API_URL

function ensureAuthEnabled() {
  if (!IS_AUTH_ENABLED) {
    throw new ApiError('AUTH_NOT_CONFIGURED', 'Admin auth is not configured (VITE_AUTH_API_URL is empty).')
  }
}

/**
 * Exchange email + password for a JWT via `POST /auth/login`.
 * Returns the raw `authToken` — never persisted to storage.
 */
export async function login(credentials: LoginCredentials): Promise<string> {
  ensureAuthEnabled()

  const response = await apiFetch<LoginResponse>('/auth/login', {
    baseUrl: AUTH_BASE_URL,
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  const token = response.authToken
  if (!token) {
    throw new ApiError('AUTH_NO_TOKEN', 'Login succeeded but no auth token was returned.')
  }

  return token
}

/**
 * Validate the current session token via `GET /auth/me`.
 * Returns the `admin_users` record for the authenticated admin.
 */
export async function fetchCurrentUser(): Promise<AdminUser> {
  ensureAuthEnabled()

  return apiFetch<AdminUser>('/auth/me', {
    baseUrl: AUTH_BASE_URL,
    authorized: true,
  })
}
