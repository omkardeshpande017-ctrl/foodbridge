// In-memory demo store.
// Used when DEMO_MODE=1 (no MongoDB available). Everything the API needs lives
// here so the whole product works on a serverless host with zero setup.
// State is persisted to a temp file when the filesystem allows it, so data
// survives more than one request on the same instance.

import fs from 'fs';
import os from 'os';
import path from 'path';
import bcrypt from 'bcryptjs';

const STATE_FILE = path.join(os.tmpdir(), 'foodbridge-demo-state.json');
const PASSWORD = bcrypt.hashSync('password123', 10);

const oid = (n) => (Date.now().toString(16).slice(-8) + String(n).padStart(16, '0')).slice(0, 24);

let seq = 500;
const nextId = () => {
  seq += 1;
  return oid(seq);
};

const isoDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

// ---------------------------------------------------------------- seed data
const users = [
  {
    _id: oid(1),
    name: 'Aarav Donor',
    email: 'donor@foodbridge.app',
    phone: '9000000001',
    passwordHash: PASSWORD,
    role: 'donor',
    location: 'Pune',
    organization: 'GreenPlate Foods',
    skills: [],
    status: 'active',
    createdAt: new Date('2025-01-10')
  },
  {
    _id: oid(2),
    name: 'Sahyog NGO',
    email: 'ngo@foodbridge.app',
    phone: '9000000002',
    passwordHash: PASSWORD,
    role: 'ngo',
    location: 'Pune',
    organization: 'Sahyog Foundation',
    skills: [],
    status: 'active',
    createdAt: new Date('2025-01-11')
  },
  {
    _id: oid(3),
    name: 'Rohan Volunteer',
    email: 'volunteer@foodbridge.app',
    phone: '9000000003',
    passwordHash: PASSWORD,
    role: 'volunteer',
    location: 'Pune',
    organization: '',
    skills: ['Driving', 'Packing'],
    status: 'active',
    createdAt: new Date('2025-01-12')
  },
  {
    _id: oid(4),
    name: 'FoodBridge Admin',
    email: 'admin@foodbridge.app',
    phone: '9000000004',
    passwordHash: PASSWORD,
    role: 'admin',
    location: 'Pune',
    organization: 'FoodBridge',
    skills: [],
    status: 'active',
    createdAt: new Date('2025-01-09')
  }
];

const [donor, ngo, volunteer, admin] = users;

const donations = [
  {
    _id: oid(101),
    foodName: 'Fresh Cooked Rice & Dal',
    category: 'Cooked Meals',
    quantity: 80,
    unit: 'kg',
    description: 'Fresh surplus lunch portions from today’s service.',
    preparationDate: isoDate(0),
    expiryTime: '22:00',
    pickupLocation: 'Kothrud, Pune',
    pickupDate: isoDate(1),
    pickupTime: '13:00',
    status: 'available',
    donorId: donor._id,
    ngoId: null,
    volunteerId: null,
    peopleServed: 160,
    co2Saved: 80,
    createdAt: new Date(Date.now() - 3600_000)
  },
  {
    _id: oid(102),
    foodName: 'Bread & Bakery Packs',
    category: 'Bakery',
    quantity: 45,
    unit: 'kg',
    description: 'Packaged bakery surplus, still sealed.',
    preparationDate: isoDate(0),
    expiryTime: '20:00',
    pickupLocation: 'Shivajinagar, Pune',
    pickupDate: isoDate(2),
    pickupTime: '16:00',
    status: 'accepted',
    donorId: donor._id,
    ngoId: ngo._id,
    volunteerId: null,
    peopleServed: 90,
    co2Saved: 45,
    createdAt: new Date(Date.now() - 7200_000)
  },
  {
    _id: oid(103),
    foodName: 'Vegetable Crates',
    category: 'Vegetables',
    quantity: 30,
    unit: 'kg',
    description: 'Fresh vegetables from a catering event.',
    preparationDate: isoDate(-1),
    expiryTime: '18:00',
    pickupLocation: 'Baner, Pune',
    pickupDate: isoDate(-1),
    pickupTime: '11:00',
    status: 'delivered',
    donorId: donor._id,
    ngoId: ngo._id,
    volunteerId: volunteer._id,
    peopleServed: 60,
    co2Saved: 30,
    createdAt: new Date(Date.now() - 5 * 86400_000)
  },
  {
    _id: oid(104),
    foodName: 'Packaged Snacks Drive',
    category: 'Packaged',
    quantity: 120,
    unit: 'kg',
    description: 'Unopened packaged snacks from a corporate drive.',
    preparationDate: isoDate(0),
    expiryTime: '23:00',
    pickupLocation: 'Hinjewadi, Pune',
    pickupDate: isoDate(3),
    pickupTime: '10:00',
    status: 'available',
    donorId: admin._id,
    ngoId: null,
    volunteerId: null,
    peopleServed: 240,
    co2Saved: 120,
    createdAt: new Date(Date.now() - 900_000)
  }
];

const deliveries = [
  {
    _id: oid(201),
    donationId: oid(102),
    volunteerId: volunteer._id,
    pickup: 'Shivajinagar, Pune',
    dropoff: 'Sahyog Foundation, Kothrud',
    status: 'assigned',
    distanceKm: 4.2,
    etaMinutes: 24,
    routeOptimized: false,
    createdAt: new Date()
  }
];

const notifications = [
  {
    _id: oid(301),
    userId: donor._id,
    title: 'Welcome to FoodBridge',
    message: 'Your donation dashboard is ready.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 600_000)
  },
  {
    _id: oid(302),
    userId: ngo._id,
    title: 'New donation nearby',
    message: 'Fresh cooked meals are available in Kothrud.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 300_000)
  },
  {
    _id: oid(303),
    userId: volunteer._id,
    title: 'Delivery task',
    message: 'A delivery workflow is ready for pickup.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 120_000)
  }
];

// ------------------------------------------------------------ persistence
const snapshot = () => ({
  users,
  donations,
  deliveries,
  notifications,
  seq,
  savedAt: new Date().toISOString()
});

// Synchronous on purpose: serverless functions can be frozen right after the
// response, so a deferred write would never land.
const persist = () => {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(snapshot()));
  } catch {
    /* read-only filesystem — keep everything in memory */
  }
};

try {
  if (fs.existsSync(STATE_FILE)) {
    const saved = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    if (saved?.users?.length && saved?.donations) {
      users.splice(0, users.length, ...saved.users);
      donations.splice(0, donations.length, ...saved.donations);
      deliveries.splice(0, deliveries.length, ...(saved.deliveries || []));
      notifications.splice(0, notifications.length, ...(saved.notifications || []));
      seq = saved.seq || seq;
      console.log(`demo state restored (${donations.length} donations, saved ${saved.savedAt})`);
    }
  }
} catch (err) {
  console.warn('could not restore demo state:', err.message);
}

const store = {
  users,
  donations,
  deliveries,
  notifications,
  nextId,
  persist,
  // read through `store.*` so a replaced array is never stale
  findUser: (predicate) => store.users.find(predicate),
  findUserById: (id) => store.users.find((u) => String(u._id) === String(id)),
  findDonation: (id) => store.donations.find((d) => String(d._id) === String(id)),
  findDelivery: (id) => store.deliveries.find((d) => String(d._id) === String(id)),
  safeUser: (u) => {
    if (!u) return null;
    const { passwordHash, ...rest } = u;
    return rest;
  },
  checkPassword: (user, candidate) =>
    !!user && bcrypt.compareSync(candidate || '', user.passwordHash),
  hashPassword: (pw) => bcrypt.hashSync(pw, 10)
};

export default store;
