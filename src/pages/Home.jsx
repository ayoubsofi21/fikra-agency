import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { PageTransition } from '@/components/layout'
import {
  Hero,
  Stats,
  ServicesGrid,
  SolutionsShowcase,
  ProjectsGrid,
  Process,
  TechStack,
  Testimonials,
  CTA,
} from '@/components/sections'

const HomePage = () => {
  const { t } = useTranslation()
  const scrollRef = useRef(null)

  return (
    <>
      <Helmet>
        <title>{t('common.brandFull')} - {t('common.tagline')}</title>
        <meta name="description" content={t('hero.subheadline')} />
        <meta property="og:title" content={t('common.brandFull')} />
        <meta property="og:description" content={t('hero.subheadline')} />
        <meta property="og:image" content="https://fikra.agency/og-image.png" />
      </Helmet>

      <div ref={scrollRef}>
        <PageTransition>
          <Hero />
          <Stats />
          <ServicesGrid />
          <SolutionsShowcase />
          <ProjectsGrid />
          <Process />
          <TechStack />
          <Testimonials />
          <CTA />
        </PageTransition>
      </div>
    </>
  )
}

export default HomePage
