import React from 'react'
import { Leaf } from 'lucide-react'

export default function LoadingSpinner({ label = 'Loading…', fullscreen = false }) {
  const content = (
    <div className="flex flex-col items-center gap-3 py-12">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-leaf-300 border-t-forest-700 animate-spin" />
        <Leaf size={16} className="absolute inset-0 m-auto text-forest-700" />
      </div>
      <p className="text-sm text-ink-400">{label}</p>
    </div>
  )
  if (fullscreen) {
    return <div className="min-h-[60vh] flex items-center justify-center">{content}</div>
  }
  return content
}
