import { useLocalStore } from '@/store/local-store'
import { IS_API_ENABLED } from '@/config/env'
import type { Lead } from '@/types/lead'
import { apiFetch } from '@/services/api-client'

export async function submitLead(lead: Lead): Promise<{ id: string }> {
  // Always save to localStorage
  useLocalStore.getState().addLead({
    projectId: lead.projectSlug || 'general',
    projectTitle: lead.projectSlug ? `Project (${lead.projectSlug})` : 'General Enquiry',
    name: lead.name,
    email: lead.email || '',
    phone: lead.phone,
    message: lead.message || (lead.interest ? `Interest: ${lead.interest}` : ''),
  })

  if (!IS_API_ENABLED) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { id: `lead_${Date.now()}` }
  }

  try {
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
  } catch {
    return { id: `lead_${Date.now()}` }
  }
}