import React from 'react'
import { Link } from 'react-router-dom'
import { PackageSearch, CheckCircle2, Truck, Users2, Clock3 } from 'lucide-react'
import DashboardCard from '../../components/common/DashboardCard.jsx'
import DonationCard from '../../components/common/DonationCard.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getAvailableDonations, getDonationsByNgo } from '../../services/donationService'
import { getProfileRecord } from '../../services/authService'

export default function NGODashboard() {
  const { user } = useAuth()
  const profile = getProfileRecord(user)
  const available = getAvailableDonations()
  const accepted = getDonationsByNgo(user.id)
  const pendingPickups = accepted.filter(d => ['Accepted', 'Picked Up', 'In Transit'].includes(d.status))
  const completed = accepted.filter(d => d.status === 'Delivered')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Welcome back, {user.name}</h2>
        <p className="text-sm text-ink-400 mt-1">Nearby surplus food matched to your capacity, updated in real time.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard icon={PackageSearch} label="Available Donations" value={available.length} tone="amber" />
        <DashboardCard icon={CheckCircle2} label="Accepted Donations" value={accepted.length} tone="leaf" />
        <DashboardCard icon={Clock3} label="Pending Pickups" value={pendingPickups.length} tone="white" />
        <DashboardCard icon={Truck} label="Completed Distributions" value={completed.length} tone="forest" />
        <DashboardCard icon={Users2} label="People Served" value={profile?.peopleServed || 0} tone="white" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-ink">Nearby donations</h3>
          <Link to="/ngo/donations" className="text-sm text-forest-700 font-medium">View all</Link>
        </div>
        {available.length === 0 ? (
          <EmptyState title="No donations nearby right now" description="Check back soon — new donations are posted throughout the day." />
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {available.slice(0, 3).map(d => <DonationCard key={d.id} donation={d} />)}
          </div>
        )}
      </div>
    </div>
  )
}
