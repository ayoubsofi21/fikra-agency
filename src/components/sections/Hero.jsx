import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Container, Section } from '@/components/ui'
import { projects } from '@/data/mock'

const [featured, secondary, tertiary] = projects

export const Hero = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const titleOf = (project) => project.title[lang] || project.title.en
  const categoryOf = (project) => t(`portfolio.category.${project.category}`)

  return (
    <Section variant="gradient" spacing="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-small opacity-30" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Headline on calm space */}
          <div className="max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: 'easeOut', duration: 0.6, delay: 0.1 }}
              className="mb-6 text-4xl font-semibold leading-[1.1] text-white sm:text-5xl md:text-6xl"
            >
              {t('hero.headline')}{' '}
              <span className="text-accent">{t('hero.headlineHighlight')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: 'easeOut', duration: 0.6, delay: 0.2 }}
              className="mb-10 max-w-lg text-lg leading-relaxed text-white/75 sm:text-xl"
            >
              {t('hero.subheadline')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: 'easeOut', duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 font-medium text-primary transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
              >
                {t('nav.getQuote')}
              </Link>
              <Link
                to="/solutions"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-7 py-3.5 font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
              >
                {t('nav.exploreSolutions')}
              </Link>
            </motion.div>
          </div>

          {/* Work montage: real project screens rising from the bottom edge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: 'easeOut', duration: 0.7, delay: 0.4 }}
            className="relative -mb-32 self-end md:-mb-40 lg:-mb-48"
          >
            {/* Fanned preview screens behind the main window (image-only so the
                overlap cuts through the photo, never through text) */}
            <div className="absolute -start-12 -top-16 z-0 hidden w-44 overflow-hidden rounded-lg border border-white/10 bg-[#131A38] shadow-xl xl:block">
              <img src={secondary.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
            </div>
            <div className="absolute -top-20 end-8 z-0 hidden w-40 overflow-hidden rounded-lg border border-white/10 bg-[#131A38] shadow-xl 2xl:block">
              <img src={tertiary.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
            </div>

            {/* Main project screen */}
            <Link
              to="/portfolio"
              aria-label={t('common.viewProject')}
              className="relative z-10 block overflow-hidden rounded-lg border border-white/10 bg-[#131A38] shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
            >
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden="true" />
                <span className="ms-3 truncate font-mono text-[11px] text-white/40" aria-hidden="true">
                  fikra.agency/work/{featured.slug}
                </span>
              </div>
              <img
                src={featured.image}
                alt={titleOf(featured)}
                width={1200}
                height={750}
                loading="eager"
                decoding="async"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="flex items-baseline justify-between gap-3 px-4 pb-6 pt-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{titleOf(featured)}</p>
                  <p className="text-xs text-white/45">{categoryOf(featured)}</p>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-accent">{featured.year}</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
