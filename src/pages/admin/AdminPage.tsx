import { useMemo, useState } from 'react'
import { Inbox, RefreshCw, Search } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Seo } from '@/components/ui/Seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { useContacts } from '@/hooks/use-contacts'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { formatPhone } from '@/utils/formatters'
import type { Contact } from '@/types/contact'

function formatCreatedAt(epochMs: number): string {
  return new Date(epochMs).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function EmptyCell() {
  return <span className="text-ink-400">—</span>
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden border border-ink-200 bg-cream-50">
      <div className="grid grid-cols-6 gap-4 border-b border-ink-200 bg-ink-900 px-4 py-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-16 bg-cream-50/20" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-6 gap-4 border-b border-ink-200 px-4 py-4 last:border-b-0"
        >
          {Array.from({ length: 6 }).map((_, cellIndex) => (
            <Skeleton key={cellIndex} className="h-3 w-full max-w-24" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface ContactRowProps {
  contact: Contact
}

function ContactRow({ contact }: ContactRowProps) {
  return (
    <tr className="border-b border-ink-200 last:border-b-0 transition-colors hover:bg-gold-50">
      <td className="px-4 py-4 font-mono text-xs text-ink-500">#{contact.id}</td>
      <td className="px-4 py-4 text-sm whitespace-nowrap text-ink-600">
        {formatCreatedAt(contact.created_at)}
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-ink-900">
        {contact.name || <EmptyCell />}
      </td>
      <td className="px-4 py-4 text-sm text-ink-600">
        {contact.email ? (
          <a href={`mailto:${contact.email}`} className="transition-colors hover:text-gold-700">
            {contact.email}
          </a>
        ) : (
          <EmptyCell />
        )}
      </td>
      <td className="px-4 py-4 text-sm text-ink-600">
        {contact.phone ? (
          <a href={`tel:${contact.phone}`} className="transition-colors hover:text-gold-700">
            {formatPhone(contact.phone)}
          </a>
        ) : (
          <EmptyCell />
        )}
      </td>
      <td className="px-4 py-4 text-sm text-ink-500">
        <EmptyCell />
      </td>
      <td className="px-4 py-4 text-sm text-ink-500">
        <EmptyCell />
      </td>
      <td className="max-w-sm px-4 py-4 text-sm text-ink-600">
        {contact.message || <EmptyCell />}
      </td>
    </tr>
  )
}

export default function AdminPage() {
  const { data, isLoading, isError, isRefetching, refetch } = useContacts()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)

  const filtered = useMemo(() => {
    if (!data) return []
    const needle = debouncedQuery.trim().toLowerCase()
    if (!needle) return data
    return data.filter((contact) =>
      [contact.name, contact.email, contact.phone].some((value) =>
        value.toLowerCase().includes(needle),
      ),
    )
  }, [data, debouncedQuery])

  return (
    <>
      <Seo title="Admin Dashboard" description="Signature City customer enquiries dashboard." />

      <div className="flex h-screen flex-col overflow-hidden bg-cream-100">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto pb-16">
          <Container className="pt-8 md:pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-700 uppercase">
                <span aria-hidden className="h-px w-10 bg-gold-500/70" />
                Customer Enquiries
              </p>
              <h1 className="font-display text-3xl text-ink-900 md:text-4xl">Contacts</h1>
              <p className="mt-2 text-sm text-ink-500">
                Enquiries submitted through the website contact form.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={() => void refetch()}
              loading={isRefetching}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Refresh
            </Button>
          </div>

          <div className="mt-8">
            <label htmlFor="contacts-search" className="sr-only">
              Search contacts
            </label>
            <div className="relative max-w-md">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-400"
              />
              <Input
                id="contacts-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, email, or phone"
                className="pl-11"
              />
            </div>
          </div>

          <div className="mt-6">
            {isError ? (
              <ErrorState
                title="Could not load contacts"
                description="The Xano Contacts endpoint is unavailable right now. Check the backend and try again."
                onRetry={() => void refetch()}
              />
            ) : isLoading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <div className="border border-ink-200 bg-cream-50">
                <EmptyState
                  icon={Inbox}
                  title={debouncedQuery ? 'No matching enquiries' : 'No enquiries yet'}
                  description={
                    debouncedQuery
                      ? 'Try a different name, email, or phone number.'
                      : 'Enquiries submitted via the contact form will appear here.'
                  }
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="mb-3 flex items-center justify-between">
                  <Badge tone="muted">
                    {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
                  </Badge>
                  {debouncedQuery && filtered.length !== data?.length ? (
                    <p className="text-xs text-ink-500">
                      Showing matches for “{debouncedQuery}”
                    </p>
                  ) : null}
                </div>
                <table className="w-full min-w-[900px] border-collapse border border-ink-200 bg-cream-50">
                  <thead>
                    <tr className="bg-ink-900 text-left text-cream-50">
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        ID
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Created At
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Name
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Phone
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Interest
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Project
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((contact) => (
                      <ContactRow key={contact.id} contact={contact} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Container>
        </main>
      </div>
    </>
  )
}
