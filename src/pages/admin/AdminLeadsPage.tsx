/**
 * AdminLeadsPage.tsx
 * Shows customer interest enquiries submitted from the public Projects page.
 * All data is stored in localStorage (no backend needed).
 */

import { useMemo, useState } from 'react'
import { Inbox, Search, Trash2 } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Seo } from '@/components/ui/Seo'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useLocalStore, type LocalLead } from '@/store/local-store'
import { formatPhone } from '@/utils/formatters'

function formatDate(epoch: number) {
  return new Date(epoch).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

interface LeadRowProps {
  lead: LocalLead
  onDelete: (lead: LocalLead) => void
}

function LeadRow({ lead, onDelete }: LeadRowProps) {
  return (
    <tr className="border-b border-ink-200 transition-colors last:border-b-0 hover:bg-gold-50">
      <td className="px-4 py-4 font-mono text-xs text-ink-400">
        #{lead.id.slice(-6).toUpperCase()}
      </td>
      <td className="px-4 py-4 text-sm whitespace-nowrap text-ink-500">
        {formatDate(lead.createdAt)}
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-ink-900">{lead.name}</td>
      <td className="px-4 py-4 text-sm text-ink-600">
        {lead.email ? (
          <a href={`mailto:${lead.email}`} className="transition-colors hover:text-gold-700">
            {lead.email}
          </a>
        ) : (
          <span className="text-ink-300">—</span>
        )}
      </td>
      <td className="px-4 py-4 text-sm text-ink-600">
        {lead.phone ? (
          <a href={`tel:${lead.phone}`} className="transition-colors hover:text-gold-700">
            {formatPhone(lead.phone)}
          </a>
        ) : (
          <span className="text-ink-300">—</span>
        )}
      </td>
      <td className="px-4 py-4 text-sm">
        <Badge tone="gold">{lead.projectTitle}</Badge>
      </td>
      <td className="max-w-xs px-4 py-4 text-sm text-ink-500">
        {lead.message || <span className="text-ink-300">—</span>}
      </td>
      <td className="px-4 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:border-red-200 hover:bg-red-50"
          onClick={() => onDelete(lead)}
          aria-label="Delete lead"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </td>
    </tr>
  )
}

export default function AdminLeadsPage() {
  const leads = useLocalStore((s) => s.leads)
  const deleteLead = useLocalStore((s) => s.deleteLead)
  const [query, setQuery] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<LocalLead | null>(null)
  const debounced = useDebouncedValue(query, 300)

  const filtered = useMemo(() => {
    const needle = debounced.trim().toLowerCase()
    if (!needle) return leads
    return leads.filter((l) =>
      [l.name, l.email, l.phone, l.projectTitle].some((v) =>
        v?.toLowerCase().includes(needle),
      ),
    )
  }, [leads, debounced])

  return (
    <>
      <Seo title="Customer Leads" description="Customer interest enquiries submitted from the projects page." />
      <div className="flex h-screen flex-col overflow-hidden bg-cream-100">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto pb-16">
          <Container className="pt-8 md:pt-10">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-700 uppercase">
                <span aria-hidden className="h-px w-10 bg-gold-500/70" />
                Customer Enquiries
              </p>
              <h1 className="font-display text-3xl text-ink-900 md:text-4xl">Leads</h1>
              <p className="mt-2 text-sm text-ink-500">
                Interest enquiries submitted by visitors on the public Projects page.
              </p>
            </div>
            <Badge tone="muted" className="shrink-0 text-sm">
              {leads.length} {leads.length === 1 ? 'lead' : 'leads'} total
            </Badge>
          </div>

          {/* Search */}
          <div className="mt-8">
            <label htmlFor="leads-search" className="sr-only">Search leads</label>
            <div className="relative max-w-md">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-400"
              />
              <Input
                id="leads-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, phone, or project"
                className="pl-11"
              />
            </div>
          </div>

          {/* Table */}
          <div className="mt-6">
            {leads.length === 0 ? (
              <div className="border border-ink-200 bg-cream-50">
                <EmptyState
                  icon={Inbox}
                  title="No leads yet"
                  description={'When visitors click "I\'m Interested" on a project, their details will appear here.'}
                />
              </div>
            ) : filtered.length === 0 ? (
              <div className="border border-ink-200 bg-cream-50">
                <EmptyState
                  icon={Inbox}
                  title="No matching leads"
                  description="Try a different name, email, phone, or project name."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] border-collapse border border-ink-200 bg-cream-50">
                  <thead>
                    <tr className="bg-ink-900 text-left text-cream-50">
                      {['ID', 'Date', 'Name', 'Email', 'Phone', 'Project', 'Message', ''].map(
                        (col) => (
                          <th
                            key={col}
                            scope="col"
                            className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase"
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => (
                      <LeadRow key={lead.id} lead={lead} onDelete={setConfirmDelete} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Container>
      </main>
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-ink-200 bg-white p-6 shadow-2xl">
            <h2 className="font-display text-lg text-ink-900">Delete lead?</h2>
            <p className="mt-2 text-sm text-ink-500">
              Remove enquiry from <strong>{confirmDelete.name}</strong>? This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button
                className="bg-red-700 hover:bg-red-800"
                onClick={() => {
                  deleteLead(confirmDelete.id)
                  setConfirmDelete(null)
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
