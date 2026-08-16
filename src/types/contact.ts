/** A customer/lead record saved in the Xano `Contacts` table. */
export interface Contact {
  id: number
  /** Epoch milliseconds as returned by Xano. */
  created_at: number
  name: string
  email: string
  phone: string
  message: string
}
