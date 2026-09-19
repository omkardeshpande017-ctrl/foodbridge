import React from 'react'

export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl2 border border-forest-100 shadow-soft p-5 flex flex-col gap-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base text-ink">{title}</h3>
          {subtitle && <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="w-full h-64">{children}</div>
    </div>
  )
}
