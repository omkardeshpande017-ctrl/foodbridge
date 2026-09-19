import { readStore, writeStore, seedOnce } from '../utils/storage'
import { initialNotifications } from '../data/mockData'

const KEY = 'notifications'

seedOnce(KEY, initialNotifications)

export function getNotifications() {
  return readStore(KEY, initialNotifications)
}

export function markAsRead(id) {
  const next = getNotifications().map(n => (n.id === id ? { ...n, read: true } : n))
  writeStore(KEY, next)
  return next
}

export function markAllAsRead() {
  const next = getNotifications().map(n => ({ ...n, read: true }))
  writeStore(KEY, next)
  return next
}

export function pushNotification({ title, body, type = 'info' }) {
  const notif = { id: `NTF-${Date.now()}`, title, body, type, read: false, time: new Date().toISOString() }
  const next = [notif, ...getNotifications()]
  writeStore(KEY, next)
  return notif
}

export function unreadCount() {
  return getNotifications().filter(n => !n.read).length
}
