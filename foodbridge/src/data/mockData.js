// Realistic seed data for FoodBridge. This stands in for a real MongoDB-backed API.
// Every service in /src/services reads from (and, via localStorage, writes back to)
// the shapes defined here, so the whole app works without a live backend.

export const CITIES = ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad']

export const FOOD_CATEGORIES = [
  'Cooked Meals', 'Bakery', 'Fruits & Vegetables', 'Grains & Cereals',
  'Dairy', 'Packaged Food', 'Beverages',
]

export const donors = [
  { id: 'DNR-101', name: 'Ananya Rao', type: 'Individual', location: 'Koregaon Park, Pune', phone: '+91 98220 11223', joined: '2025-02-11', status: 'Active', totalDonated: 412, mealsProvided: 1840, co2Saved: 620 },
  { id: 'DNR-102', name: 'Grand Sapphire Hotel', type: 'Restaurant', location: 'Bandra West, Mumbai', phone: '+91 98330 44556', joined: '2024-11-03', status: 'Active', totalDonated: 2140, mealsProvided: 9600, co2Saved: 3120 },
  { id: 'DNR-103', name: 'Spice Route Catering', type: 'Caterer', location: 'Viman Nagar, Pune', phone: '+91 98110 77889', joined: '2025-01-19', status: 'Active', totalDonated: 1360, mealsProvided: 5980, co2Saved: 1890 },
  { id: 'DNR-104', name: 'FreshMart Supermarket', type: 'Retailer', location: 'Nagpur Central', phone: '+91 97650 22110', joined: '2024-09-28', status: 'Active', totalDonated: 3080, mealsProvided: 13200, co2Saved: 4420 },
  { id: 'DNR-105', name: 'Rohit Deshmukh', type: 'Individual', location: 'College Road, Nashik', phone: '+91 99870 33445', joined: '2025-04-02', status: 'Active', totalDonated: 95, mealsProvided: 340, co2Saved: 140 },
  { id: 'DNR-106', name: 'GreenLeaf Bakery', type: 'Bakery', location: 'Camp, Pune', phone: '+91 98500 66778', joined: '2025-03-08', status: 'Inactive', totalDonated: 610, mealsProvided: 2280, co2Saved: 810 },
]

export const ngos = [
  { id: 'NGO-201', name: 'Anna Seva Foundation', location: 'Shivaji Nagar, Pune', phone: '+91 96650 12300', capacity: 1200, rating: 4.8, joined: '2024-06-14', status: 'Active', peopleServed: 18400, distributions: 312, efficiency: 94 },
  { id: 'NGO-202', name: 'Roti Bank Mumbai', location: 'Dadar, Mumbai', phone: '+91 96770 45600', capacity: 2000, rating: 4.6, joined: '2024-04-02', status: 'Active', peopleServed: 31200, distributions: 480, efficiency: 91 },
  { id: 'NGO-203', name: 'Hope Kitchen Trust', location: 'Sadar, Nagpur', phone: '+91 96880 78900', capacity: 900, rating: 4.5, joined: '2024-10-21', status: 'Active', peopleServed: 9600, distributions: 168, efficiency: 88 },
  { id: 'NGO-204', name: 'XYZ Food Foundation', location: 'Aundh, Pune', phone: '+91 96990 11200', capacity: 1500, rating: 4.9, joined: '2025-01-05', status: 'Active', peopleServed: 12800, distributions: 210, efficiency: 96 },
  { id: 'NGO-205', name: 'Sharan Welfare Society', location: 'College Road, Nashik', phone: '+91 97001 22344', capacity: 700, rating: 4.3, joined: '2025-02-27', status: 'Active', peopleServed: 5200, distributions: 94, efficiency: 85 },
]

export const volunteers = [
  { id: 'VOL-301', name: 'Karan Mehta', location: 'Pune', phone: '+91 90210 11223', joined: '2025-01-22', status: 'Active', deliveries: 86, distanceKm: 612, rating: 4.9, vehicle: 'Two-wheeler' },
  { id: 'VOL-302', name: 'Simran Kaur', location: 'Mumbai', phone: '+91 90330 44556', joined: '2024-12-11', status: 'Active', deliveries: 134, distanceKm: 940, rating: 4.8, vehicle: 'Car' },
  { id: 'VOL-303', name: 'Aditya Kulkarni', location: 'Pune', phone: '+91 90440 55667', joined: '2025-03-15', status: 'Active', deliveries: 41, distanceKm: 288, rating: 4.6, vehicle: 'Bicycle' },
  { id: 'VOL-304', name: 'Priya Nair', location: 'Nagpur', phone: '+91 90550 66778', joined: '2025-02-02', status: 'On Delivery', deliveries: 58, distanceKm: 402, rating: 4.7, vehicle: 'Two-wheeler' },
  { id: 'VOL-305', name: 'Yusuf Sheikh', location: 'Nashik', phone: '+91 90660 77889', joined: '2025-04-19', status: 'Active', deliveries: 19, distanceKm: 122, rating: 4.5, vehicle: 'Two-wheeler' },
]

