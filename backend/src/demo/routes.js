// Demo-mode API. Mirrors every route in ../routes/* exactly, but reads and
// writes the in-memory store instead of MongoDB, so the deployed site works
// with no database. Response shapes are identical to the Mongo version.
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import store from './store.js';

const SECRET = process.env.JWT_SECRET || 'foodbridge_change_this_secret';
const auth = (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
const roles =
  (...allowed) =>
  (req, res, next) =>
    allowed.includes(req.user.role) ? next() : res.status(403).json({ message: 'Access denied' });

const signUser = (u) =>
  jwt.sign(
    { id: String(u._id), role: u.role, name: u.name, email: u.email },
    SECRET,
    { expiresIn: '7d' }
  );

const publicUser = (u) => {
  if (!u) return null;
  return {
    _id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone || '',
    location: u.location || '',
    organization: u.organization || '',
    skills: u.skills || [],
    status: u.status || 'active',
    createdAt: u.createdAt
  };
};

const hydrateDonation = (d) => {
  if (!d) return null;
  const donor = store.findUserById(d.donorId);
  const ngoUser = store.findUserById(d.ngoId);
  const vol = store.findUserById(d.volunteerId);
  return {
    ...d,
    donorId: donor ? { _id: String(donor._id), name: donor.name, email: donor.email } : d.donorId,
    ngoId: ngoUser
      ? { _id: String(ngoUser._id), name: ngoUser.name, organization: ngoUser.organization }
      : d.ngoId,
    volunteerId: vol ? { _id: String(vol._id), name: vol.name } : d.volunteerId
  };
};

const hydrateDelivery = (d) => {
  const donation = store.findDonation(d.donationId);
  const vol = store.findUserById(d.volunteerId);
  return {
    ...d,
    donationId: donation ? hydrateDonation(donation) : d.donationId,
    volunteerId: vol ? { _id: String(vol._id), name: vol.name, email: vol.email } : d.volunteerId
  };
};

const notify = (userId, title, message, type = 'info') => {
  if (!userId) return;
  store.notifications.unshift({
    _id: store.nextId(),
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date()
  });
  store.persist();
};

// ------------------------------------------------------------------ auth
export const authRouter = () => {
  const r = Router();

  r.post('/register', (req, res) => {
    const { name, email, phone, password, role, location, organization, skills } = req.body || {};
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }
    if (!['donor', 'ngo', 'volunteer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (store.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const user = {
      _id: store.nextId(),
      name,
      email: String(email).toLowerCase(),
      phone: phone || '',
      passwordHash: store.hashPassword(password),
      role,
      location: location || '',
      organization: organization || '',
      skills: Array.isArray(skills) ? skills : [],
      status: 'active',
      createdAt: new Date()
    };
    store.users.push(user);
    store.persist();
    notify(String(user._id), 'Welcome to FoodBridge', 'Your account is ready to use.', 'success');
    res.status(201).json({ token: signUser(user), user: publicUser(user) });
  });

  r.post('/login', (req, res) => {
    const { email, password, role } = req.body || {};
    const user = store.users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
    if (!user || user.status !== 'active' || !store.checkPassword(user, password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (role && role !== user.role) {
      return res.status(401).json({ message: 'Selected role does not match this account' });
    }
    res.json({ token: signUser(user), user: publicUser(user) });
  });

  r.get('/me', auth, (req, res) => res.json(publicUser(store.findUserById(req.user.id))));

  return r;
};

// ------------------------------------------------------------- donations
export const donationsRouter = () => {
  const r = Router();

  r.get('/', auth, (req, res) => {
    let items = [...store.donations];

    if (req.query.status) items = items.filter((d) => d.status === req.query.status);
    if (req.query.category) items = items.filter((d) => d.category === req.query.category);
    if (req.query.search) {
      const q = String(req.query.search).toLowerCase();
      items = items.filter(
        (d) =>
          String(d.foodName).toLowerCase().includes(q) ||
          String(d.pickupLocation || '').toLowerCase().includes(q)
      );
    }
    if (req.user.role === 'donor') items = items.filter((d) => String(d.donorId) === req.user.id);
    if (req.user.role === 'ngo' && req.query.mine === 'true')
      items = items.filter((d) => String(d.ngoId) === req.user.id);
    if (req.user.role === 'volunteer' && req.query.mine === 'true')
      items = items.filter((d) => String(d.volunteerId) === req.user.id);

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(items.slice(0, 200).map(hydrateDonation));
  });

  r.get('/:id', auth, (req, res) => {
    const d = store.findDonation(req.params.id);
    if (!d) return res.status(404).json({ message: 'Donation not found' });
    res.json(hydrateDonation(d));
  });

  r.post('/', auth, roles('donor', 'admin'), (req, res) => {
    const b = req.body || {};
    if (!b.foodName || !b.quantity) {
      return res.status(400).json({ message: 'Food name and quantity are required' });
    }
    const donation = {
      _id: store.nextId(),
      foodName: b.foodName,
      category: b.category || 'Other',
      quantity: Number(b.quantity),
      unit: b.unit || 'kg',
      description: b.description || '',
      preparationDate: b.preparationDate || '',
      expiryTime: b.expiryTime || '',
      pickupLocation: b.pickupLocation || '',
      pickupDate: b.pickupDate || '',
      pickupTime: b.pickupTime || '',
      image: b.image || '',
      notes: b.notes || '',
      status: 'available',
      donorId: req.user.role === 'donor' ? req.user.id : b.donorId || req.user.id,
      ngoId: null,
      volunteerId: null,
      peopleServed: Math.max(1, Math.round((Number(b.quantity) || 0) * 2)),
      co2Saved: Number(b.quantity) || 0,
      createdAt: new Date()
    };
    store.donations.unshift(donation);
    store.persist();
    res.status(201).json(hydrateDonation(donation));
  });

  r.patch('/:id/status', auth, (req, res) => {
    const d = store.findDonation(req.params.id);
    if (!d) return res.status(404).json({ message: 'Donation not found' });
    const allowed = [
      'available',
      'accepted',
      'picked_up',
      'in_transit',
      'delivered',
      'expired',
      'cancelled'
    ];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    d.status = req.body.status;
    if (req.user.role === 'ngo' && req.body.status === 'accepted') d.ngoId = req.user.id;
    if (
      req.user.role === 'volunteer' &&
      ['picked_up', 'in_transit', 'delivered'].includes(req.body.status)
    ) {
      d.volunteerId = req.user.id;
    }
    store.persist();
    notify(
      d.donorId,
      'Donation updated',
      `${d.foodName} is now ${String(d.status).replace('_', ' ')}.`,
      'success'
    );
    res.json(hydrateDonation(d));
  });

  r.post('/:id/accept', auth, roles('ngo', 'admin'), (req, res) => {
    const d = store.findDonation(req.params.id);
    if (!d) return res.status(404).json({ message: 'Donation not found' });
    if (d.status !== 'available') {
      return res.status(400).json({ message: `This donation is already ${d.status}` });
    }
    d.status = 'accepted';
    d.ngoId = req.user.id;
    store.persist();
    notify(
      d.donorId,
      'Donation accepted',
      `${d.foodName} was accepted by ${req.user.name}.`,
      'success'
    );
    res.json(hydrateDonation(d));
  });

  return r;
};

// ------------------------------------------------------------------ users
export const usersRouter = () => {
  const r = Router();

  r.get('/', auth, roles('admin'), (req, res) =>
    res.json(
      [...store.users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(publicUser)
    )
  );

  r.patch('/:id/status', auth, roles('admin'), (req, res) => {
    const u = store.findUserById(req.params.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    u.status = req.body.status || u.status;
    store.persist();
    res.json(publicUser(u));
  });

  r.get('/me', auth, (req, res) => res.json(publicUser(store.findUserById(req.user.id))));

  r.patch('/me', auth, (req, res) => {
    const u = store.findUserById(req.user.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    const { name, phone, location, organization, skills } = req.body || {};
    if (name) u.name = name;
    if (phone !== undefined) u.phone = phone;
    if (location !== undefined) u.location = location;
    if (organization !== undefined) u.organization = organization;
    if (skills !== undefined) u.skills = Array.isArray(skills) ? skills : [skills];
    store.persist();
    res.json(publicUser(u));
  });

  return r;
};

// -------------------------------------------------------------- analytics
export const analyticsRouter = () => {
  const r = Router();

  r.get('/summary', auth, (req, res) => {
    const base =
      req.user.role === 'donor'
        ? store.donations.filter((d) => String(d.donorId) === req.user.id)
        : req.user.role === 'ngo'
          ? store.donations.filter((d) => String(d.ngoId) === req.user.id)
          : store.donations;

    const total = base.reduce((s, d) => s + (d.quantity || 0), 0);
    const delivered = base.filter((d) => d.status === 'delivered');

    res.json({
      totalFood: Math.round(total),
      active: base.filter(
        (d) => !['delivered', 'cancelled', 'expired'].includes(d.status)
      ).length,
      completed: delivered.length,
      peopleServed: base.reduce((s, d) => s + (d.peopleServed || 0), 0),
      co2Saved: Math.round(base.reduce((s, d) => s + (d.co2Saved || 0), 0)),
      efficiency: base.length ? Math.round((delivered.length / base.length) * 100) : 0
    });
  });

  r.get('/overview', auth, roles('admin', 'ngo', 'donor', 'volunteer'), (req, res) => {
    const ds = store.donations;
    const byCat = {};
    ds.forEach((d) => (byCat[d.category] = (byCat[d.category] || 0) + (d.quantity || 0)));
    const byStatus = {};
    ds.forEach((d) => (byStatus[d.status] = (byStatus[d.status] || 0) + 1));

    res.json({
      users: store.users.length,
      donations: ds.length,
      byCategory: Object.entries(byCat).map(([name, value]) => ({ name, value: Math.round(value) })),
      byStatus: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
      trend: [
        { name: 'Mon', food: 120, demand: 100 },
        { name: 'Tue', food: 180, demand: 145 },
        { name: 'Wed', food: 150, demand: 165 },
        { name: 'Thu', food: 220, demand: 190 },
        { name: 'Fri', food: 240, demand: 210 },
        { name: 'Sat', food: 280, demand: 250 },
        { name: 'Sun', food: 200, demand: 230 }
      ]
    });
  });

  return r;
};

// ---------------------------------------------------------- notifications
export const notificationsRouter = () => {
  const r = Router();

  r.get('/', auth, (req, res) =>
    res.json(
      store.notifications
        .filter((n) => String(n.userId) === req.user.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 100)
    )
  );

  r.patch('/:id/read', auth, (req, res) => {
    const n = store.notifications.find(
      (x) => String(x._id) === req.params.id && String(x.userId) === req.user.id
    );
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    n.read = true;
    store.persist();
    res.json(n);
  });

  return r;
};

// ------------------------------------------------------------- deliveries
export const deliveriesRouter = () => {
  const r = Router();

  r.get('/', auth, (req, res) => {
    const items =
      req.user.role === 'volunteer'
        ? store.deliveries.filter((d) => String(d.volunteerId) === req.user.id)
        : [...store.deliveries];
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(items.map(hydrateDelivery));
  });

  r.post('/', auth, roles('admin', 'ngo'), (req, res) => {
    const b = req.body || {};
    const delivery = {
      _id: store.nextId(),
      donationId: b.donationId || null,
      volunteerId: b.volunteerId || null,
      pickup: b.pickup || '',
      dropoff: b.dropoff || '',
      status: 'assigned',
      distanceKm: b.distanceKm ?? 4.2,
      etaMinutes: b.etaMinutes ?? 24,
      routeOptimized: false,
      createdAt: new Date()
    };
    store.deliveries.unshift(delivery);

    if (b.donationId) {
      const d = store.findDonation(b.donationId);
      if (d) {
        if (b.volunteerId) d.volunteerId = b.volunteerId;
        if (d.status === 'available') d.status = 'accepted';
        notify(d.donorId, 'Volunteer assigned', `${d.foodName} has a delivery partner.`, 'info');
        if (b.volunteerId) {
          notify(b.volunteerId, 'New delivery task', `Pickup at ${d.pickupLocation || 'the donor'}.`, 'info');
        }
      }
    }
    store.persist();
    res.status(201).json(hydrateDelivery(delivery));
  });

  r.patch('/:id', auth, roles('volunteer', 'admin', 'ngo'), (req, res) => {
    const d = store.findDelivery(req.params.id);
    if (!d) return res.status(404).json({ message: 'Delivery not found' });

    const { status, distanceKm, etaMinutes, routeOptimized } = req.body || {};
    if (status) d.status = status;
    if (distanceKm !== undefined) d.distanceKm = distanceKm;
    if (etaMinutes !== undefined) d.etaMinutes = etaMinutes;
    if (routeOptimized !== undefined) d.routeOptimized = routeOptimized;

    if (d.donationId && status) {
      const donation = store.findDonation(d.donationId);
      if (donation) {
        donation.status = status === 'delivered' ? 'delivered' : status;
        if (!donation.volunteerId && req.user.role === 'volunteer') {
          donation.volunteerId = req.user.id;
        }
        notify(donation.donorId, 'Delivery update', `Status: ${status.replace('_', ' ')}.`, 'info');
      }
    }
    store.persist();
    res.json(hydrateDelivery(d));
  });

  return r;
};

// ------------------------------------------------------------- ai + report
export const aiRouter = () => {
  const r = Router();
  r.get('/insights', auth, (req, res) => {
    const ds = store.donations;
    const meals = ds.reduce((s, d) => s + (d.quantity || 0), 0);
    res.json({
      isDemo: true,
      confidence: 0.86,
      insights: [
        {
          title: 'Demand rising',
          text: 'Meal demand is projected to rise 14% in the next 7 days.',
          severity: 'medium'
        },
        {
          title: 'Surplus detected',
          text: `Cooked meals show the largest short-term surplus opportunity (${Math.round(meals)} kg tracked).`,
          severity: 'high'
        },
        {
          title: 'NGO matching',
          text: 'Three nearby NGO profiles match the current donation category.',
          severity: 'low'
        }
      ],
      forecast: [
        { day: 'Mon', demand: 120 },
        { day: 'Tue', demand: 135 },
        { day: 'Wed', demand: 150 },
        { day: 'Thu', demand: 164 },
        { day: 'Fri', demand: 172 },
        { day: 'Sat', demand: 181 },
        { day: 'Sun', demand: 176 }
      ]
    });
  });
  return r;
};

export const reportsRouter = () => {
  const r = Router();
  r.get('/summary', auth, roles('admin', 'ngo', 'donor', 'volunteer'), (req, res) => {
    const ds = store.donations;
    res.json({
      generatedAt: new Date().toISOString(),
      users: store.users.length,
      donations: ds.length,
      totalFood: ds.reduce((s, d) => s + (d.quantity || 0), 0),
      peopleServed: ds.reduce((s, d) => s + (d.peopleServed || 0), 0),
      co2Saved: ds.reduce((s, d) => s + (d.co2Saved || 0), 0)
    });
  });
  return r;
};

export default {
  authRouter,
  donationsRouter,
  usersRouter,
  analyticsRouter,
  notificationsRouter,
  deliveriesRouter,
  aiRouter,
  reportsRouter
};
