import { useLocalStore } from '@/store/local-store'
import type { Contact } from '@/types/contact'

export function useContacts() {
  const leads = useLocalStore((state) => state.leads)

  const contacts: Contact[] = leads.map((lead, idx) => ({
    id: idx + 1,
    created_at: lead.createdAt,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message || (lead.projectTitle ? `Interested in ${lead.projectTitle}` : ''),
  }))

  return {
    data: contacts,
    isLoading: false,
    isError: false,
    isRefetching: false,
    refetch: () => Promise.resolve(),
  }
}
