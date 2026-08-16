import type { Contact } from '@/types/contact'
import { apiFetch } from '@/services/api-client'

/**
 * Fetch every customer enquiry from the Xano `Contacts` table.
 * Note: this endpoint returns a bare array (not the `{ data: … }` envelope),
 * so `unwrap` is intentionally not used here.
 */
export async function fetchContacts(): Promise<Contact[]> {
  return apiFetch<Contact[]>('/contacts', { authorized: true })
}
