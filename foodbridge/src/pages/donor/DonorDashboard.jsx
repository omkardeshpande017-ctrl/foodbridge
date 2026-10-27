import React from 'react'
import { Link } from 'react-router-dom'
import { Package, Clock3, CheckCircle2, Users2, Wind, Plus } from 'lucide-react'
import DashboardCard from '../../components/common/DashboardCard.jsx'
import DonationCard from '../../components/common/DonationCard.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getDonationsByDonor } from '../../services/donationService'
import { getProfileRecord } from '../../services/authService'

export default function DonorDashboard() {
  const { user } = useAuth()
  const donations = getDonationsByDonor(user.id)
  const profile = getProfileRecord(user)

  const active = donations.filter(d => ['Pending', 'Accepted', 'Picked Up', 'In Transit'].includes(d.status))
  const completed = donations.filter(d => d.status === 'Delivered')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-ink">Welcome back, {user.name.split(' ')[0]}</h2>
          <p className="text-sm text-ink-400 mt-1">Here's how your donations are making an impact.</p>
        </div>
        <Link to="/donor/donate" className="inline-flex items-center gap-2 bg-forest-700 text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-forest-900 transition-colors">
          <Plus size={16} /> Donate Food
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard icon={Package} label="Total Food Donated (kg)" value={profile?.totalDonated || 0} tone="forest" />
        <DashboardCard icon={Clock3} label="Active Donations" value={active.length} tone="amber" />
        <DashboardCard icon={CheckCircle2} label="Completed Donations" value={completed.length} tone="leaf" />
        <DashboardCard icon={Users2} label="People Served" value={profile?.mealsProvided || 0} tone="white" />
        <DashboardCard icon={Wind} label="Est. CO₂ Saved (kg)" value={profile?.co2Saved || 0} tone="white" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-ink">Active donations</h3>
          <Link to="/donor/donations" className="text-sm text-forest-700 font-medium">View all</Link>
        </div>
        {active.length === 0 ? (
          <EmptyState
            title="No active donations"
            description="Post your surplus food and it will appear here as it moves through the pipeline."
            action={<Link to="/donor/donate" className="text-sm font-medium bg-forest-700 text-white rounded-full px-5 py-2.5">Donate food</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {active.map(d => <DonationCard key={d.id} donation={d} />)}
          </div>
        )}
      </div>
    </div>
  )
}
