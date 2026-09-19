import { readStore, writeStore, seedOnce } from '../utils/storage'
import { initialDonations } from '../data/mockData'

const KEY = 'donations'

seedOnce(KEY, initialDonations)

export function getAllDonations() {
  return readStore(KEY, initialDonations)
}

export function getDonationsByDonor(donorId) {
  return getAllDonations().filter(d => d.donorId === donorId)
}

export function getDonationById(id) {
  return getAllDonations().find(d => d.id === id) || null
}

export function getAvailableDonations({ city, category, maxDistance } = {}) {
  return getAllDonations().filter(d => {
    if (d.status !== 'Pending') return false
    if (city && d.city !== city) return false
    if (category && d.category !== category) return false
    if (maxDistance && d.distanceKm > maxDistance) return false
    return true
  })
}

export function getDonationsByNgo(ngoId) {
  return getAllDonations().filter(d => d.ngoId === ngoId)
}

export function getDonationsByVolunteer(volunteerId) {
  return getAllDonations().filter(d => d.volunteerId === volunteerId)
}

export function createDonation(payload) {
  const donations = getAllDonations()
  const id = `DON-${9000 + donations.length + 1 + Math.floor(Math.random() * 90)}`
  const now = new Date()
  const record = {
    id,
    status: 'Pending',
    ngoId: null,
    volunteerId: null,
    createdAt: now.toISOString(),
    distanceKm: +(Math.random() * 8 + 1).toFixed(1),
    city: payload.city || 'Pune',
    ...payload,
  }
  const next = [record, ...donations]
  writeStore(KEY, next)
  return record
}

export function updateDonationStatus(id, status, extra = {}) {
  const donations = getAllDonations()
  const next = donations.map(d => (d.id === id ? { ...d, status, ...extra } : d))
  writeStore(KEY, next)
  return next.find(d => d.id === id)
}

export function acceptDonation(id, ngoId) {
  return updateDonationStatus(id, 'Accepted', { ngoId })
}

export function assignVolunteer(id, volunteerId) {
  return updateDonationStatus(id, 'Accepted', { volunteerId })
}

export function advanceDeliveryStatus(id) {
  const donation = getDonationById(id)
  if (!donation) return null
  const flow = ['Accepted', 'Picked Up', 'In Transit', 'Delivered']
  const idx = flow.indexOf(donation.status)
  const nextStatus = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : donation.status
  return updateDonationStatus(id, nextStatus)
}
