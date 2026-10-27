import React, { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: <CheckCircle2 size={18} className="text-leaf-700" />,
  error: <XCircle size={18} className="text-berry" />,
  info: <Info size={18} className="text-forest-500" />,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const notify = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => dismiss(id), 3600)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className="animate-toast flex items-start gap-2.5 bg-white border border-forest-100 shadow-lift rounded-xl px-4 py-3">
            {ICONS[t.type]}
            <p className="text-sm text-ink-600 flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-ink-400 hover:text-ink focus-ring rounded">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
