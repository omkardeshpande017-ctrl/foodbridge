# FoodBridge — Food Donation Data Analytics Platform

A complete, multi-page React + Vite frontend for a food-donation platform connecting
Donors, NGOs, Volunteers and Admins. Runs entirely on mock data + localStorage, so it
works with **no backend** out of the box, but is structured so a real Node/Express +
MongoDB API and Google Maps key can be dropped in later.

## Run it locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually **http://localhost:5173**).

To create a production build:

```bash
npm run build
npm run preview
```

## Logging in

There's no real backend, so login works with **any email + any password** — just pick
a role. Each role drops you into that dashboard:

- **Donor** → `/donor/dashboard`
- **NGO** → `/ngo/dashboard`
- **Volunteer** → `/volunteer/dashboard`
- **Admin** → `/admin/dashboard`

You can also register a new account from `/register` — the form fields adapt to the
role you pick.

## What's inside

```
src/
  components/
    common/     DashboardCard, DonationCard, StatusBadge, ChartCard, Modal,
                DataTable, NotificationItem, MapPanel, LoadingSpinner, EmptyState
    layout/     Navbar, Footer, Sidebar, DashboardLayout
  pages/        LandingPage, Analytics, AIInsights, MapRoute, Reports,
                Notifications, Profile, NotFound
    auth/       Login, Register
    donor/      DonorDashboard, DonateFood, MyDonations
    ngo/        NGODashboard, NearbyDonations, Distribution
    volunteer/  VolunteerDashboard, PickupTasks
    admin/      AdminDashboard, UserManagement
  context/      AuthContext, ToastContext
  services/     authService, donationService, notificationService
                (all read/write to localStorage — swap for real API calls later)
  data/         mockData.js — every seed record used across the app
  routes/       ProtectedRoute, navConfig (per-role sidebar items)
  hooks/        useLocalStorage
  utils/        format.js, storage.js
```

## Data persistence

Donations and notifications are seeded into `localStorage` on first load
(`src/services/*.js`), so anything you create (post a donation, accept it, advance a
delivery, mark notifications read) survives a page refresh. Clearing your browser's
site data resets the demo back to the original seed.

## Wiring up a real backend later

- Replace the functions in `src/services/*.js` with `fetch`/`axios` calls to your
  Express + MongoDB API — the rest of the app only talks to these service functions,
  so page components don't need to change.
- `src/components/common/MapPanel.jsx` renders a mock map from lat/lng points. Swap
  its internals for `@react-google-maps/api`'s `<GoogleMap>` once you have a
  `VITE_GOOGLE_MAPS_KEY` — the point shape (`{ lat, lng, label }`) is already
  Maps-ready.
- AI predictions in `AIInsights.jsx` and the heat map are clearly labeled as demo/mock
  — point `aiRecommendations`, `donationForecast`, `surplusAreas` and `demandAreas` in
  `src/data/mockData.js` at your real model's output when it's ready.

## Tech stack

React 18 · Vite 5 · React Router 6 · Tailwind CSS 3 · Recharts 2 · lucide-react
