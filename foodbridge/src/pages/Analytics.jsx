import React, { useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { Package, Truck, Leaf, Users2, Building2, Bike, Wind, ShieldCheck } from 'lucide-react'
import DashboardCard from '../components/common/DashboardCard.jsx'
import ChartCard from '../components/common/ChartCard.jsx'
import {
  donationTrend, monthlyDonations, donationsByCity, foodCategoryDistribution,
  ngoPerformance, volunteerPerformance, CITIES, FOOD_CATEGORIES,
} from '../data/mockData'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const COLORS = ['#1B4332', '#40916C', '#74C69D', '#A9E2C4', '#E9A23B', '#B3492B']
const RANGE_OPTIONS = ['Daily', 'Weekly', 'Monthly']

export default function Analytics() {
  const { user } = useAuth()
  const [range, setRange] = useState('Weekly')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')

  const body = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Analytics dashboard</h2>
          <p className="text-sm text-ink-400 mt-1">Donation, distribution and impact metrics across the network.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-forest-100 overflow-hidden">
          {RANGE_OPTIONS.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3.5 py-2 text-sm font-medium transition-colors ${range === r ? 'bg-forest-700 text-white' : 'text-ink-600 hover:bg-sand-200'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <select value={city} onChange={e => setCity(e.target.value)} className="text-sm border border-forest-100 rounded-lg px-3 py-2 outline-none focus-ring">
          <option value="">All cities</option>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)} className="text-sm border border-forest-100 rounded-lg px-3 py-2 outline-none focus-ring">
          <option value="">All categories</option>
          {FOOD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input type="date" className="text-sm border border-forest-100 rounded-lg px-3 py-2 outline-none focus-ring" />
        <span className="text-ink-400 text-sm">to</span>
        <input type="date" className="text-sm border border-forest-100 rounded-lg px-3 py-2 outline-none focus-ring" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Package} label="Total Donations" value={8420} tone="forest" trend={12} />
        <DashboardCard icon={Truck} label="Food Distributed (kg)" value={118900} tone="leaf" trend={9} />
        <DashboardCard icon={Leaf} label="Food Waste Prevented (kg)" value={9500} tone="amber" trend={-4} />
        <DashboardCard icon={ShieldCheck} label="Active NGOs" value={480} tone="white" trend={3} />
        <DashboardCard icon={Building2} label="Active Donors" value={3120} tone="white" trend={6} />
        <DashboardCard icon={Bike} label="Active Volunteers" value={1240} tone="white" trend={8} />
        <DashboardCard icon={Wind} label="Est. CO₂ Reduction (t)" value={412} tone="forest" trend={5} />
        <DashboardCard icon={Users2} label="People Served" value={512600} tone="leaf" trend={11} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Food Donation Trend" subtitle={`${range} donated volume`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={donationTrend}>
              <defs>
                <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B4332" stopOpacity={0.3} /><stop offset="100%" stopColor="#1B4332" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3EC" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="donated" stroke="#1B4332" fill="url(#a1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Food Distribution Trend" subtitle={`${range} distributed volume`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={donationTrend}>
              <defs>
                <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E9A23B" stopOpacity={0.35} /><stop offset="100%" stopColor="#E9A23B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3EC" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="distributed" stroke="#E9A23B" fill="url(#a2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Food Wasted vs Donated" subtitle="Volume comparison, this week">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={donationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3EC" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="donated" name="Donated" fill="#40916C" radius={[6, 6, 0, 0]} />
              <Bar dataKey="wasted" name="Wasted" fill="#B3492B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Donations by City" subtitle="Total volume (kg)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={donationsByCity} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3EC" />
              <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="city" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="value" fill="#1B4332" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="NGO Performance" subtitle="Distribution efficiency (%)">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={ngoPerformance}>
              <PolarGrid stroke="#D2E7DB" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#5C6B62' }} />
              <Radar dataKey="efficiency" stroke="#1B4332" fill="#40916C" fillOpacity={0.4} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Donations" subtitle="Meals equivalent">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyDonations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3EC" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Line type="monotone" dataKey="meals" stroke="#1B4332" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Food Category Distribution" subtitle="Share of total donated volume">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={foodCategoryDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {foodCategoryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Volunteer Delivery Performance" subtitle="Deliveries completed">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volunteerPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3EC" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="deliveries" fill="#74C69D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )

  if (!user) {
    return (
      <div className="bg-sand min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">{body}</div>
        <Footer />
      </div>
    )
  }

  return body
}
