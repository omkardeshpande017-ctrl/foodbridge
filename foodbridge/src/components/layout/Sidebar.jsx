import React from 'react'
import { NavLink } from 'react-router-dom'
import { Leaf, LogOut, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Sidebar({ items, open, onClose }) {
  const { logout, user } = useAuth()

  return (
    <>
      {open && <div className="fixed inset-0 bg-ink/40 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-forest-900 text-sand-100 flex flex-col z-50 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-leaf-300 text-forest-900 flex items-center justify-center">
              <Leaf size={16} />
            </span>
            <span className="font-display text-lg font-semibold">FoodBridge</span>
          </div>
          <button className="lg:hidden text-sand-100" onClick={onClose}><X size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          {items.map(item => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-leaf-300 text-forest-900' : 'text-sand-100/80 hover:bg-white/10'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 mb-3">
            <span className="w-8 h-8 rounded-full bg-leaf-300 text-forest-900 flex items-center justify-center text-sm font-semibold">
              {user?.name?.[0] || 'U'}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-sand-100/60 capitalize truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-sand-100/80 hover:bg-white/10 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}
