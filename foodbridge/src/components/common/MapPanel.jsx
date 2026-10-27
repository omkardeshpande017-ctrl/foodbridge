import React from 'react'
import { MapPin, Navigation } from 'lucide-react'

// A realistic mock map surface. Swap the SVG canvas below for a <GoogleMap /> from
// @react-google-maps/api once VITE_GOOGLE_MAPS_KEY is configured — markers/points
// already carry lat/lng so the wiring is a drop-in replacement.
export default function MapPanel({ points = [], routeLabel, height = 'h-80' }) {
  const minLat = Math.min(...points.map(p => p.lat)) - 0.02
  const maxLat = Math.max(...points.map(p => p.lat)) + 0.02
  const minLng = Math.min(...points.map(p => p.lng)) - 0.02
  const maxLng = Math.max(...points.map(p => p.lng)) + 0.02

  const project = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng || 1)) * 100
    const y = 100 - ((lat - minLat) / (maxLat - minLat || 1)) * 100
    return { x, y }
  }

  const projected = points.map(p => ({ ...p, ...project(p.lat, p.lng) }))

  return (
    <div className={`relative w-full ${height} rounded-xl2 overflow-hidden border border-forest-100 bg-gradient-to-br from-leaf-100 via-sand-100 to-forest-100`}>
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 12.5} y1="0" x2={i * 12.5} y2="100" stroke="#40916C" strokeWidth="0.15" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 16.6} x2="100" y2={i * 16.6} stroke="#40916C" strokeWidth="0.15" />
        ))}
      </svg>

      {projected.length > 1 && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={projected.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#1B4332"
            strokeWidth="0.6"
            strokeDasharray="2 1.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      {projected.map((p, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <div className="bg-white rounded-lg shadow-soft px-2 py-1 text-[11px] font-medium text-ink whitespace-nowrap mb-1 border border-forest-100">
            {p.label}
          </div>
          <MapPin size={22} className="text-forest-700 fill-leaf-300" strokeWidth={1.5} />
        </div>
      ))}

      {routeLabel && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2 text-xs font-medium text-forest-700 shadow-soft">
          <Navigation size={14} />
          {routeLabel}
        </div>
      )}
    </div>
  )
}