const now = Date.now()
const hrs = (h) => new Date(now + h * 3600 * 1000).toISOString()
const hrsAgo = (h) => new Date(now - h * 3600 * 1000).toISOString()

export const initialDonations = [
  {
    id: 'DON-9001', foodName: 'Vegetable Biryani & Dal', category: 'Cooked Meals', quantity: 60, unit: 'kg',
    description: 'Freshly prepared banquet surplus, still hot-held, vegetarian.', donorId: 'DNR-102', donorName: 'Grand Sapphire Hotel',
    city: 'Mumbai', location: 'Bandra West, Mumbai', distanceKm: 3.2, preparedAt: hrsAgo(1), expiresAt: hrs(5),
    pickupDate: new Date(now + 2 * 3600 * 1000).toISOString().slice(0, 10), pickupTime: '18:30',
    status: 'Pending', ngoId: null, volunteerId: null, createdAt: hrsAgo(1),
  },
  {
    id: 'DON-9002', foodName: 'Assorted Bread & Pastries', category: 'Bakery', quantity: 25, unit: 'kg',
    description: 'End-of-day unsold bakery stock, individually packed.', donorId: 'DNR-106', donorName: 'GreenLeaf Bakery',
    city: 'Pune', location: 'Camp, Pune', distanceKm: 4.8, preparedAt: hrsAgo(3), expiresAt: hrs(20),
    pickupDate: new Date(now + 1 * 3600 * 1000).toISOString().slice(0, 10), pickupTime: '20:00',
    status: 'Accepted', ngoId: 'NGO-201', volunteerId: 'VOL-303', createdAt: hrsAgo(3),
  },
  {
    id: 'DON-9003', foodName: 'Fresh Vegetables (mixed crates)', category: 'Fruits & Vegetables', quantity: 140, unit: 'kg',
    description: 'Slightly imperfect produce, fully edible, near-date stock.', donorId: 'DNR-104', donorName: 'FreshMart Supermarket',
    city: 'Nagpur', location: 'Nagpur Central', distanceKm: 6.1, preparedAt: hrsAgo(6), expiresAt: hrs(48),
    pickupDate: new Date(now + 4 * 3600 * 1000).toISOString().slice(0, 10), pickupTime: '11:00',
    status: 'Picked Up', ngoId: 'NGO-203', volunteerId: 'VOL-304', createdAt: hrsAgo(6),
  },
  {
    id: 'DON-9004', foodName: 'Rice & Sambar (catering surplus)', category: 'Cooked Meals', quantity: 90, unit: 'kg',
    description: 'Wedding catering surplus, sealed containers, vegetarian.', donorId: 'DNR-103', donorName: 'Spice Route Catering',
    city: 'Pune', location: 'Viman Nagar, Pune', distanceKm: 8.4, preparedAt: hrsAgo(2), expiresAt: hrs(6),
    pickupDate: new Date(now + 1 * 3600 * 1000).toISOString().slice(0, 10), pickupTime: '19:15',
    status: 'Delivered', ngoId: 'NGO-204', volunteerId: 'VOL-301', createdAt: hrsAgo(28),
  },
  {
    id: 'DON-9005', foodName: 'Packaged Snacks & Juices', category: 'Packaged Food', quantity: 40, unit: 'boxes',
    description: 'Near-expiry packaged snacks from event surplus.', donorId: 'DNR-101', donorName: 'Ananya Rao',
    city: 'Pune', location: 'Koregaon Park, Pune', distanceKm: 2.1, preparedAt: hrsAgo(4), expiresAt: hrs(72),
    pickupDate: new Date(now + 3 * 3600 * 1000).toISOString().slice(0, 10), pickupTime: '17:00',
    status: 'Pending', ngoId: null, volunteerId: null, createdAt: hrsAgo(4),
  },
  {
    id: 'DON-9006', foodName: 'Milk & Dairy Products', category: 'Dairy', quantity: 30, unit: 'litres',
    description: 'Short-shelf-life dairy nearing sell-by date.', donorId: 'DNR-104', donorName: 'FreshMart Supermarket',
    city: 'Nagpur', location: 'Nagpur Central', distanceKm: 5.5, preparedAt: hrsAgo(1), expiresAt: hrs(18),
    pickupDate: new Date(now + 2 * 3600 * 1000).toISOString().slice(0, 10), pickupTime: '16:45',
    status: 'Accepted', ngoId: 'NGO-203', volunteerId: null, createdAt: hrsAgo(1),
  },
  {
    id: 'DON-9007', foodName: 'Fruit Basket Surplus', category: 'Fruits & Vegetables', quantity: 55, unit: 'kg',
    description: 'Ripe seasonal fruit, best used within two days.', donorId: 'DNR-105', donorName: 'Rohit Deshmukh',
    city: 'Nashik', location: 'College Road, Nashik', distanceKm: 3.9, preparedAt: hrsAgo(5), expiresAt: hrs(40),
    pickupDate: new Date(now + 5 * 3600 * 1000).toISOString().slice(0, 10), pickupTime: '10:30',
    status: 'Pending', ngoId: null, volunteerId: null, createdAt: hrsAgo(5),
  },
  {
    id: 'DON-9008', foodName: 'Cooked Pulao & Curd', category: 'Cooked Meals', quantity: 48, unit: 'kg',
    description: 'Corporate event surplus, vegetarian, hot-held.', donorId: 'DNR-102', donorName: 'Grand Sapphire Hotel',
    city: 'Mumbai', location: 'Bandra West, Mumbai', distanceKm: 4.4, preparedAt: hrsAgo(30), expiresAt: hrsAgo(6),
    pickupDate: new Date(now - 26 * 3600 * 1000).toISOString().slice(0, 10), pickupTime: '19:00',
    status: 'Delivered', ngoId: 'NGO-202', volunteerId: 'VOL-302', createdAt: hrsAgo(30),
  },
]

