import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Mail, Lock, Truck, Building2, Users, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const ROLES = [
  { id: 'donor', label: 'Donor', icon: Building2 },
  { id: 'ngo', label: 'NGO', icon: ShieldCheck },
  { id: 'volunteer', label: 'Volunteer', icon: Truck },
  { id: 'admin', label: 'Admin', icon: Users },
]

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'donor' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      try {
        const user = login(form)
        notify(`Welcome back, ${user.name.split(' ')[0]}.`, 'success')
        navigate(`/${user.role}/dashboard`)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 450)
  }

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="w-9 h-9 rounded-lg bg-forest-700 text-white flex items-center justify-center">
            <Leaf size={18} />
          </span>
          <span className="font-display text-xl font-semibold text-ink">FoodBridge</span>
        </Link>

        <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-7 sm:p-8">
          <h1 className="font-display text-2xl text-ink text-center">Welcome back</h1>
          <p className="text-sm text-ink-400 text-center mt-1.5">Log in to continue reducing food waste.</p>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-ink-600">I am a</label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {ROLES.map(r => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setForm(f => ({ ...f, role: r.id }))}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-colors ${
                      form.role === r.id ? 'border-forest-700 bg-leaf-100 text-forest-700' : 'border-forest-100 text-ink-400 hover:bg-sand-200'
                    }`}
                  >
                    <r.icon size={16} />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink-600">Email</label>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-forest-100 focus-ring outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink-600">Password</label>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-forest-100 focus-ring outline-none text-sm"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-berry bg-berry/5 border border-berry/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-forest-700 text-white rounded-lg py-3 text-sm font-medium hover:bg-forest-900 transition-colors disabled:opacity-60"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p className="text-xs text-ink-400 text-center mt-3">
            Demo: any email + password works for the selected role.
          </p>
        </div>

        <p className="text-center text-sm text-ink-400 mt-6">
          Don't have an account? <Link to="/register" className="text-forest-700 font-medium">Register</Link>
        </p>
      </div>
    </div>
  )
}
