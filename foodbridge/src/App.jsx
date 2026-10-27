import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { donorNavItems, ngoNavItems, volunteerNavItems, adminNavItems } from './routes/navConfig.js'

import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Analytics from './pages/Analytics.jsx'
import AIInsights from './pages/AIInsights.jsx'
import MapRoute from './pages/MapRoute.jsx'
import Reports from './pages/Reports.jsx'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'

import DonorDashboard from './pages/donor/DonorDashboard.jsx'
import DonateFood from './pages/donor/DonateFood.jsx'
import MyDonations from './pages/donor/MyDonations.jsx'

import NGODashboard from './pages/ngo/NGODashboard.jsx'
import NearbyDonations from './pages/ngo/NearbyDonations.jsx'
import Distribution from './pages/ngo/Distribution.jsx'

import VolunteerDashboard from './pages/volunteer/VolunteerDashboard.jsx'
import PickupTasks from './pages/volunteer/PickupTasks.jsx'

import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/analytics" element={<Analytics />} />

      {/* Donor */}
      <Route
        path="/donor"
        element={
          <ProtectedRoute roles={['donor']}>
            <DashboardLayout items={donorNavItems} title="Donor Dashboard" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DonorDashboard />} />
        <Route path="donate" element={<DonateFood />} />
        <Route path="donations" element={<MyDonations />} />
      </Route>

      {/* NGO */}
      <Route
        path="/ngo"
        element={
          <ProtectedRoute roles={['ngo', 'admin']}>
            <DashboardLayout items={ngoNavItems} title="NGO Dashboard" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<NGODashboard />} />
        <Route path="donations" element={<NearbyDonations />} />
        <Route path="distribution" element={<Distribution />} />
      </Route>

      {/* Volunteer */}
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute roles={['volunteer']}>
            <DashboardLayout items={volunteerNavItems} title="Volunteer Dashboard" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VolunteerDashboard />} />
        <Route path="tasks" element={<PickupTasks />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout items={adminNavItems} title="Admin Dashboard" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* Shared authenticated pages — render inside whichever role's layout they were reached from */}
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <SharedPage><MapRoute /></SharedPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-insights"
        element={
          <ProtectedRoute>
            <SharedPage><AIInsights /></SharedPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <SharedPage><Reports /></SharedPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <SharedPage><Notifications /></SharedPage>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <SharedPage><Profile /></SharedPage>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

// Wraps a shared authenticated page (map, AI insights, reports, notifications, profile)
// in the correct role's sidebar/topbar so navigation stays consistent wherever the
// person came from.
const NAV_BY_ROLE = { donor: donorNavItems, ngo: ngoNavItems, volunteer: volunteerNavItems, admin: adminNavItems }
const TITLE_BY_ROLE = { donor: 'Donor Dashboard', ngo: 'NGO Dashboard', volunteer: 'Volunteer Dashboard', admin: 'Admin Dashboard' }

function SharedPage({ children }) {
  const { user } = useAuth()
  const items = NAV_BY_ROLE[user?.role] || donorNavItems
  const title = TITLE_BY_ROLE[user?.role] || 'Dashboard'
  return (
    <DashboardLayout items={items} title={title}>
      {children}
    </DashboardLayout>
  )
}
