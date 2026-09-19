import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Users2, Building2, ShieldCheck, Bike, Package, Truck, Leaf, MapPinned } from 'lucide-react'
import DashboardCard from '../../components/common/DashboardCard.jsx'
import ChartCard from '../../components/common/ChartCard.jsx'
import { donors, ngos, volunteers, initialDonations, donationsByCity, platformStats } from '../../data/mockData'

export default function AdminDashboard() {
  const totalUsers = donors.length + ngos.length + volunteers.length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Platform overview</h2>
        <p className="text-sm text-ink-400 mt-1">System-wide activity across donors, NGOs, volunteers and donations.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Users2} label="Total Users" value={totalUsers} tone="forest" />
        <DashboardCard icon={Building2} label="Donors" value={donors.length} tone="white" />
        <DashboardCard icon={ShieldCheck} label="NGOs" value={ngos.length} tone="leaf" />
        <DashboardCard icon={Bike} label="Volunteers" value={volunteers.length} tone="white" />
        <DashboardCard icon={Package} label="Donations" value={initialDonations.length} tone="amber" />
        <DashboardCard icon={Truck} label="Distribution Efficiency" value={92} suffix="%" tone="white" />
        <DashboardCard icon={Leaf} label="Food Waste (kg)" value={platformStats.foodDonatedKg - platformStats.foodSavedKg} tone="white" />
        <DashboardCard icon={MapPinned} label="Regions Active" value={5} tone="forest" />
      </div>

      <ChartCard title="Regional activity" subtitle="Donation volume by city (kg)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={donationsByCity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3EC" />
            <XAxis dataKey="city" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="value" fill="#1B4332" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
