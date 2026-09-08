import { IS_API_ENABLED } from '@/config/env'
import type { Lead } from '@/types/lead'
import { apiFetch } from '@/services/api-client'

export interface ApiLead {
  id: string
  name: string
  email: string
  phone: string
  message: string
  interest: string
  projectSlug: string
  createdAt?: string
}

export async function submitLead(
  lead: Lead,
): Promise<{ id: string }> {
  if (!IS_API_ENABLED) {
    throw new Error('Lead API is not enabled')
  }

  try {
    const response = await apiFetch<ApiLead>('/api/leads', {
      method: 'POST',
      body: JSON.stringify({
        name: lead.name,
        email: lead.email || '',
        phone: lead.phone,
        message: lead.message || '',
        interest: lead.interest || 'general',
        projectSlug: lead.projectSlug || '',
      }),
    })

    return {
      id: String(response.id),
    }
  } catch (error) {
    console.error('LEAD API ERROR:', error)
    throw error
  }
}

/**
 * Get all leads from MongoDB
 */
export async function getLeads(): Promise<ApiLead[]> {
  if (!IS_API_ENABLED) {
    throw new Error('Lead API is not enabled')
  }

  try {
    const response = await apiFetch<ApiLead[]>('/api/leads', {
      method: 'GET',
    })

    return response
  } catch (error) {
    console.error('GET LEADS API ERROR:', error)
    throw error
  }
}

/**
 * Delete a lead from MongoDB
 */
export async function deleteLead(
  id: string,
): Promise<void> {
  if (!IS_API_ENABLED) {
    throw new Error('Lead API is not enabled')
  }

  try {
    await apiFetch(`/api/leads/${id}`, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('DELETE LEAD API ERROR:', error)
    throw error
  }
}