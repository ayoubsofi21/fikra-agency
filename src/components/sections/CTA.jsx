import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Container, Section, Button } from '@/components/ui'

// Client-side navigation instead of full page reloads
const MotionLink = motion.create(Link)

export const CTA = () => {
  const { t } = useTranslation()

  return (
    <Section variant="gradient" spacing="hero" className="relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-grid-small opacity-20" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ ease: 'easeOut', duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6">
            {t('services.cta')}
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            {t('services.ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MotionLink to="/contact" whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="white" className="w-full sm:w-auto">
                {t('nav.getQuote')} <ArrowRight className="w-5 h-5" />
              </Button>
            </MotionLink>
            <MotionLink to="/solutions" whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                {t('nav.exploreSolutions')}
              </Button>
            </MotionLink>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
