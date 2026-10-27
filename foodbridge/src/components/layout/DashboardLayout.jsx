import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import Sidebar from './Sidebar.jsx'
import { unreadCount } from '../../services/notificationService'

export default function DashboardLayout({ items, title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const unread = unreadCount()

  return (
    <div className="min-h-screen flex bg-sand">
      <Sidebar items={items} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur border-b border-forest-100 flex items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-ink" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <h1 className="font-display text-lg text-ink">{title}</h1>
          </div>
          <Link to="/notifications" className="relative w-9 h-9 rounded-full hover:bg-sand-200 flex items-center justify-center focus-ring">
            <Bell size={19} className="text-ink-600" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-berry text-white text-[10px] flex items-center justify-center">
                {unread}
              </span>
            )}
          </Link>
        </header>

        <main className="flex-1 px-5 sm:px-8 py-6 max-w-[1400px] w-full mx-auto">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}
