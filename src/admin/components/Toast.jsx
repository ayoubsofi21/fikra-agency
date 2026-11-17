import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => setToasts((all) => all.filter((toast) => toast.id !== id)), [])

  const toast = useCallback((message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((all) => [...all, { id, message, tone }])
    return id
  }, [])

  useEffect(() => {
    if (!toasts.length) return undefined
    const timer = setTimeout(() => dismiss(toasts[0].id), 4000)
    return () => clearTimeout(timer)
  }, [toasts, dismiss])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 end-4 z-[1100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-background px-4 py-3 text-sm shadow-lg ${item.tone === 'error' ? 'border-danger/40 text-danger' : 'border-success/40 text-text'}`}
            role={item.tone === 'error' ? 'alert' : 'status'}
          >
            {item.tone === 'error' ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />}
            <span className="flex-1">{item.message}</span>
            <button type="button" onClick={() => dismiss(item.id)} aria-label="Close" className="text-muted hover:text-text"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export default ToastContext
