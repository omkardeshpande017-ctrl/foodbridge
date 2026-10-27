import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, PackageSearch, Radar, BrainCircuit, Route as RouteIcon,
  LineChart as LineChartIcon, ShieldCheck, ArrowDown, Utensils, Users2, Building2, Leaf, Wind,
} from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, BarChart, Bar, CartesianGrid, YAxis } from 'recharts'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import { platformStats, donationTrend, donationsByCity } from '../data/mockData'
import { formatNumber } from '../utils/format'

const STAT_ITEMS = [
  { label: 'Food Donated', value: platformStats.foodDonatedKg, suffix: ' kg', icon: Utensils },
  { label: 'Meals Served', value: platformStats.mealsServed, suffix: '', icon: Users2 },
  { label: 'Active Donors', value: platformStats.activeDonors, suffix: '', icon: Building2 },
  { label: 'NGOs Connected', value: platformStats.ngosConnected, suffix: '', icon: ShieldCheck },
  { label: 'Food Saved', value: platformStats.foodSavedKg, suffix: ' kg', icon: Leaf },
  { label: 'CO₂ Reduction', value: platformStats.co2ReducedTons, suffix: ' t', icon: Wind },
]

const STEPS = [
  { title: 'Donor posts surplus food', description: 'Restaurants, caterers, retailers and individuals list surplus food with quantity, category and pickup window.' },
  { title: 'NGO accepts the donation', description: 'Nearby NGOs see matched donations ranked by distance, capacity and expiry, and accept in one tap.' },
  { title: 'Volunteer picks it up', description: 'A volunteer is assigned automatically, with a route from the donor to the receiving NGO.' },
  { title: 'Food reaches people in need', description: 'Delivery is tracked in real time until the food is distributed and the loop is closed.' },
]

const FEATURES = [
  { title: 'Real-Time Donation Tracking', description: 'Every donation moves through a live status pipeline — pending, accepted, picked up, delivered.', icon: PackageSearch },
  { title: 'Smart Donation Matching', description: 'Donations are matched to NGOs by distance, capacity and food category automatically.', icon: Radar },
  { title: 'AI Demand Prediction', description: 'Forecast meal demand by city so NGOs can plan capacity ahead of time.', icon: BrainCircuit },
  { title: 'Route Optimization', description: 'Volunteers get the shortest viable route between donor and NGO drop-off points.', icon: RouteIcon },
  { title: 'Analytics Dashboard', description: 'City, category and time-based breakdowns of donations, waste and distribution efficiency.', icon: LineChartIcon },
  { title: 'NGO Performance Monitoring', description: 'Track response time, distribution efficiency and rating across every partner NGO.', icon: ShieldCheck },
]

export default function LandingPage() {
  return (
    <div className="bg-sand">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-forest-700 bg-leaf-100 rounded-full px-3.5 py-1.5 mb-6">
              <Leaf size={14} /> Rescuing surplus food, one route at a time
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] text-ink font-semibold max-w-xl">
              Turn Surplus Food Into Meaningful Impact
            </h1>
            <p className="mt-5 text-lg text-ink-600 max-w-lg leading-relaxed">
              Connect food donors with NGOs and volunteers to reduce food waste and deliver surplus food to people who need it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-forest-700 text-white rounded-full px-6 py-3.5 text-sm font-medium hover:bg-forest-900 transition-colors"
              >
                Donate Food <ArrowRight size={16} />
              </Link>
              <Link
                to="/analytics"
                className="inline-flex items-center gap-2 border border-forest-200 text-forest-700 rounded-full px-6 py-3.5 text-sm font-medium hover:bg-white transition-colors"
              >
                Explore Platform
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl2 border border-forest-100 shadow-lift p-6 animate-rise">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-ink-400">Today across the network</p>
                  <p className="font-display text-2xl text-ink">4,820 meals in motion</p>
                </div>
                <span className="w-10 h-10 rounded-full bg-leaf-100 text-forest-700 flex items-center justify-center">
                  <Utensils size={18} />
                </span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={donationTrend}>
                    <defs>
                      <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#40916C" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#40916C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#5C6B62' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #D2E7DB', fontSize: 12 }} />
                    <Area type="monotone" dataKey="donated" stroke="#1B4332" strokeWidth={2} fill="url(#heroFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-forest-100">
                {[{ l: 'Pending pickups', v: '12' }, { l: 'On the way', v: '27' }, { l: 'Delivered today', v: '184' }].map(s => (
                  <div key={s.l}>
                    <p className="font-display text-lg text-ink">{s.v}</p>
                    <p className="text-xs text-ink-400">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-forest-700 text-white rounded-xl2 shadow-lift px-5 py-4 hidden sm:block">
              <p className="text-xs text-leaf-300">Route optimized</p>
              <p className="font-display text-lg">2.4 km · 9 min</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="impact" className="border-y border-forest-100 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
            {STAT_ITEMS.map(s => (
              <div key={s.label} className="text-center">
                <span className="inline-flex w-10 h-10 rounded-full bg-leaf-100 text-forest-700 items-center justify-center mb-3">
                  <s.icon size={18} />
                </span>
                <p className="font-display text-2xl text-ink">{formatNumber(s.value)}{s.suffix}</p>
                <p className="text-xs text-ink-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="max-w-xl mb-12">
          <h2 className="font-display text-3xl text-ink">From surplus to someone's plate</h2>
          <p className="text-ink-600 mt-3">Four steps carry a donation from a kitchen counter to a person who needs it, tracked the whole way.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-5 h-full">
                <span className="font-display text-3xl text-leaf-300">{i + 1}</span>
                <h3 className="font-display text-base text-ink mt-3">{step.title}</h3>
                <p className="text-sm text-ink-400 mt-2 leading-relaxed">{step.description}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowDown className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 rotate-[-90deg] text-leaf-300" size={18} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-forest-900 text-sand-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="max-w-xl mb-12">
            <h2 className="font-display text-3xl">Built for the whole distribution chain</h2>
            <p className="text-sand-100/70 mt-3">Not just a listing board — a platform that tracks, predicts and optimizes food redistribution end to end.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-xl2 p-5">
                <span className="w-10 h-10 rounded-lg bg-leaf-300 text-forest-900 flex items-center justify-center mb-4">
                  <f.icon size={18} />
                </span>
                <h3 className="font-display text-base">{f.title}</h3>
                <p className="text-sm text-sand-100/65 mt-2 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact charts */}
      <section id="about" className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="max-w-xl mb-12">
          <h2 className="font-display text-3xl text-ink">Measured impact, not just good intentions</h2>
          <p className="text-ink-600 mt-3">A look at donation volume and distribution reach across our five active cities.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-6">
            <h3 className="font-display text-base text-ink mb-4">Weekly donation vs. distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationTrend}>
                  <defs>
                    <linearGradient id="donatedFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1B4332" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#1B4332" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="distFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E9A23B" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#E9A23B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F3EC" />
                  <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#5C6B62' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#5C6B62' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #D2E7DB', fontSize: 12 }} />
                  <Area type="monotone" dataKey="donated" stroke="#1B4332" fill="url(#donatedFill)" strokeWidth={2} name="Donated (kg)" />
                  <Area type="monotone" dataKey="distributed" stroke="#E9A23B" fill="url(#distFill)" strokeWidth={2} name="Distributed (kg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-6">
            <h3 className="font-display text-base text-ink mb-4">Donations by city (kg)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={donationsByCity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F3EC" />
                  <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#5C6B62' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#5C6B62' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #D2E7DB', fontSize: 12 }} />
                  <Bar dataKey="value" fill="#40916C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
