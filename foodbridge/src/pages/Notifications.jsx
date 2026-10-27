import React, { useState } from 'react'
import { CheckCheck } from 'lucide-react'
import NotificationItem from '../components/common/NotificationItem.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService'

const FILTERS = ['All', 'Unread', 'Read']

export default function Notifications() {
  const [version, setVersion] = useState(0)
  const [filter, setFilter] = useState('All')
  void version

  const all = getNotifications()
  const filtered = all.filter(n => {
    if (filter === 'Unread') return !n.read
    if (filter === 'Read') return n.read
    return true
  })

  const handleRead = (id) => {
    markAsRead(id)
    setVersion(v => v + 1)
  }

  const handleReadAll = () => {
    markAllAsRead()
    setVersion(v => v + 1)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl text-ink">Notifications</h2>
          <p className="text-sm text-ink-400 mt-1">Stay on top of donations, pickups and AI alerts.</p>
        </div>
        <button
          onClick={handleReadAll}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-900"
        >
          <CheckCheck size={15} /> Mark all as read
        </button>
      </div>

      <div className="flex gap-2 mb-5 border-b border-forest-100">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              filter === f ? 'border-forest-700 text-forest-700' : 'border-transparent text-ink-400 hover:text-ink-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(n => <NotificationItem key={n.id} notification={n} onRead={handleRead} />)}
        </div>
      )}
    </div>
  )
}
