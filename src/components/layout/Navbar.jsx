import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useLang } from '@/context/LangProvider'
import { useTheme } from '@/context/ThemeProvider'
import { LangSwitcher, ThemeToggle } from './LangSwitcher'
import { cn } from '@/utils/helpers'

const NAV_ITEMS = [
  { label: 'nav.home', href: '/' },
  { label: 'nav.services', href: '/services' },
  { label: 'nav.solutions', href: '/solutions' },
  { label: 'nav.portfolio', href: '/portfolio' },
  { label: 'nav.about', href: '/about' },
  { label: 'nav.team', href: '/team' },
  { label: 'nav.pricing', href: '/pricing' },
  { label: 'nav.blog', href: '/blog' },
  { label: 'nav.contact', href: '/contact' },
]

/**
 * True when the solid surface behind the navbar is dark, so the navbar must
 * switch to light text for contrast. Probes the actually rendered background
 * instead of guessing from the route: works for dark hero sections, the dark
 * footer passing underneath, and both themes. Returns null when the element
 * has no solid background (keep looking further down the stack).
 */
const surfaceIsDark = (el) => {
  const bg = getComputedStyle(el).backgroundColor
  if (!bg || bg === 'rgba(0, 0, 0, 0)') return null
  if (bg.startsWith('oklch')) {
    const m = bg.match(/oklch\(([\d.]+)/)
    return m ? parseFloat(m[1]) < 0.62 : null
  }
  const parts = bg.match(/[\d.]+/g)
  if (!parts) return null
  const [r, g, b, a = 1] = parts.map(Number)
  if (a < 0.55) return null
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.45
}

export const Navbar = ({ fixed = true, blur = true }) => {
  const [scrolled, setScrolled] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [onDark, setOnDark] = useState(false)
  const lastY = useRef(0)
  const location = useLocation()
  const { t } = useLang()
  const { isDark } = useTheme()

  const probeBehind = useCallback(() => {
    const stack = document.elementsFromPoint(window.innerWidth / 2, 40)
    for (const el of stack) {
      if (el.closest('header')) continue
      const dark = surfaceIsDark(el)
      if (dark !== null) { setOnDark(dark); return }
    }
    setOnDark(false)
  }, [])

  // Probe before paint on mount and on route/theme change (no flash of the
  // wrong color), and during scroll (the surface behind the navbar changes).
  useLayoutEffect(() => { probeBehind() }, [probeBehind, location.pathname, isDark])

  // Route content mounts asynchronously (lazy chunks behind Suspense), so the
  // first probe can run before the hero exists. Re-probe whenever the DOM
  // structure changes underneath, debounced to one probe per frame.
  useEffect(() => {
    let raf = 0
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(probeBehind) }
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })
    schedule()
    return () => { observer.disconnect(); cancelAnimationFrame(raf) }
  }, [probeBehind])

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 16)
      setShowNav(y < lastY.current || y < 10)
      lastY.current = y
      probeBehind()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [probeBehind])

  useEffect(() => { setMobileOpen(false) }, [location])

  const navClass = cn(
    'fixed top-0 left-0 right-0 z-[1040] transition-[transform,background-color] duration-300',
    fixed && 'top-0',
    !fixed && 'static',
    showNav ? 'translate-y-0' : '-translate-y-full',
    blur && scrolled ? 'glass' : 'bg-transparent',
  )

  return (
    <>
      <header className={cn('transition-shadow duration-300', scrolled ? 'shadow-lg shadow-black/5' : '')}>
        <nav className={navClass}>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-semibold text-xl">
                  F
                </div>
                <span className={cn('font-semibold text-xl tracking-tight', onDark ? 'text-white' : 'text-text')}>
                  {t('common.brandFull')}
                </span>
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink key={item.href} href={item.href} label={t(item.label)} onDark={onDark} />
                ))}
              </div>

              <div className="hidden lg:flex items-center gap-3">
                <LangSwitcher align="left" onDark={onDark} />
                <ThemeToggle onDark={onDark} />
                <Link to="/contact">
                  <button
                    className={cn(
                      'px-6 py-2.5 rounded-lg font-medium transition-colors',
                      onDark
                        ? 'bg-white text-indigo-950 hover:bg-white/90'
                        : 'bg-primary text-white hover:bg-indigo-600',
                    )}
                  >
                    {t('nav.getQuote')}
                  </button>
                </Link>
              </div>

              <button
                onClick={() => setMobileOpen(true)}
                className={cn(
                  'lg:hidden p-2 focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg',
                  onDark ? 'text-white' : 'text-text',
                )}
                aria-label={t('nav.menu')}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

const NavLink = ({ href, label, onDark = false }) => {
  const location = useLocation()
  const isActive = location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <Link to={href} className={cn(
      'px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
      isActive
        ? (onDark ? 'text-white' : 'text-primary')
        : (onDark ? 'text-white/75 hover:text-white' : 'text-muted hover:text-text'),
    )}>
      {label}
      {isActive && (
        <motion.div layoutId="activeNav" className={cn('absolute inset-x-1 -bottom-1 h-0.5 rounded-full', onDark ? 'bg-accent' : 'bg-primary')} />
      )}
    </Link>
  )
}

export const MobileMenu = ({ open, onClose }) => {
  const { t, isRTL } = useLang()
  const location = useLocation()
  const { isDark } = useTheme()

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1045]"
          />
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'fixed top-0 end-0 h-full w-full max-w-md z-[1046] bg-background border-s border-border p-6',
              isDark && 'bg-[#121936]'
            )}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-semibold text-2xl text-text">{t('nav.menu')}</span>
              <button
                onClick={onClose}
                className="p-2 text-muted hover:text-text focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
                aria-label={t('nav.closeMenu')}
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                      ? 'bg-primary/10 text-primary'
                      : 'text-text hover:bg-surfaceAlt hover:text-text'
                  )}
                >
                  {t(item.label)}
                </Link>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-border space-y-4">
              <div className="flex items-center gap-4">
                <LangSwitcher align="right" />
                <ThemeToggle />
              </div>
              <Link to="/contact" onClick={onClose} className="block">
                <button className="w-full bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-600 transition-colors">
                  {t('nav.getQuote')}
                </button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Navbar