export const donationTrend = [
  { period: 'Mon', donated: 320, distributed: 290, wasted: 12 },
  { period: 'Tue', donated: 410, distributed: 370, wasted: 18 },
  { period: 'Wed', donated: 380, distributed: 360, wasted: 9 },
  { period: 'Thu', donated: 460, distributed: 420, wasted: 15 },
  { period: 'Fri', donated: 540, distributed: 500, wasted: 20 },
  { period: 'Sat', donated: 610, distributed: 560, wasted: 22 },
  { period: 'Sun', donated: 470, distributed: 440, wasted: 11 },
]

export const monthlyDonations = [
  { month: 'Apr', meals: 8200 }, { month: 'May', meals: 9600 }, { month: 'Jun', meals: 10850 },
  { month: 'Jul', meals: 11200 }, { month: 'Aug', meals: 13400 }, { month: 'Sep', meals: 14800 },
]

export const donationsByCity = [
  { city: 'Pune', value: 3820 }, { city: 'Mumbai', value: 5210 }, { city: 'Nagpur', value: 2140 },
  { city: 'Nashik', value: 1380 }, { city: 'Aurangabad', value: 940 },
]

export const foodCategoryDistribution = [
  { name: 'Cooked Meals', value: 38 }, { name: 'Fruits & Vegetables', value: 22 },
  { name: 'Bakery', value: 14 }, { name: 'Packaged Food', value: 12 },
  { name: 'Dairy', value: 9 }, { name: 'Grains & Cereals', value: 5 },
]

export const ngoPerformance = ngos.map(n => ({ name: n.name.split(' ')[0], efficiency: n.efficiency, distributions: n.distributions }))

export const volunteerPerformance = volunteers.map(v => ({ name: v.name.split(' ')[0], deliveries: v.deliveries, distance: v.distanceKm }))

export const donationForecast = [
  { period: 'Week 1', actual: 2900, forecast: 2850 },
  { period: 'Week 2', actual: 3100, forecast: 3050 },
  { period: 'Week 3', actual: 3400, forecast: 3300 },
  { period: 'Week 4', actual: null, forecast: 3600 },
  { period: 'Week 5', actual: null, forecast: 3820 },
  { period: 'Week 6', actual: null, forecast: 4050 },
]

export const surplusAreas = [
  { area: 'Bandra West, Mumbai', level: 'High', volume: 1240, lat: 19.06, lng: 72.83 },
  { area: 'Viman Nagar, Pune', level: 'High', volume: 980, lat: 18.57, lng: 73.91 },
  { area: 'Nagpur Central', level: 'Medium', volume: 640, lat: 21.15, lng: 79.09 },
  { area: 'College Road, Nashik', level: 'Medium', volume: 410, lat: 20.0, lng: 73.78 },
  { area: 'Camp, Pune', level: 'Low', volume: 220, lat: 18.51, lng: 73.88 },
]

