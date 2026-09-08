import { useNavigate } from 'react-router-dom'
import { FileJson2, Pencil } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Seo } from '@/components/ui/Seo'
import { useAdminSiteContent } from '@/hooks/use-admin-content'
import {
  SITE_CONTENT_KEY_LABELS,
  SITE_CONTENT_KEYS,
  type AdminSiteContentRow,
} from '@/types/admin'

function RowSkeleton() {
  return (
    <div className="overflow-hidden border border-ink-200 bg-cream-50">
      <div className="grid grid-cols-4 gap-4 border-b border-ink-200 bg-ink-900 px-4 py-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-16 bg-cream-50/20" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-4 gap-4 border-b border-ink-200 px-4 py-4 last:border-b-0"
        >
          <Skeleton className="h-3 w-full max-w-32" />
          <Skeleton className="h-3 w-full max-w-40" />
          <Skeleton className="h-3 w-full max-w-20" />
          <Skeleton className="h-3 w-full max-w-16" />
        </div>
      ))}
    </div>
  )
}

function rowSummary(row: AdminSiteContentRow): string {
  if (Array.isArray(row.content)) return `${row.content.length} items`
  if (row.content !== null && typeof row.content === 'object') {
    return `${Object.keys(row.content as Record<string, unknown>).length} fields`
  }
  return String(row.content ?? '')
}

function orderRows(rows: AdminSiteContentRow[]): AdminSiteContentRow[] {
  const byKey = new Map(rows.map((row) => [row.key, row]))
  return SITE_CONTENT_KEYS.flatMap((key) => (byKey.get(key) ? [byKey.get(key)!] : []))
}

export default function AdminContentPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useAdminSiteContent()
  const rows = orderRows(data ?? [])

  return (
    <>
      <Seo
        title="Site Content"
        description="Edit the Signature City marketing content blocks."
      />
      <AdminHeader />

      <main className="min-h-svh bg-cream-100 pb-24">
        <Container className="pt-10 md:pt-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-700 uppercase">
                <span aria-hidden className="h-px w-10 bg-gold-500/70" />
                Content Blocks
              </p>
              <h1 className="font-display text-3xl text-ink-900 md:text-4xl">Site Content</h1>
              <p className="mt-2 max-w-xl text-sm text-ink-500">
                Each block drives a section on the public site. Edit a block&apos;s JSON — the
                frontend re-reads it on the next load.
              </p>
            </div>
          </div>

          <div className="mt-8">
            {isError ? (
              <div className="border border-ink-200 bg-cream-50">
                <ErrorState
                  title="Could not load content blocks"
                  description="The site content endpoint is unavailable right now. Check the backend and try again."
                  onRetry={() => void refetch()}
                />
              </div>
            ) : isLoading ? (
              <RowSkeleton />
            ) : rows.length === 0 ? (
              <div className="border border-ink-200 bg-cream-50">
                <EmptyState
                  icon={FileJson2}
                  title="No content blocks yet"
                  description="Imported site_content rows will appear here."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse border border-ink-200 bg-cream-50">
                  <thead>
                    <tr className="bg-ink-900 text-left text-cream-50">
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Block
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Key
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Content
                      </th>
                      <th scope="col" className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-bold tracking-[0.18em] uppercase">
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-ink-200 transition-colors last:border-b-0 hover:bg-gold-50"
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-ink-900">
                          {SITE_CONTENT_KEY_LABELS[row.key]}
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-ink-500">{row.key}</td>
                        <td className="px-4 py-4 text-sm text-ink-600">{rowSummary(row)}</td>
                        <td className="px-4 py-4">
                          <Badge tone={row.isActive ? 'green' : 'muted'} dot={row.isActive}>
                            {row.isActive ? 'Published' : 'Hidden'}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/admin/content/${row.key}`)}
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Container>
      </main>
    </>
  )
}
