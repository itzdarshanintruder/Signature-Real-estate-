import { useRef, useState, type DragEvent, type ChangeEvent } from 'react'
import { CloudUpload, ImageUp, LoaderCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 8 * 1024 * 1024 // 8 MB
const ACCEPT_ATTR = 'image/jpeg,image/png,image/webp'

interface GalleryUploaderProps {
  busy: boolean
  onUpload: (files: File[]) => void
}

function isAccepted(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type)
}

/** Drag-and-drop / browse upload zone with client-side type + size checks. */
export function GalleryUploader({ busy, onUpload }: GalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const files = Array.from(fileList)

    const rejectedType = files.filter((file) => !isAccepted(file))
    const rejectedSize = files.filter((file) => isAccepted(file) && file.size > MAX_SIZE_BYTES)
    const valid = files.filter((file) => isAccepted(file) && file.size <= MAX_SIZE_BYTES)

    if (rejectedType.length > 0) {
      setError(`Only JPG, PNG and WEBP images are allowed. (${rejectedType.map((f) => f.name).join(', ')})`)
    } else if (rejectedSize.length > 0) {
      setError(`Some images exceed the 8 MB limit. (${rejectedSize.map((f) => f.name).join(', ')})`)
    } else {
      setError(null)
    }

    if (valid.length > 0) {
      onUpload(valid)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files)
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload gallery images — drag and drop, or browse files"
        aria-busy={busy || undefined}
        onDragOver={(event) => {
          event.preventDefault()
          if (!busy) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onClick={() => {
          if (!busy) inputRef.current?.click()
        }}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-ink-300 bg-cream-50 px-6 py-12 text-center transition-colors duration-300',
          isDragging && 'border-gold-500 bg-gold-50',
          busy && 'cursor-wait opacity-70',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          className="sr-only"
          onChange={onChange}
          disabled={busy}
        />

        {busy ? (
          <LoaderCircle className="h-8 w-8 animate-spin text-gold-600" aria-hidden />
        ) : (
          <CloudUpload
            className={cn('h-8 w-8', isDragging ? 'text-gold-600' : 'text-ink-400')}
            aria-hidden
          />
        )}

        {busy ? (
          <p className="mt-3 font-semibold text-ink-700">Uploading images…</p>
        ) : (
          <>
            <p className="mt-3 font-semibold text-ink-800">
              Drag &amp; drop images here <span className="mx-1 text-ink-400">or</span>
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-gold-700">
              <ImageUp className="h-4 w-4" aria-hidden />
              Browse Files
            </p>
          </>
        )}

        <p className="mt-4 text-xs text-ink-500">JPG · JPEG · PNG · WEBP — up to 8 MB each</p>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  )
}
