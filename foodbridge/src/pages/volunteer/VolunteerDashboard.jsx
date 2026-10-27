import React from 'react'
import { Link } from 'react-router-dom'
import { PackageCheck, Bike, CheckCircle2, Route as RouteIcon, Users2 } from 'lucide-react'
import DashboardCard from '../../components/common/DashboardCard.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getDonationsByVolunteer } from '../../services/donationService'
import { getProfileRecord } from '../../services/authService'

export default function VolunteerDashboard() {
  const { user } = useAuth()
  const profile = getProfileRecord(user)
  const tasks = getDonationsByVolunteer(user.id)
  const active = tasks.filter(d => ['Accepted', 'Picked Up', 'In Transit'].includes(d.status))
  const completed = tasks.filter(d => d.status === 'Delivered')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Hey {user.name.split(' ')[0]}, ready to roll?</h2>
        <p className="text-sm text-ink-400 mt-1">Your pickups and deliveries for today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard icon={PackageCheck} label="Assigned Pickups" value={active.length} tone="amber" />
        <DashboardCard icon={Bike} label="Active Delivery" value={active.filter(d => d.status !== 'Accepted').length} tone="white" />
        <DashboardCard icon={CheckCircle2} label="Completed Deliveries" value={profile?.deliveries || completed.length} tone="leaf" />
        <DashboardCard icon={RouteIcon} label="Total Distance (km)" value={profile?.distanceKm || 0} tone="forest" />
        <DashboardCard icon={Users2} label="Meals Delivered" value={(profile?.deliveries || 0) * 40} tone="white" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-ink">Today's tasks</h3>
          <Link to="/volunteer/tasks" className="text-sm text-forest-700 font-medium">View all</Link>
        </div>
        {active.length === 0 ? (
          <p className="text-sm text-ink-400 bg-sand-100 border border-dashed border-forest-100 rounded-xl2 px-5 py-8 text-center">
            No pickups assigned right now. Check the Pickup Tasks page for donations awaiting a volunteer.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {active.slice(0, 3).map(d => (
              <div key={d.id} className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-4">
                <p className="font-display text-ink">{d.foodName}</p>
                <p className="text-xs text-ink-400 mt-1">{d.location} → {d.ngoId}</p>
                <p className="text-xs text-ink-400 mt-1">Status: {d.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
