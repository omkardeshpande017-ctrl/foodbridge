import React from 'react'
import { MapPin, Clock, Scale, Building2 } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { timeUntil } from '../../utils/format'

export default function DonationCard({ donation, actions, onViewDetails }) {
  const expiringSoon = new Date(donation.expiresAt).getTime() - Date.now() < 3 * 3600 * 1000

  return (
    <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-5 flex flex-col gap-4 animate-rise">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-display text-lg text-ink leading-snug">{donation.foodName}</h4>
          <p className="text-xs text-ink-400 mt-0.5">{donation.category} · {donation.id}</p>
        </div>
        <StatusBadge status={donation.status} />
      </div>

      <p className="text-sm text-ink-600 line-clamp-2">{donation.description}</p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-ink-600">
          <Scale size={15} className="text-forest-500 shrink-0" />
          <span>{donation.quantity} {donation.unit}</span>
        </div>
        <div className="flex items-center gap-2 text-ink-600">
          <Building2 size={15} className="text-forest-500 shrink-0" />
          <span className="truncate">{donation.donorName}</span>
        </div>
        <div className="flex items-center gap-2 text-ink-600">
          <MapPin size={15} className="text-forest-500 shrink-0" />
          <span className="truncate">{donation.location} · {donation.distanceKm}km</span>
        </div>
        <div className={`flex items-center gap-2 ${expiringSoon ? 'text-berry' : 'text-ink-600'}`}>
          <Clock size={15} className={expiringSoon ? 'text-berry shrink-0' : 'text-forest-500 shrink-0'} />
          <span>{timeUntil(donation.expiresAt)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {actions}
        <button
          onClick={() => onViewDetails?.(donation)}
          className="ml-auto text-sm font-medium text-forest-700 hover:text-forest-900 focus-ring rounded px-2 py-1"
        >
          View details
        </button>
      </div>
    </div>
  )
}
