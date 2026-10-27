import {
  LayoutDashboard, PackagePlus, PackageSearch, History, BarChart3, Bell, User,
  Truck, ListChecks, Route as RouteIcon, CheckCircle2, Users, ShieldCheck, Bike,
  Sparkles, FileText, Settings, Building2,
} from 'lucide-react'

export const donorNavItems = [
  { to: '/donor/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/donor/donate', label: 'Donate Food', icon: PackagePlus },
  { to: '/donor/donations', label: 'My Donations', icon: History },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

export const ngoNavItems = [
  { to: '/ngo/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/ngo/donations', label: 'Nearby Donations', icon: PackageSearch },
  { to: '/ngo/distribution', label: 'Distribution', icon: Truck },
  { to: '/map', label: 'Map & Route', icon: RouteIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

export const volunteerNavItems = [
  { to: '/volunteer/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/volunteer/tasks', label: 'Pickup Tasks', icon: ListChecks },
  { to: '/map', label: 'Route', icon: RouteIcon },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

export const adminNavItems = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/ngo/donations', label: 'Donations', icon: PackageSearch },
  { to: '/admin/users', label: 'NGOs', icon: ShieldCheck },
  { to: '/admin/users', label: 'Volunteers', icon: Bike },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/ai-insights', label: 'AI Predictions', icon: Sparkles },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/profile', label: 'System Settings', icon: Settings },
]

export { CheckCircle2, Building2 }
