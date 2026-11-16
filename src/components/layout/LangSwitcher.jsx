import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages } from 'lucide-react'
import { useLang } from '@/context/LangProvider'
import { useTheme } from '@/context/ThemeProvider'
import { cn } from '@/utils/helpers'

export const LangSwitcher = ({ className, align = 'right', onDark = false }) => {
  const { lang, languages, changeLanguage, t } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const current = languages.find((l) => l.code === lang) || languages[0]

  return (
    <div className={cn('relative inline-block', className)} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={t('common.changeLanguage')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="lang-menu"
        className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-surfaceAlt transition-colors text-text font-medium focus-visible:ring-2 focus-visible:ring-primary/40', onDark && 'text-white hover:bg-white/10', align === 'right' ? 'justify-end' : 'justify-start')}
      >
        <Languages className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">{current.name}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="lang-menu"
            role="menu"
            aria-label={t('common.changeLanguage')}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-50 mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden min-w-[140px]',
              align === 'right' ? 'end-0' : 'start-0'
            )}
          >
            {languages.map((l) => (
              <button
                key={l.code}
                role="menuitemradio"
                aria-checked={lang === l.code}
                onClick={() => { changeLanguage(l.code); setOpen(false) }}
                className={cn(
                  'w-full px-4 py-3 text-start flex items-center gap-3 hover:bg-surfaceAlt transition-colors',
                  lang === l.code && 'bg-primary/5 text-primary'
                )}
              >
                <span className="w-4 text-center font-mono text-xs uppercase text-muted" aria-hidden="true">{l.code}</span>
                <span>{l.name}</span>
                {lang === l.code && (
                  <svg className="ms-auto h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const ThemeToggle = ({ className, onDark = false }) => {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useLang()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      aria-label={t('common.toggleTheme')}
      aria-pressed={isDark}
      data-testid="theme-toggle"
      className={cn('p-2.5 rounded-xl hover:bg-surfaceAlt transition-colors text-text focus-visible:ring-2 focus-visible:ring-primary/40', onDark && 'text-white hover:bg-white/10', className)}
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      )}
    </button>
  )
}

export default LangSwitcher