export const demandAreas = [
  { area: 'Shivaji Nagar, Pune', level: 'High', meals: 3400, lat: 18.53, lng: 73.85 },
  { area: 'Dadar, Mumbai', level: 'High', meals: 4200, lat: 19.02, lng: 72.84 },
  { area: 'Sadar, Nagpur', level: 'Medium', meals: 1900, lat: 21.15, lng: 79.08 },
  { area: 'Aundh, Pune', level: 'Medium', meals: 1500, lat: 18.56, lng: 73.81 },
  { area: 'Aurangabad City', level: 'Low', meals: 700, lat: 19.88, lng: 75.34 },
]

export const aiRecommendations = [
  { donationId: 'DON-9001', ngo: 'Roti Bank Mumbai', distanceKm: 2.4, requiredCapacity: 500, confidence: 92 },
  { donationId: 'DON-9005', ngo: 'Anna Seva Foundation', distanceKm: 1.8, requiredCapacity: 260, confidence: 88 },
  { donationId: 'DON-9007', ngo: 'Sharan Welfare Society', distanceKm: 3.1, requiredCapacity: 180, confidence: 84 },
]

export const initialNotifications = [
  { id: 'NTF-1', title: 'New donation available nearby', body: 'Vegetable Biryani & Dal (60kg) posted 3.2km from Roti Bank Mumbai.', type: 'donation', read: false, time: hrsAgo(0.3) },
  { id: 'NTF-2', title: 'Donation accepted', body: 'Anna Seva Foundation accepted your Bakery donation (DON-9002).', type: 'accepted', read: false, time: hrsAgo(1) },
  { id: 'NTF-3', title: 'Volunteer assigned', body: 'Aditya Kulkarni has been assigned to pick up DON-9002.', type: 'volunteer', read: false, time: hrsAgo(1.2) },
  { id: 'NTF-4', title: 'Pickup reminder', body: 'Pickup for DON-9004 is scheduled within the hour.', type: 'reminder', read: true, time: hrsAgo(5) },
  { id: 'NTF-5', title: 'Delivery completed', body: 'DON-9004 was delivered to XYZ Food Foundation successfully.', type: 'delivered', read: true, time: hrsAgo(26) },
  { id: 'NTF-6', title: 'Food expiry warning', body: 'DON-9008 is nearing its safe consumption window.', type: 'warning', read: true, time: hrsAgo(29) },
  { id: 'NTF-7', title: 'AI demand alert', body: 'Predicted demand spike in Dadar, Mumbai over the next 48 hours.', type: 'ai', read: false, time: hrsAgo(2) },
]

export const adminUsers = [
  ...donors.map(d => ({ id: d.id, name: d.name, role: 'Donor', location: d.location, status: d.status, joined: d.joined })),
  ...ngos.map(n => ({ id: n.id, name: n.name, role: 'NGO', location: n.location, status: n.status, joined: n.joined })),
  ...volunteers.map(v => ({ id: v.id, name: v.name, role: 'Volunteer', location: v.location, status: v.status, joined: v.joined })),
]

export const reportsCatalog = [
  { id: 'RPT-1', name: 'Monthly Food Donation Report', period: 'September 2026', description: 'Total food donated, donor participation and category breakdown for the month.' },
  { id: 'RPT-2', name: 'NGO Performance Report', period: 'Q3 2026', description: 'Distribution efficiency, response time and rating across active NGOs.' },
  { id: 'RPT-3', name: 'Food Waste Reduction Report', period: 'September 2026', description: 'Waste prevented versus donated, trended against the previous quarter.' },
  { id: 'RPT-4', name: 'Regional Impact Report', period: 'Q3 2026', description: 'City-wise meals served, people reached and NGO coverage.' },
  { id: 'RPT-5', name: 'Volunteer Performance Report', period: 'September 2026', description: 'Deliveries completed, distance covered and on-time pickup rate.' },
  { id: 'RPT-6', name: 'Environmental Impact Report', period: 'Q3 2026', description: 'Estimated CO₂ emissions avoided through redirected surplus food.' },
]

export const platformStats = {
  foodDonatedKg: 128400,
  mealsServed: 512600,
  activeDonors: 3120,
  ngosConnected: 480,
  foodSavedKg: 118900,
  co2ReducedTons: 412,
}
