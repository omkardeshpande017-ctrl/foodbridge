import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Building2, ShieldCheck, Truck, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { CITIES } from '../../data/mockData'

const ROLES = [
  { id: 'donor', label: 'Donor', icon: Building2, nameLabel: 'Full name / Restaurant name' },
  { id: 'ngo', label: 'NGO', icon: ShieldCheck, nameLabel: 'Organization name' },
  { id: 'volunteer', label: 'Volunteer', icon: Truck, nameLabel: 'Full name' },
  { id: 'admin', label: 'Admin', icon: Users, nameLabel: 'Full name' },
]

const initialForm = { name: '', email: '', phone: '', password: '', confirm: '', location: '', role: 'donor' }

export default function Register() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()

  const activeRole = ROLES.find(r => r.id === form.role)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'This field is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!/^\+?\d[\d\s-]{7,}$/.test(form.phone)) next.phone = 'Enter a valid phone number.'
    if (form.password.length < 6) next.password = 'Use at least 6 characters.'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'
    if (!form.location) next.location = 'Select your city.'
    return next
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    setTimeout(() => {
      const user = register(form)
      notify(`Account created — welcome to FoodBridge, ${user.name.split(' ')[0]}.`, 'success')
      navigate(`/${user.role}/dashboard`)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="w-9 h-9 rounded-lg bg-forest-700 text-white flex items-center justify-center">
            <Leaf size={18} />
          </span>
          <span className="font-display text-xl font-semibold text-ink">FoodBridge</span>
        </Link>

        <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-7 sm:p-8">
          <h1 className="font-display text-2xl text-ink text-center">Create your account</h1>
          <p className="text-sm text-ink-400 text-center mt-1.5">Join as a donor, NGO, volunteer or admin.</p>

          <form onSubmit={onSubmit} noValidate className="mt-7 flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-ink-600">I want to join as</label>
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

            <Field label={activeRole.nameLabel} error={errors.name}>
              <input value={form.name} onChange={set('name')} className={inputClass(errors.name)} placeholder="e.g. Ananya Rao" />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email" error={errors.email}>
                <input type="email" value={form.email} onChange={set('email')} className={inputClass(errors.email)} placeholder="you@example.com" />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input value={form.phone} onChange={set('phone')} className={inputClass(errors.phone)} placeholder="+91 98200 00000" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Password" error={errors.password}>
                <input type="password" value={form.password} onChange={set('password')} className={inputClass(errors.password)} placeholder="••••••••" />
              </Field>
              <Field label="Confirm password" error={errors.confirm}>
                <input type="password" value={form.confirm} onChange={set('confirm')} className={inputClass(errors.confirm)} placeholder="••••••••" />
              </Field>
            </div>

            <Field label="Location" error={errors.location}>
              <select value={form.location} onChange={set('location')} className={inputClass(errors.location)}>
                <option value="">Select your city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="bg-forest-700 text-white rounded-lg py-3 text-sm font-medium hover:bg-forest-900 transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-400 mt-6">
          Already have an account? <Link to="/login" className="text-forest-700 font-medium">Login</Link>
        </p>
      </div>
    </div>
  )
}

function inputClass(error) {
  return `w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none focus-ring ${error ? 'border-berry' : 'border-forest-100'}`
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink-600">{label}</label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="text-xs text-berry mt-1">{error}</p>}
    </div>
  )
}
