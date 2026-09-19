import React, { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import DonationCard from '../../components/common/DonationCard.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Modal from '../../components/common/Modal.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { getAvailableDonations, acceptDonation } from '../../services/donationService'
import { pushNotification } from '../../services/notificationService'
import { FOOD_CATEGORIES } from '../../data/mockData'

export default function NearbyDonations() {
  const [filters, setFilters] = useState({ distance: 15, category: '', quantity: '', expiry: '' })
  const [selected, setSelected] = useState(null)
  const [version, setVersion] = useState(0)
  const { user } = useAuth()
  const { notify } = useToast()

  const donations = useMemo(() => {
    void version
    return getAvailableDonations({
      category: filters.category || undefined,
      maxDistance: filters.distance,
    }).filter(d => {
      if (filters.quantity && d.quantity < Number(filters.quantity)) return false
      if (filters.expiry === 'urgent' && new Date(d.expiresAt) - Date.now() > 6 * 3600 * 1000) return false
      return true
    })
  }, [filters, version])

  const handleAccept = (donation) => {
    acceptDonation(donation.id, user.id)
    pushNotification({ title: 'Donation accepted', body: `${user.name} accepted ${donation.foodName} (${donation.id}).`, type: 'accepted' })
    notify(`Accepted ${donation.foodName}. A volunteer will be assigned shortly.`, 'success')
    setVersion(v => v + 1)
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-1">Nearby donations</h2>
      <p className="text-sm text-ink-400 mb-6">Filter by distance, category and expiry to find the right match for your capacity.</p>

      <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-4 mb-6 flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-1.5 text-sm font-medium text-ink-600"><SlidersHorizontal size={15} /> Filters</span>

        <select
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          className="text-sm border border-forest-100 rounded-lg px-3 py-2 outline-none focus-ring"
        >
          <option value="">All categories</option>
          {FOOD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <label className="flex items-center gap-2 text-sm text-ink-600">
          Distance ≤
          <input
            type="range" min="1" max="20" value={filters.distance}
            onChange={e => setFilters(f => ({ ...f, distance: Number(e.target.value) }))}
            className="accent-forest-700"
          />
          {filters.distance} km
        </label>

        <input
          type="number" placeholder="Min quantity"
          value={filters.quantity}
          onChange={e => setFilters(f => ({ ...f, quantity: e.target.value }))}
          className="text-sm border border-forest-100 rounded-lg px-3 py-2 w-32 outline-none focus-ring"
        />

        <select
          value={filters.expiry}
          onChange={e => setFilters(f => ({ ...f, expiry: e.target.value }))}
          className="text-sm border border-forest-100 rounded-lg px-3 py-2 outline-none focus-ring"
        >
          <option value="">Any expiry window</option>
          <option value="urgent">Expiring within 6h</option>
        </select>
      </div>

      {donations.length === 0 ? (
        <EmptyState title="No donations match your filters" description="Try widening the distance range or clearing a filter." />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {donations.map(d => (
            <DonationCard
              key={d.id}
              donation={d}
              onViewDetails={setSelected}
              actions={
                <button
                  onClick={() => handleAccept(d)}
                  className="text-sm font-medium bg-forest-700 text-white rounded-full px-4 py-2 hover:bg-forest-900 transition-colors"
                >
                  Accept Donation
                </button>
              }
            />
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.foodName}>
        {selected && (
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-400">Status</span>
              <StatusBadge status={selected.status} />
            </div>
            <Row label="Donor" value={selected.donorName} />
            <Row label="Quantity" value={`${selected.quantity} ${selected.unit}`} />
            <Row label="Location" value={`${selected.location} · ${selected.distanceKm}km`} />
            <Row label="Pickup" value={`${selected.pickupDate} · ${selected.pickupTime}`} />
            <p className="text-ink-600">{selected.description}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-400">{label}</span>
      <span className="text-ink-600 font-medium">{value}</span>
    </div>
  )
}
