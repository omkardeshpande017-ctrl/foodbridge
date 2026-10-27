import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DonationCard from '../../components/common/DonationCard.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Modal from '../../components/common/Modal.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getDonationsByDonor } from '../../services/donationService'

const TABS = [
  { id: 'active', label: 'Active', statuses: ['Pending', 'Accepted', 'Picked Up', 'In Transit'] },
  { id: 'history', label: 'History', statuses: ['Delivered'] },
]

export default function MyDonations() {
  const [tab, setTab] = useState('active')
  const [selected, setSelected] = useState(null)
  const { user } = useAuth()
  const donations = getDonationsByDonor(user.id)

  const activeTab = TABS.find(t => t.id === tab)
  const filtered = donations.filter(d => activeTab.statuses.includes(d.status))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-display text-2xl text-ink">My donations</h2>
        <Link to="/donor/donate" className="text-sm font-medium bg-forest-700 text-white rounded-full px-5 py-2.5">Donate food</Link>
      </div>

      <div className="flex gap-2 mb-6 border-b border-forest-100">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-forest-700 text-forest-700' : 'border-transparent text-ink-400 hover:text-ink-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={`No ${activeTab.label.toLowerCase()} donations`} description="Donations you post will show up here as they move through the pipeline." />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(d => (
            <DonationCard key={d.id} donation={d} onViewDetails={setSelected} />
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.foodName} size="md">
        {selected && (
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-400">Status</span>
              <StatusBadge status={selected.status} />
            </div>
            <Row label="Donation ID" value={selected.id} />
            <Row label="Category" value={selected.category} />
            <Row label="Quantity" value={`${selected.quantity} ${selected.unit}`} />
            <Row label="Pickup location" value={selected.location} />
            <Row label="Pickup date & time" value={`${selected.pickupDate} · ${selected.pickupTime}`} />
            <Row label="NGO" value={selected.ngoId || 'Not yet accepted'} />
            <Row label="Volunteer" value={selected.volunteerId || 'Not yet assigned'} />
            <div>
              <p className="text-ink-400 mb-1">Description</p>
              <p className="text-ink-600">{selected.description}</p>
            </div>
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
