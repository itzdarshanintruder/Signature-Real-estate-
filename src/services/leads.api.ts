import { IS_API_ENABLED } from '@/config/env'
import type { Lead } from '@/types/lead'
import { apiFetch } from '@/services/api-client'

export async function submitLead(lead: Lead): Promise<{ id: string }> {
  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 700))

    return {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
    }
  }

  const response = await apiFetch<{
    id: number
    name: string
    email: string
    phone: string
    message: string
  }>('/create_contact', {
    method: 'POST',
    body: JSON.stringify({
      name: lead.name,
      email: lead.email || '',
      phone: lead.phone,
      message: lead.message || '',
    }),
  })

  return {
    id: String(response.id),
  }
}