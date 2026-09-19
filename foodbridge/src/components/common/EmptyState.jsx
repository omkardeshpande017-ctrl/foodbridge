import React from 'react'
import { PackageOpen } from 'lucide-react'

export default function EmptyState({ icon: Icon = PackageOpen, title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-xl2 border border-dashed border-forest-100 bg-sand-100">
      <span className="w-12 h-12 rounded-full bg-leaf-100 text-forest-700 flex items-center justify-center mb-3">
        <Icon size={22} />
      </span>
      <h4 className="font-display text-base text-ink">{title}</h4>
      {description && <p className="text-sm text-ink-400 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
