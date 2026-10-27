import { readStore, writeStore } from '../utils/storage'
import { donors, ngos, volunteers } from '../data/mockData'

const SESSION_KEY = 'session'

// Pre-seeded demo accounts so login "just works" for evaluators without registering first.
const demoAccountsByRole = {
  donor: { id: 'DNR-101', name: 'Ananya Rao', email: 'donor@foodbridge.demo' },
  ngo: { id: 'NGO-201', name: 'Anna Seva Foundation', email: 'ngo@foodbridge.demo' },
  volunteer: { id: 'VOL-301', name: 'Karan Mehta', email: 'volunteer@foodbridge.demo' },
  admin: { id: 'ADM-001', name: 'Platform Admin', email: 'admin@foodbridge.demo' },
}

export function login({ email, password, role }) {
  if (!email || !password) {
    throw new Error('Enter both email and password to continue.')
  }
  if (!role) {
    throw new Error('Select a role to continue.')
  }
  const base = demoAccountsByRole[role]
  const user = {
    id: base.id,
    name: base.name,
    email,
    role,
    loggedInAt: new Date().toISOString(),
  }
  writeStore(SESSION_KEY, user)
  return user
}

export function register(payload) {
  const { name, email, phone, password, location, role } = payload
  if (!name || !email || !phone || !password || !location || !role) {
    throw new Error('All fields are required to create your account.')
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('Enter a valid email address.')
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }
  const id = `${role.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 8999)}`
  const user = { id, name, email, phone, location, role, loggedInAt: new Date().toISOString() }
  writeStore(SESSION_KEY, user)
  return user
}

export function logout() {
  writeStore(SESSION_KEY, null)
}

export function getSession() {
  return readStore(SESSION_KEY, null)
}

export function getProfileRecord(user) {
  if (!user) return null
  if (user.role === 'donor') return donors.find(d => d.id === user.id) || donors[0]
  if (user.role === 'ngo') return ngos.find(n => n.id === user.id) || ngos[0]
  if (user.role === 'volunteer') return volunteers.find(v => v.id === user.id) || volunteers[0]
  return null
}
