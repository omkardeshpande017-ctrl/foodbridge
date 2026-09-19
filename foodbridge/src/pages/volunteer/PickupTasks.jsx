import React, { useState } from 'react'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import {
  getDonationsByVolunteer, getAllDonations, assignVolunteer, advanceDeliveryStatus,
} from '../../services/donationService'
import { pushNotification } from '../../services/notificationService'
import { ngos } from '../../data/mockData'

const FLOW = ['Accepted', 'Picked Up', 'In Transit', 'Delivered']
const ACTION_LABEL = { Accepted: 'Start Pickup', 'Picked Up': 'Start Delivery', 'In Transit': 'Mark Delivered' }
const NEXT_STATUS_LABEL = { Accepted: 'Picked Up', 'Picked Up': 'In Transit', 'In Transit': 'Delivered' }

export default function PickupTasks() {
  const [version, setVersion] = useState(0)
  const { user } = useAuth()
  const { notify } = useToast()

  void version
  const myTasks = getDonationsByVolunteer(user.id).filter(d => d.status !== 'Delivered')
  const unassigned = getAllDonations().filter(d => d.status === 'Accepted' && !d.volunteerId)

  const acceptTask = (donation) => {
    assignVolunteer(donation.id, user.id)
    pushNotification({ title: 'Volunteer assigned', body: `${user.name} picked up the task for ${donation.foodName}.`, type: 'volunteer' })
    notify('Task accepted — it now appears in your active pickups.', 'success')
    setVersion(v => v + 1)
  }

  const advance = (donation) => {
    const updated = advanceDeliveryStatus(donation.id)
    if (updated?.status === 'Delivered') {
      pushNotification({ title: 'Delivery completed', body: `${donation.foodName} was delivered successfully.`, type: 'delivered' })
      notify('Marked as delivered. Great work!', 'success')
    } else {
      notify(`Status updated to ${updated?.status}.`, 'success')
    }
    setVersion(v => v + 1)
  }

  const ngoName = (id) => ngos.find(n => n.id === id)?.name || id

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="font-display text-2xl text-ink mb-1">Pickup tasks</h2>
        <p className="text-sm text-ink-400 mb-6">Accept a task, then move it through pickup and delivery.</p>

        {unassigned.length === 0 ? (
          <EmptyState title="No unassigned tasks nearby" description="Accepted donations awaiting a volunteer will appear here." />
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {unassigned.map(d => (
              <div key={d.id} className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-display text-ink">{d.foodName}</h4>
                  <StatusBadge status={d.status} />
                </div>
                <p className="text-xs text-ink-400 flex items-center gap-1.5"><MapPin size={13} /> {d.location}</p>
                <p className="text-xs text-ink-400 flex items-center gap-1.5"><Clock size={13} /> Pickup {d.pickupDate} · {d.pickupTime}</p>
                <p className="text-xs text-ink-600">Destination: {ngoName(d.ngoId)}</p>
                <button
                  onClick={() => acceptTask(d)}
                  className="mt-1 text-sm font-medium bg-forest-700 text-white rounded-full px-4 py-2 hover:bg-forest-900 transition-colors self-start"
                >
                  Accept Task
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-display text-lg text-ink mb-4">My active tasks</h3>
        {myTasks.length === 0 ? (
          <EmptyState title="No active tasks" description="Accept a task above to start a pickup and delivery." />
        ) : (
          <div className="flex flex-col gap-4">
            {myTasks.map(d => (
              <div key={d.id} className="bg-white rounded-xl2 border border-forest-100 shadow-soft p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h4 className="font-display text-ink">{d.foodName}</h4>
                    <p className="text-xs text-ink-400 mt-1">{d.donorName} → {ngoName(d.ngoId)}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>

                {/* Delivery progress tracker */}
                <div className="flex items-center gap-1 mb-4">
                  {FLOW.map((step, i) => {
                    const currentIdx = FLOW.indexOf(d.status)
                    const done = i <= currentIdx
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-1.5 flex-1">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                            done ? 'bg-forest-700 text-white' : 'bg-sand-200 text-ink-400'
                          }`}>{i + 1}</span>
                          <span className={`text-[10px] text-center ${done ? 'text-forest-700 font-medium' : 'text-ink-400'}`}>{step}</span>
                        </div>
                        {i < FLOW.length - 1 && <span className={`h-0.5 flex-1 -mt-4 ${i < currentIdx ? 'bg-forest-700' : 'bg-sand-200'}`} />}
                      </React.Fragment>
                    )
                  })}
                </div>

                {ACTION_LABEL[d.status] && (
                  <button
                    onClick={() => advance(d)}
                    className="inline-flex items-center gap-2 text-sm font-medium bg-forest-700 text-white rounded-full px-5 py-2.5 hover:bg-forest-900 transition-colors"
                  >
                    {ACTION_LABEL[d.status]} <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
