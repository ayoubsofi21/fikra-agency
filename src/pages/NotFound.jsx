import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Home } from 'lucide-react'
import { Button, Container, Section } from '@/components/ui'
import { cn } from '@/utils/helpers'

const NotFound = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language

  const suggestions = [
    '/services',
    '/solutions',
    '/portfolio',
    '/contact',
  ]

  return (
    <div className={cn('min-h-screen flex items-center justify-center px-4', lang === 'ar' ? 'font-sans' : '')}>
      <Helmet>
        <title>404 — {t('404.notFound')} | {t('common.brandFull')}</title>
        <meta name="description" content={t('404.subheadline')} />
      </Helmet>

      <Section variant="gradient" spacing="hero" className="relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-grid-small opacity-20" />


        <Container className="relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ease: 'easeOut', duration: 0.5 }}>
            <div className="text-9xl font-semibold text-white mb-6">404</div>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              {t('404.headline')}
            </h1>
            <p className="text-xl text-white/80 mb-10">
              {t('404.subheadline')}
            </p>

            <div className="text-start mb-10">
              <h2 className="text-lg font-semibold text-white mb-4">{t('404.suggestions')}</h2>
              <ul className="space-y-2">
                {suggestions.map((path) => (
                  <li key={path}>
                    <a
                      href={path}
                      onClick={(e) => { e.preventDefault(); navigate(path) }}
                      className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {path}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <Button size="lg" variant="white" icon={Home} onClick={() => navigate('/')}>
              {t('404.backHome')}
            </Button>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}

export default NotFound
