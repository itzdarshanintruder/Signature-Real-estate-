import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * /admin root — redirects to /admin/leads (the MongoDB-backed enquiries page).
 * The old localStorage-only "Contacts" view has been consolidated here.
 */
export default function AdminPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/admin/leads', { replace: true })
  }, [navigate])

  return null
}
