import React from 'react'
import { Package, CheckCircle2, Bike, Clock, Truck, AlertTriangle, Sparkles, Bell } from 'lucide-react'
import { formatRelativeTime } from '../../utils/format'

const ICONS = {
  donation: Package,
  accepted: CheckCircle2,
  volunteer: Bike,
  reminder: Clock,
  delivered: Truck,
  warning: AlertTriangle,
  ai: Sparkles,
  info: Bell,
}

export default function NotificationItem({ notification, onRead }) {
  const Icon = ICONS[notification.type] || Bell
  return (
    <button
      onClick={() => onRead?.(notification.id)}
      className={`w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl transition-colors focus-ring ${
        notification.read ? 'bg-white' : 'bg-leaf-100/60'
      } hover:bg-sand-200 border border-forest-100`}
    >
      <span className="w-8 h-8 rounded-full bg-forest-700 text-white flex items-center justify-center shrink-0">
        <Icon size={15} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-ink truncate">{notification.title}</p>
          {!notification.read && <span className="w-2 h-2 rounded-full bg-forest-500 shrink-0" />}
        </div>
        <p className="text-sm text-ink-400 mt-0.5">{notification.body}</p>
        <p className="text-xs text-ink-400/70 mt-1">{formatRelativeTime(notification.time)}</p>
      </div>
    </button>
  )
}
