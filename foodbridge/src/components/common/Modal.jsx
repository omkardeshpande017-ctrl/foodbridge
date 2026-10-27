import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative bg-white rounded-xl2 shadow-lift w-full ${sizes[size]} max-h-[85vh] overflow-y-auto animate-rise`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest-100 sticky top-0 bg-white rounded-t-xl2">
          <h3 className="font-display text-lg text-ink">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-sand-200 flex items-center justify-center focus-ring">
            <X size={17} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-forest-100 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
