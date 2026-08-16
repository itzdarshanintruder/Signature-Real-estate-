import { env, IS_API_ENABLED } from '@/config/env'
import type { ApiErrorBody, ApiResponse } from '@/types/api'

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * In-memory auth token holder. Never persisted (no localStorage) so the JWT
 * cannot leak to disk or another origin; a hard refresh simply clears it.
 */
let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function getAuthToken(): string | null {
  return authToken
}

export interface ApiFetchOptions extends RequestInit {
  /** Override the default data base URL (used for the separate auth group). */
  baseUrl?: string
  /** Attach `Authorization: Bearer <token>` when a session token is present. */
  authorized?: boolean
}

/**
 * Typed fetch wrapper for the Xano backend.
 * The only module allowed to touch the network directly.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { baseUrl, authorized, headers, ...rest } = options
  const isFormData = rest.body instanceof FormData

  if (!IS_API_ENABLED) {
    throw new ApiError('STATIC_LAYER', 'Backend is not configured (VITE_API_URL is empty).')
  }

  const response = await fetch(`${baseUrl ?? env.VITE_API_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(authorized && authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    ...rest,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null
    throw new ApiError(
      body?.code ?? String(response.status),
      body?.message ?? response.statusText,
      body,
    )
  }

  return response.json() as Promise<T>
}

/** Standard unwrap for `{ data: ... }` shaped Xano responses. */
export async function unwrap<T>(response: ApiResponse<T>): Promise<T> {
  return response.data
}
