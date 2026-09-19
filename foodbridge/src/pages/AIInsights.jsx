import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Sparkles, TrendingUp, MapPinned, Building2, Info } from 'lucide-react'
import ChartCard from '../components/common/ChartCard.jsx'
import { donationForecast, surplusAreas, demandAreas, aiRecommendations, initialDonations } from '../data/mockData'

const CITY_BOUNDS = { lat: [18.4, 21.3], lng: [72.7, 79.2] }

function project(lat, lng) {
  const x = ((lng - CITY_BOUNDS.lng[0]) / (CITY_BOUNDS.lng[1] - CITY_BOUNDS.lng[0])) * 100
  const y = 100 - ((lat - CITY_BOUNDS.lat[0]) / (CITY_BOUNDS.lat[1] - CITY_BOUNDS.lat[0])) * 100
  return { x, y }
}

const LEVEL_SIZE = { High: 34, Medium: 24, Low: 16 }

export default function AIInsights() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl text-ink flex items-center gap-2">
            <Sparkles size={20} className="text-forest-700" /> AI insights
          </h2>
          <p className="text-sm text-ink-400 mt-1">Demand forecasts, surplus detection and NGO matching.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-full px-3 py-1.5">
          <Info size={13} /> Demo / mock AI predictions — not connected to a live ML model
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-forest-900 text-sand-100 rounded-xl2 p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs text-leaf-300 flex items-center gap-1.5"><TrendingUp size={13} /> Demand prediction</p>
            <p className="font-display text-3xl mt-2">Predicted food demand in Pune next week: 12,450 meals</p>
            <p className="text-sm text-sand-100/70 mt-3 max-w-lg">
              Based on historical distribution patterns, seasonal trends and current NGO capacity across Pune.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div className="bg-leaf-300 h-2 rounded-full" style={{ width: '92%' }} />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">Prediction Confidence: 92%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-6 flex flex-col gap-3">
          <p className="text-xs text-ink-400 flex items-center gap-1.5"><MapPinned size={13} /> Surplus detection</p>
          <ul className="flex flex-col gap-2.5">
            {surplusAreas.slice(0, 4).map(a => (
              <li key={a.area} className="flex items-center justify-between text-sm">
                <span className="text-ink-600 truncate pr-2">{a.area}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  a.level === 'High' ? 'bg-amber-100 text-amber-700' : a.level === 'Medium' ? 'bg-leaf-100 text-forest-700' : 'bg-sand-200 text-ink-400'
                }`}>{a.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ChartCard title="Donation forecast" subtitle="Actual vs. predicted donation volume (meals)" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={donationForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3EC" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#1B4332" strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
            <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#E9A23B" strokeWidth={2.5} strokeDasharray="5 4" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div>
        <h3 className="font-display text-lg text-ink mb-4 flex items-center gap-2">
          <MapPinned size={17} className="text-forest-700" /> Food surplus & demand heat map
        </h3>
        <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-5">
          <div className="relative w-full h-80 rounded-xl overflow-hidden bg-gradient-to-br from-leaf-100 via-sand-100 to-forest-100">
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Array.from({ length: 9 }).map((_, i) => <line key={`v${i}`} x1={i * 12.5} y1="0" x2={i * 12.5} y2="100" stroke="#40916C" strokeWidth="0.15" />)}
              {Array.from({ length: 7 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 16.6} x2="100" y2={i * 16.6} stroke="#40916C" strokeWidth="0.15" />)}
            </svg>
            {surplusAreas.map(a => {
              const p = project(a.lat, a.lng)
              const size = LEVEL_SIZE[a.level]
              return (
                <div key={`s-${a.area}`} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/40 border-2 border-amber-500"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: size, height: size, backgroundColor: 'rgba(233,162,59,0.35)', borderColor: '#E9A23B' }}
                  title={`Surplus · ${a.area}`} />
              )
            })}
            {demandAreas.map(a => {
              const p = project(a.lat, a.lng)
              const size = LEVEL_SIZE[a.level]
              return (
                <div key={`d-${a.area}`} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, width: size, height: size, backgroundColor: 'rgba(27,67,50,0.35)', border: '2px solid #1B4332' }}
                  title={`Demand · ${a.area}`} />
              )
            })}
          </div>
          <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-ink-600">
            <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: 'rgba(233,162,59,0.5)', border: '2px solid #E9A23B' }} /> Food surplus area</span>
            <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: 'rgba(27,67,50,0.5)', border: '2px solid #1B4332' }} /> Food demand area</span>
            <span className="text-ink-400 text-xs">Circle size reflects intensity (High / Medium / Low)</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-ink mb-4 flex items-center gap-2">
          <Building2 size={17} className="text-forest-700" /> NGO recommendations
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiRecommendations.map(rec => {
            const donation = initialDonations.find(d => d.id === rec.donationId)
            return (
              <div key={rec.donationId} className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-5 flex flex-col gap-2">
                <p className="text-xs text-ink-400">{donation?.foodName} · {rec.donationId}</p>
                <p className="font-display text-ink">Recommended NGO: {rec.ngo}</p>
                <div className="flex items-center justify-between text-sm text-ink-600 mt-1">
                  <span>Distance: {rec.distanceKm} km</span>
                  <span>Capacity: {rec.requiredCapacity} meals</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-sand-200 rounded-full h-1.5">
                    <div className="bg-forest-700 h-1.5 rounded-full" style={{ width: `${rec.confidence}%` }} />
                  </div>
                  <span className="text-xs font-medium text-forest-700 whitespace-nowrap">{rec.confidence}% confidence</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
