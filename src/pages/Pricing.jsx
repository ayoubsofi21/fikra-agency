import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Container, Card, Badge, Button, Section, SectionTitle } from '@/components/ui'
import { PageTransition } from '@/components/layout'
import { pricing } from '@/data/mock'
import { cn } from '@/utils/helpers'

const BillingToggle = ({ type, onChange }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-3 justify-center mb-8">
      <span className={cn('text-sm font-medium', type === 'monthly' ? 'text-text' : 'text-muted')}>{t('pricing.toggle.monthly')}</span>
      <button
        onClick={() => onChange(type === 'monthly' ? 'yearly' : 'monthly')}
        role="switch"
        aria-checked={type === 'yearly'}
        aria-label={`${t('pricing.toggle.monthly')} / ${t('pricing.toggle.yearly')}`}
        className={cn(
          'w-14 h-7 rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
          type === 'yearly' ? 'bg-primary' : 'bg-surfaceAlt'
        )}
      >
        <div className={cn('w-5 h-5 rounded-full bg-white transition-transform', type === 'yearly' ? 'translate-x-7 rtl:-translate-x-7' : 'translate-x-0')} />
      </button>
      <span className={cn('text-sm font-medium', type === 'yearly' ? 'text-text' : 'text-muted')}>{t('pricing.toggle.yearly')}</span>
      {type === 'yearly' && <Badge variant="accent" className="text-xs">Save 20%</Badge>}
    </div>
  )
}

const PricingCard = ({ tier, type, lang }) => {
  const { t } = useTranslation()
  const price = tier.price[type]

  const displayPrice = price ? `$${price}` : t('pricing.tier.custom')
  const periodLabel = type === 'monthly' ? t('pricing.billingPeriod.monthly') : t('pricing.billingPeriod.annually')

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut', delay: tier.popular ? 0.08 : 0 }}>
      <Card className={cn('h-full relative p-6', tier.popular && 'border-2 border-primary shadow-xl')}>
        {tier.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <Badge variant="accent">{t('common.popular')}</Badge>
          </div>
        )}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-text mb-2">{tier.name[lang] || tier.name.en}</h2>
          <p className="text-sm text-muted">{tier.tagline[lang] || tier.tagline.en}</p>
        </div>
        <div className="text-center mb-6">
          <div className={cn('text-4xl font-semibold text-primary tabular-nums', !price && 'text-text')}>{displayPrice}</div>
          {price && (
            <div className="text-sm text-muted mt-1">{periodLabel}</div>
          )}
        </div>
        <div className="space-y-3 mb-8">
          {tier.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className={cn('w-5 h-5 flex-shrink-0', price ? 'text-green-500' : 'text-muted')} />
              <span className="text-sm text-text">{feature[lang] || feature.en}</span>
            </div>
          ))}
        </div>
        <Button
          variant={tier.popular ? 'primary' : 'outline'}
          size="lg"
          className="w-full"
          onClick={() => window.location.href = '/contact'}
        >
          {tier.cta[lang] || tier.cta.en}
        </Button>
      </Card>
    </motion.div>
  )
}

const PricingPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [billingType, setBillingType] = useState('monthly')
  const scrollRef = useRef(null)


  return (
    <div ref={scrollRef}>
      <Helmet>
        <title>{t('nav.pricing')} - {t('common.brandFull')}</title>
        <meta name="description" content={t('pricing.subheadline')} />
      </Helmet>

      <PageTransition>
        <Section variant="gradient" spacing="hero" className="relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-grid-small opacity-20" />


          <Container className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeOut', duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">{t('pricing.headline')}</h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">{t('pricing.subheadline')}</p>
              <BillingToggle type={billingType} onChange={setBillingType} />
            </motion.div>
          </Container>
        </Section>

        <Section variant="surface" spacing="large">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricing.map((tier) => (
                <PricingCard key={tier.id} tier={tier} type={billingType} lang={lang} />
              ))}
            </div>
          </Container>
        </Section>

        <Section variant="light" spacing="large">
          <Container>
            <SectionTitle eyebrow={t('common.featured')} title={t('pricing.comparePlans')} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-start py-4 px-4 font-semibold text-text">Feature</th>
                    {pricing.map((tier) => (
                      <th key={tier.id} className="text-center py-4 px-4 font-semibold text-text">{tier.name[lang] || tier.name.en}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const allFeatures = [...pricing.flatMap((tier) => tier.features)]
                    return [...new Set(allFeatures)].slice(0, 8).map((feature, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-4 px-4 text-text">{feature[lang] || feature.en}</td>
                        {pricing.map((tier, j) => (
                          <td key={j} className="py-4 px-4 text-center">
                            <Check className={cn('w-5 h-5 mx-auto', tier.features.some((f) => f === feature) ? 'text-green-500' : 'text-surfaceAlt')} />
                          </td>
                        ))}
                      </tr>
                    ))
                  })()}
                </tbody>
              </table>
            </div>
          </Container>
        </Section>

        <Section variant="gradient" spacing="hero" className="text-center relative overflow-hidden">
          <Container className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">{t('services.cta')}</h2>
            <Link to="/contact">
              <Button size="lg" variant="white">{t('nav.getQuote')}</Button>
            </Link>
          </Container>
        </Section>
      </PageTransition>
    </div>
  )
}

export default PricingPage
