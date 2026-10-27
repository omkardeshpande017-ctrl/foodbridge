import React, { useState } from 'react'
import { Eye, Pencil, Power, Search } from 'lucide-react'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Modal from '../../components/common/Modal.jsx'
import { adminUsers } from '../../data/mockData'
import { useToast } from '../../context/ToastContext.jsx'

const ROLES = ['All', 'Donor', 'NGO', 'Volunteer']

export default function UserManagement() {
  const [users, setUsers] = useState(adminUsers)
  const [roleFilter, setRoleFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState(null)
  const { notify } = useToast()

  const filtered = users.filter(u => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false
    if (query && !u.name.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const toggleStatus = (user) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u))
    notify(`${user.name} is now ${user.status === 'Active' ? 'inactive' : 'active'}.`, 'success')
  }

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'location', header: 'Location' },
    { key: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'joined', header: 'Joined Date' },
    {
      key: 'actions', header: 'Actions', render: (r) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setViewing(r)} className="w-8 h-8 rounded-lg hover:bg-sand-200 flex items-center justify-center text-ink-600" title="View">
            <Eye size={15} />
          </button>
          <button onClick={() => notify(`Editing ${r.name} would open an edit form here.`, 'info')} className="w-8 h-8 rounded-lg hover:bg-sand-200 flex items-center justify-center text-ink-600" title="Edit">
            <Pencil size={15} />
          </button>
          <button onClick={() => toggleStatus(r)} className="w-8 h-8 rounded-lg hover:bg-sand-200 flex items-center justify-center text-ink-600" title="Activate/Deactivate">
            <Power size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-1">User management</h2>
      <p className="text-sm text-ink-400 mb-6">Donors, NGOs and volunteers registered on the platform.</p>

      <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name"
            className="pl-9 pr-3 py-2 text-sm border border-forest-100 rounded-lg outline-none focus-ring w-56"
          />
        </div>
        <div className="flex rounded-lg border border-forest-100 overflow-hidden">
          {ROLES.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-2 text-sm font-medium transition-colors ${roleFilter === r ? 'bg-forest-700 text-white' : 'text-ink-600 hover:bg-sand-200'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} rows={filtered} />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name} size="sm">
        {viewing && (
          <div className="flex flex-col gap-3 text-sm">
            <Row label="Role" value={viewing.role} />
            <Row label="Location" value={viewing.location} />
            <Row label="Status" value={<StatusBadge status={viewing.status} />} />
            <Row label="Joined" value={viewing.joined} />
            <Row label="ID" value={viewing.id} />
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
