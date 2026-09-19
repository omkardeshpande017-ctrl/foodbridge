import React, { useState } from 'react'
import { Mail, Phone, MapPin, Building2, Pencil, Save } from 'lucide-react'
import Modal from '../components/common/Modal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { getProfileRecord } from '../services/authService'

const STAT_LABELS = {
  donor: [
    ['totalDonated', 'Total Donated (kg)'],
    ['mealsProvided', 'Meals Provided'],
    ['co2Saved', 'CO₂ Saved (kg)'],
  ],
  ngo: [
    ['peopleServed', 'People Served'],
    ['distributions', 'Distributions'],
    ['efficiency', 'Efficiency (%)'],
  ],
  volunteer: [
    ['deliveries', 'Deliveries'],
    ['distanceKm', 'Distance (km)'],
    ['rating', 'Rating'],
  ],
}

export default function Profile() {
  const { user } = useAuth()
  const { notify } = useToast()
  const record = getProfileRecord(user)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: record?.phone || '', location: record?.location || user?.location || '' })

  const stats = STAT_LABELS[user?.role] || []

  const save = (e) => {
    e.preventDefault()
    setEditOpen(false)
    notify('Profile updated.', 'success')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl text-ink mb-6">Profile</h2>

      <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-6 sm:p-8">
        <div className="flex items-start gap-5 flex-wrap">
          <span className="w-16 h-16 rounded-full bg-forest-700 text-white flex items-center justify-center text-2xl font-display shrink-0">
            {form.name?.[0] || 'U'}
          </span>
          <div className="flex-1 min-w-[200px]">
            <h3 className="font-display text-xl text-ink">{form.name}</h3>
            <p className="text-sm text-ink-400 capitalize">{user?.role} account</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-forest-700 bg-leaf-100 rounded-full px-2.5 py-1 mt-2">
              Active
            </span>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium border border-forest-200 text-forest-700 rounded-full px-4 py-2 hover:bg-sand-100 transition-colors"
          >
            <Pencil size={14} /> Edit Profile
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-forest-100">
          <InfoRow icon={Mail} label="Email" value={user?.email} />
          <InfoRow icon={Phone} label="Phone" value={form.phone || '+91 90000 00000'} />
          <InfoRow icon={MapPin} label="Location" value={form.location} />
          <InfoRow icon={Building2} label="Organization" value={record?.name || form.name} />
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-forest-100">
            {stats.map(([key, label]) => (
              <div key={key} className="text-center">
                <p className="font-display text-xl text-ink">{record?.[key] ?? '—'}</p>
                <p className="text-xs text-ink-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        <form onSubmit={save} className="flex flex-col gap-4">
          <Field label="Name">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm outline-none focus-ring" />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm outline-none focus-ring" />
          </Field>
          <Field label="Location">
            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-lg border border-forest-100 text-sm outline-none focus-ring" />
          </Field>
          <button type="submit" className="self-start inline-flex items-center gap-2 bg-forest-700 text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-forest-900 transition-colors">
            <Save size={15} /> Save changes
          </button>
        </form>
      </Modal>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-9 h-9 rounded-lg bg-sand-200 text-forest-700 flex items-center justify-center shrink-0">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm text-ink-600 truncate">{value}</p>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink-600">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}
