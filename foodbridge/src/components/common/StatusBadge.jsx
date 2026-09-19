import React from 'react'

const STYLES = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Accepted: 'bg-leaf-100 text-forest-700 border-leaf-300',
  'Picked Up': 'bg-blue-50 text-blue-700 border-blue-200',
  'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-forest-100 text-forest-700 border-forest-300',
  Active: 'bg-leaf-100 text-forest-700 border-leaf-300',
  Inactive: 'bg-ink-600/5 text-ink-400 border-ink-600/10',
  'On Delivery': 'bg-blue-50 text-blue-700 border-blue-200',
  Expired: 'bg-berry/10 text-berry border-berry/20',
}

export default function StatusBadge({ status, className = '' }) {
  const style = STYLES[status] || 'bg-ink-600/5 text-ink-400 border-ink-600/10'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  )
}
