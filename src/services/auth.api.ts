import { env, IS_AUTH_ENABLED } from '@/config/env'
import { ApiError, apiFetch } from '@/services/api-client'
import type { AdminUser, LoginCredentials, LoginResponse } from '@/types/auth'

const AUTH_BASE_URL = env.VITE_AUTH_API_URL

// ─── DEV BYPASS ──────────────────────────────────────────────────────────────
// When VITE_AUTH_API_URL is not set, skip the real auth backend and allow
// any credentials so the admin panel can be used without a live database.
const DEV_FAKE_TOKEN = 'dev-bypass-token'
const DEV_MOCK_USER: AdminUser = {
  id: 0,
  email: 'dev@local.test',
  name: 'Dev Admin',
  role: 'admin',
}
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exchange email + password for a JWT via `POST /auth/login`.
 * Returns the raw `authToken` — never persisted to storage.
 *
 * DEV: When auth is not configured, accepts any input and returns a fake token.
 */
export async function login(credentials: LoginCredentials): Promise<string> {
  if (!IS_AUTH_ENABLED) {
    // Dev bypass — no backend required; any credentials are accepted.
    console.warn('[auth] DEV BYPASS: auth backend not configured, accepting any credentials.')
    return DEV_FAKE_TOKEN
  }

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
 *
 * DEV: When auth is not configured, returns a mock admin user.
 */
export async function fetchCurrentUser(): Promise<AdminUser> {
  if (!IS_AUTH_ENABLED) {
    return DEV_MOCK_USER
  }

  return apiFetch<AdminUser>('/auth/me', {
    baseUrl: AUTH_BASE_URL,
    authorized: true,
  })
}
