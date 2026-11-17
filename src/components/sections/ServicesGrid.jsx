import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, Code2, ShoppingCart, Cloud, Palette, Server, Headphones, TrendingUp } from 'lucide-react'
import { Container, Section, SectionTitle, Card } from '@/components/ui'
import { StaggerItem } from '@/components/layout'
import { useServices } from '@/hooks/useContent'
import { cn } from '@/utils/helpers'

const iconMap = {
  Code2, ShoppingCart, Cloud, Palette, Server, Headphones, TrendingUp,
}

const ServiceCard = ({ service, index, lang }) => {
  const { t } = useTranslation()
  const Icon = iconMap[service.icon] || Code2

  return (
    <StaggerItem delay={index * 0.1}>
      <motion.div className="h-full">
        <Card className="h-full group">
          <div className="px-6 pt-6 pb-4">
            <div className={cn(
              'w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4',
              lang === 'ar' && 'font-sans'
            )}>
              <Icon className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-semibold text-text mb-2">{service.name[lang] || service.name.en}</h2>
            <p className="text-muted">{service.short[lang] || service.short.en}</p>
          </div>
          <div className="px-6 pb-6">
            <a href={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-primary font-medium">
              {t('common.learnMore')} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Card>
      </motion.div>
    </StaggerItem>
  )
}

export const ServicesGrid = ({ showHeader = true }) => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const services = useServices()

  return (
    <Section variant="light" spacing="default">
      <Container>
        {showHeader && (
          <SectionTitle
            eyebrow={t('services.eyebrow')}
            title={t('services.headline')}
            subtitle={t('services.subheadline')}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} lang={lang} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
