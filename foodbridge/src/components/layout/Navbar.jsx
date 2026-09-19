import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Leaf, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/#impact', label: 'Impact' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/#about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const dashboardPath = user ? `/${user.role}/dashboard` : '/login'

  return (
    <header className="sticky top-0 z-50 bg-sand-100/90 backdrop-blur border-b border-forest-100">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-forest-700 text-white flex items-center justify-center">
            <Leaf size={17} />
          </span>
          <span className="font-display text-lg font-semibold text-ink">FoodBridge</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map(l => (
            <NavLink
              key={l.label}
              to={l.to}
              className="text-sm text-ink-600 hover:text-forest-700 transition-colors"
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate(dashboardPath)}
              className="text-sm font-medium bg-forest-700 text-white rounded-full px-5 py-2.5 hover:bg-forest-900 transition-colors focus-ring"
            >
              Go to dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-600 hover:text-forest-700 px-3 py-2">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-forest-700 text-white rounded-full px-5 py-2.5 hover:bg-forest-900 transition-colors focus-ring"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden text-ink" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-forest-100 bg-sand-100 px-5 py-4 flex flex-col gap-1">
          {LINKS.map(l => (
            <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="py-2.5 text-sm text-ink-600">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3">
            <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center text-sm font-medium border border-forest-200 rounded-full px-4 py-2.5">
              Login
            </Link>
            <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center text-sm font-medium bg-forest-700 text-white rounded-full px-4 py-2.5">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
