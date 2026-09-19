import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-sand-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-leaf-300 text-forest-900 flex items-center justify-center">
              <Leaf size={16} />
            </span>
            <span className="font-display text-lg font-semibold">FoodBridge</span>
          </div>
          <p className="text-sm text-sand-100/70 leading-relaxed max-w-xs">
            Connecting surplus food with people who need it — through donors, NGOs, volunteers and data.
          </p>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-leaf-300 mb-3">Platform</h5>
          <ul className="space-y-2 text-sm text-sand-100/70">
            <li><Link to="/analytics" className="hover:text-white">Analytics</Link></li>
            <li><Link to="/ai-insights" className="hover:text-white">AI Insights</Link></li>
            <li><Link to="/reports" className="hover:text-white">Reports</Link></li>
            <li><Link to="/map" className="hover:text-white">Live Map</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-leaf-300 mb-3">Get Involved</h5>
          <ul className="space-y-2 text-sm text-sand-100/70">
            <li><Link to="/register" className="hover:text-white">Become a Donor</Link></li>
            <li><Link to="/register" className="hover:text-white">Register your NGO</Link></li>
            <li><Link to="/register" className="hover:text-white">Volunteer with us</Link></li>
            <li><Link to="/login" className="hover:text-white">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-leaf-300 mb-3">Contact</h5>
          <ul className="space-y-2.5 text-sm text-sand-100/70">
            <li className="flex items-center gap-2"><MapPin size={14} /> Pune, Maharashtra, India</li>
            <li className="flex items-center gap-2"><Mail size={14} /> hello@foodbridge.demo</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +91 98200 00000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-sand-100/50">
        © 2026 FoodBridge. A demo analytics platform for reducing food waste.
      </div>
    </footer>
  )
}
