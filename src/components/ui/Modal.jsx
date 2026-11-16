import { useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/helpers'

export const Modal = ({ isOpen, onClose, children, title, size = 'md', closeOnBackdrop = true, closeOnEsc = true }) => {
  const { t } = useTranslation()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => { if (closeOnEsc && e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => { document.removeEventListener('keydown', handleEsc); document.body.style.overflow = '' }
  }, [isOpen, onClose, closeOnEsc])

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-[95vw]' }

  const handleClose = useCallback(() => { if (closeOnBackdrop && onClose) onClose() }, [onClose, closeOnBackdrop])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-[1080] bg-black/60 backdrop-blur-sm" onClick={handleClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div className="fixed left-1/2 top-1/2 z-[1090] w-full -translate-x-1/2 -translate-y-1/2" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              tabIndex={-1}
              className={cn('bg-background rounded-xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col focus:outline-none', sizes[size])}
            >
              {(title || onClose) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  {title && <h3 className="text-lg font-semibold text-text">{title}</h3>}
                  {onClose && (
                    <button
                      onClick={onClose}
                      aria-label={t('common.close')}
                      className="p-2 rounded-lg hover:bg-surfaceAlt transition-colors text-muted hover:text-text focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
              <div className="overflow-y-auto">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
