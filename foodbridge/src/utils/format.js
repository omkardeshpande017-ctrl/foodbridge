export function formatNumber(n) {
  if (n === null || n === undefined) return '—'
  return new Intl.NumberFormat('en-IN').format(n)
}

export function formatRelativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.round(diffHr / 24)
  return `${diffDay}d ago`
}

export function timeUntil(iso) {
  const diffMs = new Date(iso).getTime() - Date.now()
  if (diffMs <= 0) return 'expired'
  const diffHr = Math.floor(diffMs / 3600000)
  const diffMin = Math.round((diffMs % 3600000) / 60000)
  if (diffHr < 1) return `${diffMin}m left`
  return `${diffHr}h ${diffMin}m left`
}
