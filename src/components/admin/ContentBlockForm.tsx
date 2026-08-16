import { useEffect, useState } from 'react'
import { Braces, CheckCircle2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { FieldError, Label, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { AdminSiteContentRow, SiteContentInput } from '@/types/admin'

function stringify(content: unknown): string {
  try {
    return JSON.stringify(content, null, 2)
  } catch {
    return String(content)
  }
}

interface ContentBlockFormProps {
  row: AdminSiteContentRow | null
  submitting: boolean
  onSubmit: (input: SiteContentInput) => void
  onCancel: () => void
}

/** JSON block editor for a `site_content` row — validates before submit. */
export function ContentBlockForm({ row, submitting, onSubmit, onCancel }: ContentBlockFormProps) {
  const [jsonText, setJsonText] = useState(() => stringify(row?.content))
  const [isActive, setIsActive] = useState(row?.isActive ?? true)
  const [parseError, setParseError] = useState<string | null>(null)

  useEffect(() => {
    setJsonText(stringify(row?.content))
    setIsActive(row?.isActive ?? true)
    setParseError(null)
  }, [row])

  const parsed = (() => {
    try {
      return { ok: true as const, value: JSON.parse(jsonText) as unknown }
    } catch (error) {
      return { ok: false as const, value: null, message: (error as Error).message }
    }
  })()

  const summary =
    parsed.ok && Array.isArray(parsed.value)
      ? `${parsed.value.length} ${parsed.value.length === 1 ? 'item' : 'items'}`
      : parsed.ok && typeof parsed.value === 'object' && parsed.value !== null
        ? `object · ${Object.keys(parsed.value).join(', ')}`
        : null

  const handleSubmit = () => {
    if (!parsed.ok) {
      setParseError(parsed.message)
      return
    }
    setParseError(null)
    onSubmit({ content: parsed.value, isActive })
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
      noValidate
    >
      <div className="space-y-6">
        <div>
          <Label required>Content (JSON)</Label>
          <Textarea
            value={jsonText}
            onChange={(event) => {
              setJsonText(event.target.value)
              if (parseError) setParseError(null)
            }}
            spellCheck={false}
            invalid={!parsed.ok}
            aria-invalid={!parsed.ok}
            aria-describedby="content-json-hint"
            className="min-h-96 font-mono text-xs leading-relaxed"
          />
          <div id="content-json-hint" className="mt-2 flex flex-wrap items-center gap-3">
            {parsed.ok ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                Valid JSON{summary ? ` — ${summary}` : ''}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
                <Braces className="h-3.5 w-3.5" aria-hidden />
                Invalid JSON
              </span>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                const pretty = stringify(parsed.ok ? parsed.value : row?.content)
                setJsonText(pretty)
                setParseError(null)
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Format JSON
            </Button>
            <Badge tone="muted" className="normal-case tracking-normal">
              The public site reads this block after every save.
            </Badge>
          </div>
          <FieldError message={parseError} />
        </div>

        <div>
          <Checkbox
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            label="Published"
            description="When unchecked, the section falls back to the built-in content."
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-ink-200 pt-6 sm:flex-row sm:justify-end">
          <Button variant="secondary" type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting} disabled={submitting}>
            Save Block
          </Button>
        </div>
      </div>
    </form>
  )
}
