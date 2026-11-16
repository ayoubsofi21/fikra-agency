import { Helmet } from 'react-helmet-async'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Code2,
  ShoppingCart,
  Cloud,
  Palette,
  Server,
  Headphones,
  TrendingUp,
} from 'lucide-react'
import { Container, Card, Badge, Button, Accordion } from '@/components/ui'
import { services, faqs } from '@/data/mock'

const iconMap = { Code2, ShoppingCart, Cloud, Palette, Server, Headphones, TrendingUp }

const ServiceDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const service = services.find((s) => s.slug === slug)

  if (!service) {
    return (
      <Container>
        <h1 className="text-2xl font-semibold">{t('common.notFound')}</h1>
      </Container>
    )
  }

  const Icon = iconMap[service.icon] || Code2

  return (
    <>
      <Helmet>
        <title>{service.name[lang] || service.name.en} - {t('common.brandFull')}</title>
        <meta name="description" content={service.description[lang] || service.description.en} />
      </Helmet>

      <div className="pt-28 pb-16">
        <Container>
          <button onClick={() => navigate('/services')} className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {t('nav.services')}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeOut', duration: 0.5 }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <Badge variant="primary">{service.category}</Badge>
                </div>

                <h1 className="text-4xl md:text-5xl font-semibold text-text mb-6">{service.name[lang] || service.name.en}</h1>
                <p className="text-xl text-muted leading-relaxed mb-8">{service.description[lang] || service.description.en}</p>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h2 className="text-2xl font-semibold text-text mb-4">{t('services.deliverables')}</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-text">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h2 className="text-2xl font-semibold text-text mb-4 mt-12">{t('services.techStack')}</h2>
                  <div className="flex flex-wrap gap-3">
                    {service.technologies.map((tech, i) => (
                      <Badge key={i} variant="default">{tech}</Badge>
                    ))}
                  </div>

                  <h2 className="text-2xl font-semibold text-text mb-4 mt-12">{t('services.timeline')}</h2>
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-primary" />
                    <span className="text-lg text-text">{service.timeline}</span>
                  </div>

                  <h2 className="text-2xl font-semibold text-text mb-4 mt-12">{t('services.faq')}</h2>
                  <Accordion
                    items={faqs.slice(0, 3).map((faq) => ({
                      question: faq.question[lang] || faq.question.en,
                      answer: faq.answer[lang] || faq.answer.en,
                    }))}
                  />
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: 'easeOut', duration: 0.5, delay: 0.2 }}
                className="sticky top-28"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-text mb-4">{t('services.cta')}</h2>
                  <p className="text-muted mb-6">
                    {t('services.subheadline')}
                  </p>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold text-primary">
                        {service.price.model === 'subscription'
                          ? `${service.price.from}/mo`
                          : `$${service.price.from}+`}
                      </span>
                      <span className="text-muted">
                        {service.price.currency}
                      </span>
                    </div>
                    <div className="text-sm text-muted mt-1">
                      {service.price.model === 'subscription' ? t('solutions.priceModel.subscription') : t('solutions.priceModel.custom')}
                    </div>
                  </div>
                  <Button size="lg" className="w-full" onClick={() => navigate('/contact')}>
                    {t('nav.getQuote')} <ArrowRight className="w-5 h-5" />
                  </Button>
                </Card>
              </motion.div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default ServiceDetail
