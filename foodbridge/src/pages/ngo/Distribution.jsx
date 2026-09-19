import React from 'react'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getDonationsByNgo } from '../../services/donationService'

export default function Distribution() {
  const { user } = useAuth()
  const donations = getDonationsByNgo(user.id)

  const columns = [
    { key: 'id', header: 'Donation' },
    { key: 'foodName', header: 'Food' },
    { key: 'donorName', header: 'Donor' },
    { key: 'quantity', header: 'Qty', render: r => `${r.quantity} ${r.unit}` },
    { key: 'volunteerId', header: 'Volunteer', render: r => r.volunteerId || '—' },
    { key: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
  ]

  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-1">Distribution tracking</h2>
      <p className="text-sm text-ink-400 mb-6">All donations your organization has accepted, from pickup through delivery.</p>
      <DataTable columns={columns} rows={donations} emptyLabel="No accepted donations yet" />
    </div>
  )
}
