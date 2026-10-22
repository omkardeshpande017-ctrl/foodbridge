// End-to-end API test for FoodBridge.
//   node backend/test/smoke.js                      -> http://localhost:5001/api
//   node backend/test/smoke.js https://site/api     -> a deployed instance
const base = process.argv[2] || 'http://localhost:5001/api';

let pass = 0;
const failures = [];

const ok = (name, cond, extra = '') => {
  if (cond) {
    pass += 1;
    console.log(`  ✓ ${name}`);
  } else {
    failures.push(name);
    console.log(`  ✗ ${name} ${extra}`);
  }
};

const call = async (method, path, { token, body } = {}) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, data };
};

const login = async (email, password = 'password123') =>
  (await call('POST', '/auth/login', { body: { email, password } })).data?.token;

(async () => {
  console.log(`\nFoodBridge API test — ${base}\n`);

  console.log('Health');
  const health = await call('GET', '/health');
  ok('health endpoint', health.status === 200 && health.data.status === 'ok');

  console.log('\nAuth');
  const badLogin = await call('POST', '/auth/login', {
    body: { email: 'donor@foodbridge.app', password: 'wrong' }
  });
  ok('wrong password rejected', badLogin.status === 401);

  const donor = await login('donor@foodbridge.app');
  const ngo = await login('ngo@foodbridge.app');
  const volunteer = await login('volunteer@foodbridge.app');
  const admin = await login('admin@foodbridge.app');
  ok('donor login', !!donor);
  ok('ngo login', !!ngo);
  ok('volunteer login', !!volunteer);
  ok('admin login', !!admin);

  const roleMismatch = await call('POST', '/auth/login', {
    body: { email: 'donor@foodbridge.app', password: 'password123', role: 'admin' }
  });
  ok('role mismatch rejected', roleMismatch.status === 401);

  const uniq = Date.now().toString(36);
  const reg = await call('POST', '/auth/register', {
    body: {
      name: 'Smoke Test Donor',
      email: `smoke_${uniq}@foodbridge.app`,
      password: 'password123',
      role: 'donor',
      location: 'Pune'
    }
  });
  ok('register new user', reg.status === 201 && !!reg.data.token);
  const newToken = reg.data.token;

  const dup = await call('POST', '/auth/register', {
    body: {
      name: 'Smoke Test Donor',
      email: `smoke_${uniq}@foodbridge.app`,
      password: 'password123',
      role: 'donor'
    }
  });
  ok('duplicate email rejected', dup.status === 409);

  console.log('\nProfile & guards');
  const me = await call('GET', '/users/me', { token: donor });
  ok('GET /users/me', me.status === 200 && me.data.email === 'donor@foodbridge.app');
  const patchMe = await call('PATCH', '/users/me', {
    token: newToken,
    body: { location: 'Mumbai', phone: '9111111111' }
  });
  ok('PATCH /users/me', patchMe.status === 200 && patchMe.data.location === 'Mumbai');
  const noToken = await call('GET', '/donations');
  ok('anonymous blocked', noToken.status === 401);
  const donorUsers = await call('GET', '/users', { token: donor });
  ok('donor cannot list users', donorUsers.status === 403);
  const adminUsers = await call('GET', '/users', { token: admin });
  ok('admin can list users', adminUsers.status === 200 && Array.isArray(adminUsers.data));

  console.log('\nDonations');
  const list = await call('GET', '/donations', { token: ngo });
  ok('ngo sees donations', list.status === 200 && list.data.length > 0);

  const donorList = await call('GET', '/donations', { token: donor });
  ok(
    'donor sees only own donations',
    donorList.status === 200 && donorList.data.every((d) => !d.donorId || d.donorId.email === 'donor@foodbridge.app')
  );

  const created = await call('POST', '/donations', {
    token: newToken,
    body: {
      foodName: 'Smoke Test Meals',
      category: 'Cooked Meals',
      quantity: 12,
      unit: 'kg',
      pickupLocation: 'Kothrud, Pune',
      pickupDate: '2027-01-15',
      pickupTime: '12:00',
      description: 'Automated smoke test donation'
    }
  });
  ok('donor creates donation', created.status === 201 && created.data.peopleServed === 24);
  const donationId = created.data?._id;

  const ngoCreate = await call('POST', '/donations', {
    token: ngo,
    body: { foodName: 'Nope', quantity: 1 }
  });
  ok('ngo cannot create donation', ngoCreate.status === 403);

  const badDonation = await call('POST', '/donations', { token: donor, body: { foodName: '' } });
  ok('invalid donation rejected', badDonation.status === 400);

  const accept = await call('POST', `/donations/${donationId}/accept`, { token: ngo });
  ok('ngo accepts donation', accept.status === 200 && accept.data.status === 'accepted');

  const acceptTwice = await call('POST', `/donations/${donationId}/accept`, { token: ngo });
  ok('cannot accept twice', acceptTwice.status === 400);

  const donorAccept = await call('POST', `/donations/${donationId}/accept`, { token: donor });
  ok('donor cannot accept', donorAccept.status === 403);

  const picked = await call('PATCH', `/donations/${donationId}/status`, {
    token: volunteer,
    body: { status: 'picked_up' }
  });
  ok('volunteer updates status', picked.status === 200 && picked.data.status === 'picked_up');

  const badStatus = await call('PATCH', `/donations/${donationId}/status`, {
    token: volunteer,
    body: { status: 'not_a_status' }
  });
  ok('invalid status rejected', badStatus.status === 400);

  const delivered = await call('PATCH', `/donations/${donationId}/status`, {
    token: volunteer,
    body: { status: 'delivered' }
  });
  ok('mark delivered', delivered.status === 200 && delivered.data.status === 'delivered');

  const search = await call('GET', '/donations?search=smoke', { token: admin });
  ok('search filter', search.status === 200 && search.data.length > 0);

  const byStatus = await call('GET', '/donations?status=delivered', { token: admin });
  ok('status filter', byStatus.status === 200 && byStatus.data.every((d) => d.status === 'delivered'));

  console.log('\nDeliveries');
  const delivery = await call('POST', '/deliveries', {
    token: ngo,
    body: {
      donationId,
      pickup: 'Kothrud, Pune',
      dropoff: 'Sahyog Foundation',
      volunteerId: null
    }
  });
  ok('ngo creates delivery', delivery.status === 201 && delivery.data.status === 'assigned');
  const deliveryId = delivery.data?._id;

  const deliveryList = await call('GET', '/deliveries', { token: ngo });
  ok('delivery list', deliveryList.status === 200 && Array.isArray(deliveryList.data));

  const deliveryUpdate = await call('PATCH', `/deliveries/${deliveryId}`, {
    token: volunteer,
    body: { status: 'in_transit', etaMinutes: 12 }
  });
  ok(
    'volunteer updates delivery',
    deliveryUpdate.status === 200 && deliveryUpdate.data.status === 'in_transit'
  );

  const deliveryDone = await call('PATCH', `/deliveries/${deliveryId}`, {
    token: volunteer,
    body: { status: 'delivered' }
  });
  ok('delivery delivered', deliveryDone.status === 200 && deliveryDone.data.status === 'delivered');

  console.log('\nAnalytics, reports, AI');
  const summary = await call('GET', '/analytics/summary', { token: donor });
  ok('analytics summary', summary.status === 200 && typeof summary.data.totalFood === 'number');
  const overview = await call('GET', '/analytics/overview', { token: admin });
  ok(
    'analytics overview',
    overview.status === 200 && Array.isArray(overview.data.byCategory) && overview.data.users > 0
  );
  const report = await call('GET', '/reports/summary', { token: admin });
  ok('reports summary', report.status === 200 && report.data.donations >= 1);
  const insights = await call('GET', '/ai/insights', { token: donor });
  ok('ai insights', insights.status === 200 && insights.data.insights.length === 3);

  console.log('\nNotifications');
  const notifs = await call('GET', '/notifications', { token: donor });
  ok('donor notifications', notifs.status === 200 && notifs.data.length > 0);
  const firstUnread = notifs.data.find((n) => !n.read);
  if (firstUnread) {
    const read = await call('PATCH', `/notifications/${firstUnread._id}/read`, { token: donor });
    ok('mark notification read', read.status === 200 && read.data.read === true);
  } else {
    ok('mark notification read', true);
  }
  const otherRead = await call('PATCH', `/notifications/${notifs.data[0]._id}/read`, { token: ngo });
  ok("cannot read someone else's notification", otherRead.status === 404);

  console.log(`\n${pass} passed, ${failures.length} failed`);
  if (failures.length) {
    console.log('Failed:', failures.join(', '));
    process.exit(1);
  }
})();
