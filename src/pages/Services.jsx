import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { PageTransition } from '@/components/layout'
import { Container } from '@/components/ui'
import { ServicesGrid, TechStack, Testimonials, CTA } from '@/components/sections'

const ServicesPage = () => {
  const { t } = useTranslation()
  const scrollRef = useRef(null)

  return (
    <div ref={scrollRef}>
      <Helmet>
        <title>{t('nav.services')} - {t('common.brandFull')}</title>
        <meta name="description" content={t('services.subheadline')} />
      </Helmet>

      <PageTransition>
        <div className="pt-32 pb-16">
          <Container>
            <h1 className="text-4xl md:text-5xl font-semibold text-text mb-6">{t('services.headline')}</h1>
            <p className="text-xl text-muted max-w-3xl">{t('services.subheadline')}</p>
          </Container>
        </div>
      </PageTransition>

      <ServicesGrid showHeader={false} />
      <TechStack />
      <Testimonials />
      <CTA />
    </div>
  )
}

export default ServicesPage
