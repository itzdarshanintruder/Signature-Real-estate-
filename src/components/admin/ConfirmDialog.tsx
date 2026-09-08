import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Accessible destructive/confirm dialog built on the shared Modal. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onCancel}
      label={title}
      className="w-full max-w-md border border-cream-50/10 bg-ink-900 p-8 text-cream-50"
    >
      <h2 className="font-display text-xl text-cream-50">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-relaxed text-cream-50/70">{description}</p> : null}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button variant="primary" onClick={onConfirm} loading={busy}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
