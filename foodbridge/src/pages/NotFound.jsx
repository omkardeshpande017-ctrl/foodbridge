import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-5 text-center">
      <span className="w-14 h-14 rounded-full bg-leaf-100 text-forest-700 flex items-center justify-center mb-5">
        <Leaf size={26} />
      </span>
      <h1 className="font-display text-4xl text-ink">404</h1>
      <p className="text-ink-600 mt-2">This page doesn't exist — but there's plenty of surplus food to rescue elsewhere.</p>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 bg-forest-700 text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-forest-900 transition-colors">
        Back to home
      </Link>
    </div>
  )
}
