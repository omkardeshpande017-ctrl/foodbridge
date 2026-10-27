import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { createDonation } from '../../services/donationService'
import { pushNotification } from '../../services/notificationService'
import { FOOD_CATEGORIES, CITIES } from '../../data/mockData'

const UNITS = ['kg', 'litres', 'boxes', 'plates', 'packets']

const initialForm = {
  foodName: '', category: FOOD_CATEGORIES[0], quantity: '', unit: 'kg', description: '',
  preparationDate: '', expiryTime: '', city: CITIES[0], location: '', pickupDate: '', pickupTime: '', notes: '',
}

export default function DonateFood() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [imageName, setImageName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.foodName.trim()) next.foodName = 'Food name is required.'
    if (!form.quantity || Number(form.quantity) <= 0) next.quantity = 'Enter a valid quantity.'
    if (!form.description.trim()) next.description = 'Add a short description.'
    if (!form.location.trim()) next.location = 'Pickup location is required.'
    if (!form.pickupDate) next.pickupDate = 'Select a pickup date.'
    if (!form.pickupTime) next.pickupTime = 'Select a pickup time.'
    if (!form.expiryTime) next.expiryTime = 'Set an expiry / safe-use time.'
    return next
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    setTimeout(() => {
      const expiresAt = new Date(`${form.pickupDate}T${form.expiryTime}`).toISOString()
      const donation = createDonation({
        foodName: form.foodName,
        category: form.category,
        quantity: Number(form.quantity),
        unit: form.unit,
        description: form.description,
        donorId: user.id,
        donorName: user.name,
        city: form.city,
        location: form.location,
        preparedAt: form.preparationDate ? new Date(form.preparationDate).toISOString() : new Date().toISOString(),
        expiresAt,
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        notes: form.notes,
      })
      pushNotification({
        title: 'Donation posted',
        body: `${donation.foodName} (${donation.quantity}${donation.unit}) is now visible to nearby NGOs.`,
        type: 'donation',
      })
      notify('Donation posted successfully.', 'success')
      setSubmitting(false)
      navigate('/donor/donations')
    }, 500)
  }

  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-2xl text-ink mb-1">Donate food</h2>
      <p className="text-sm text-ink-400 mb-6">Tell us what you have — nearby NGOs will be matched automatically.</p>

      <form onSubmit={onSubmit} noValidate className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-6 sm:p-8 flex flex-col gap-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Food name" error={errors.foodName}>
            <input value={form.foodName} onChange={set('foodName')} className={inputClass(errors.foodName)} placeholder="e.g. Vegetable Biryani" />
          </Field>
          <Field label="Food category">
            <select value={form.category} onChange={set('category')} className={inputClass()}>
              {FOOD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Quantity" error={errors.quantity}>
            <input type="number" min="1" value={form.quantity} onChange={set('quantity')} className={inputClass(errors.quantity)} placeholder="e.g. 40" />
          </Field>
          <Field label="Unit">
            <select value={form.unit} onChange={set('unit')} className={inputClass()}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </Field>
          <Field label="City">
            <select value={form.city} onChange={set('city')} className={inputClass()}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Food description" error={errors.description}>
          <textarea value={form.description} onChange={set('description')} rows={3} className={inputClass(errors.description)} placeholder="Describe the food, dietary notes, packaging, etc." />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Preparation date">
            <input type="date" value={form.preparationDate} onChange={set('preparationDate')} className={inputClass()} />
          </Field>
          <Field label="Expiry / safe-use time" error={errors.expiryTime}>
            <input type="time" value={form.expiryTime} onChange={set('expiryTime')} className={inputClass(errors.expiryTime)} />
          </Field>
        </div>

        <Field label="Pickup location" error={errors.location}>
          <input value={form.location} onChange={set('location')} className={inputClass(errors.location)} placeholder="e.g. Koregaon Park, Pune" />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Pickup date" error={errors.pickupDate}>
            <input type="date" value={form.pickupDate} onChange={set('pickupDate')} className={inputClass(errors.pickupDate)} />
          </Field>
          <Field label="Pickup time" error={errors.pickupTime}>
            <input type="time" value={form.pickupTime} onChange={set('pickupTime')} className={inputClass(errors.pickupTime)} />
          </Field>
        </div>

        <Field label="Image upload (optional)">
          <label className="flex items-center gap-3 border border-dashed border-forest-200 rounded-lg px-4 py-4 cursor-pointer hover:bg-sand-100 transition-colors">
            <span className="w-9 h-9 rounded-lg bg-leaf-100 text-forest-700 flex items-center justify-center shrink-0">
              {imageName ? <ImageIcon size={16} /> : <UploadCloud size={16} />}
            </span>
            <span className="text-sm text-ink-400 truncate">{imageName || 'Click to upload a photo of the food (not stored in this demo)'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageName(e.target.files?.[0]?.name || '')} />
          </label>
        </Field>

        <Field label="Additional notes (optional)">
          <textarea value={form.notes} onChange={set('notes')} rows={2} className={inputClass()} placeholder="Anything a volunteer or NGO should know." />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="self-start bg-forest-700 text-white rounded-full px-7 py-3 text-sm font-medium hover:bg-forest-900 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Posting…' : 'Post Donation'}
        </button>
      </form>
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
