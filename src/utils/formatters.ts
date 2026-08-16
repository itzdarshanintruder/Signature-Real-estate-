/**
 * Format an INR amount into a compact luxury-real-estate label.
 * 90_000_000 -> "₹9.0 Cr" · 900_000 -> "₹9.0 Lakh"
 */
export function formatCurrencyInr(value: number): string {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(1)} Cr`
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1)} Lakh`
  return `₹${value.toLocaleString('en-IN')}`
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  return phone
}

/** Format a plot area in square feet, e.g. `2400 -> "2,400 sq. ft."`. */
export function formatSqFt(area: number): string {
  return `${area.toLocaleString('en-IN')} sq. ft.`
}

/** Compact locale date/time label for table rows, e.g. `28 Jul, 3:45 pm`. */
export function formatUpdatedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

/** Human-friendly byte size, e.g. `1.2 MB`. */
export function formatBytes(bytes?: number): string {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`
}
