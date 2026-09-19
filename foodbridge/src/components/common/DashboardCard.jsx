import React from 'react'
import { formatNumber } from '../../utils/format'

export default function DashboardCard({ icon: Icon, label, value, suffix = '', trend, tone = 'forest' }) {
  const toneMap = {
    forest: 'bg-forest-700 text-white',
    leaf: 'bg-leaf-100 text-forest-700',
    amber: 'bg-amber-100 text-amber-700',
    white: 'bg-white text-forest-700 border border-forest-100',
  }
  return (
    <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${toneMap[tone]}`}>
          {Icon && <Icon size={18} />}
        </span>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-forest-500' : 'text-berry'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-display font-semibold text-ink truncate">
          {typeof value === 'number' ? formatNumber(value) : value}{suffix}
        </p>
        <p className="text-sm text-ink-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
