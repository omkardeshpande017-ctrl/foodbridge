import React, { useState } from 'react'
import { Navigation, Clock, Gauge } from 'lucide-react'
import MapPanel from '../components/common/MapPanel.jsx'
import { getAllDonations } from '../services/donationService'
import { ngos, volunteers } from '../data/mockData'

const CITY_COORDS = {
  Pune: { lat: 18.5204, lng: 73.8567 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Nagpur: { lat: 21.1458, lng: 79.0882 },
  Nashik: { lat: 20.0, lng: 73.79 },
  Aurangabad: { lat: 19.8762, lng: 75.3433 },
}

export default function MapRoute() {
  const activeDonations = getAllDonations().filter(d => ['Accepted', 'Picked Up', 'In Transit'].includes(d.status))
  const [selectedId, setSelectedId] = useState(activeDonations[0]?.id || null)
  const [optimized, setOptimized] = useState(false)

  const selected = activeDonations.find(d => d.id === selectedId)
  const ngo = ngos.find(n => n.id === selected?.ngoId)
  const volunteer = volunteers.find(v => v.id === selected?.volunteerId)

  const base = CITY_COORDS[selected?.city] || CITY_COORDS.Pune
  const jitter = (seed) => (Math.sin(seed) * 0.01)

  const points = selected ? [
    { lat: base.lat + jitter(1), lng: base.lng + jitter(2), label: `Donor · ${selected.donorName}` },
    { lat: base.lat + jitter(3), lng: base.lng + jitter(4), label: `NGO · ${ngo?.name || 'Unassigned'}` },
    ...(volunteer ? [{ lat: base.lat + jitter(5), lng: base.lng + jitter(6), label: `Volunteer · ${volunteer.name}` }] : []),
  ] : []

  const distanceKm = selected ? (optimized ? Math.max(1, selected.distanceKm * 0.78) : selected.distanceKm) : 0
  const etaMin = Math.round(distanceKm * 3.2)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl text-ink mb-1">Map & route</h2>
        <p className="text-sm text-ink-400">Live positions for donor, NGO and volunteer, with route distance and ETA.</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-4 flex flex-col gap-2 max-h-[420px] overflow-y-auto">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide px-1 mb-1">Active deliveries</p>
          {activeDonations.length === 0 && <p className="text-sm text-ink-400 px-1">No deliveries in progress right now.</p>}
          {activeDonations.map(d => (
            <button
              key={d.id}
              onClick={() => { setSelectedId(d.id); setOptimized(false) }}
              className={`text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                selectedId === d.id ? 'bg-leaf-100 text-forest-700 font-medium' : 'hover:bg-sand-200 text-ink-600'
              }`}
            >
              {d.foodName}
              <span className="block text-xs text-ink-400">{d.city} · {d.status}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {selected ? (
            <>
              <MapPanel points={points} routeLabel={`${distanceKm.toFixed(1)} km · ~${etaMin} min`} height="h-96" />
              <div className="flex flex-wrap items-center gap-4">
                <Stat icon={Gauge} label="Distance" value={`${distanceKm.toFixed(1)} km`} />
                <Stat icon={Clock} label="Estimated travel time" value={`${etaMin} min`} />
                <button
                  onClick={() => setOptimized(true)}
                  disabled={optimized}
                  className="ml-auto inline-flex items-center gap-2 text-sm font-medium bg-forest-700 text-white rounded-full px-5 py-2.5 hover:bg-forest-900 transition-colors disabled:opacity-60"
                >
                  <Navigation size={15} /> {optimized ? 'Route optimized' : 'Optimize Route'}
                </button>
              </div>
            </>
          ) : (
            <div className="bg-sand-100 border border-dashed border-forest-100 rounded-xl2 py-16 text-center text-sm text-ink-400">
              Select an active delivery to view its route.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 bg-white border border-forest-100 rounded-xl px-4 py-2.5">
      <Icon size={16} className="text-forest-700" />
      <div>
        <p className="text-sm font-medium text-ink">{value}</p>
        <p className="text-xs text-ink-400">{label}</p>
      </div>
    </div>
  )
}
