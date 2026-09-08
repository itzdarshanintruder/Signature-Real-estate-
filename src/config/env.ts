/**
 * Environment access for build-time config.
 * Kept dependency-free so the shared service chunks never pull the form
 * validation library (zod) into every route load.
 */

const raw = import.meta.env as Record<string, string | undefined>

const apiUrl = raw.VITE_API_URL?.trim() ?? ''

if (apiUrl) {
  try {
    new URL(apiUrl)
  } catch {
    throw new Error('VITE_API_URL must be a valid URL or empty.')
  }
}

const authApiUrl = raw.VITE_AUTH_API_URL?.trim() ?? ''

if (authApiUrl) {
  try {
    new URL(authApiUrl)
  } catch {
    throw new Error('VITE_AUTH_API_URL must be a valid URL or empty.')
  }
}

/** Parsed, validated environment. Fails loudly on invalid config. */
export const env = {
  VITE_API_URL: apiUrl,
  VITE_AUTH_API_URL: authApiUrl,
  VITE_CLOUDINARY_CLOUD_NAME: raw.VITE_CLOUDINARY_CLOUD_NAME?.trim() || undefined,
  VITE_SENTRY_DSN: raw.VITE_SENTRY_DSN?.trim() || undefined,
} as const

/** True when a Xano/API backend is configured; otherwise the static layer is used. */
export const IS_API_ENABLED = Boolean(apiUrl)

/** True when the admin auth backend (api:admin) is configured. */
export const IS_AUTH_ENABLED = Boolean(authApiUrl)
