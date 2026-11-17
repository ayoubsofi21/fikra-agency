import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import AppRoutes from '@/routes/AppRoutes'
import { Navbar, Footer, ScrollProgress, ScrollToTop, FloatingWhatsApp } from '@/components/layout'

const BASE_URL = 'https://fikra.agency'

// Keep canonical + og:url in sync with the current route (SPA SEO)
const updateSeoUrls = (pathname) => {
  const path = pathname.replace(/\/+$/, '') || '/'
  const url = `${BASE_URL}${path === '/' ? '/' : path}`

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', url)

  let ogUrl = document.head.querySelector('meta[property="og:url"]')
  if (!ogUrl) {
    ogUrl = document.createElement('meta')
    ogUrl.setAttribute('property', 'og:url')
    document.head.appendChild(ogUrl)
  }
  ogUrl.setAttribute('content', url)
}

const App = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    updateSeoUrls(location.pathname)
  }, [location.pathname])

  // The admin area renders its own shell (sidebar, topbar, no public chrome).
  if (isAdmin) return <AppRoutes />

  return (
    <MotionConfig reducedMotion="user">
      {/* Site defaults; per-page Helmets override these (innermost wins) */}
      <Helmet>
        <meta
          name="description"
          content="FIKRA Agency builds custom websites, reusable digital solutions, and SaaS-style tools for businesses worldwide. From Morocco to the world."
        />
        <meta property="og:title" content="FIKRA Agency — From idea to digital reality" />
        <meta
          property="og:description"
          content="Custom websites, reusable digital solutions, and SaaS-style tools — built for performance, accessibility, and growth."
        />
        <meta property="og:image" content="https://fikra.agency/og-image.png" />
      </Helmet>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[1300] focus:rounded-xl focus:bg-primary focus:px-5 focus:py-3 focus:font-medium focus:text-white focus:shadow-xl"
      >
        {t('common.skipToContent')}
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <AppRoutes />
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingWhatsApp />
    </MotionConfig>
  )
}

export default App
