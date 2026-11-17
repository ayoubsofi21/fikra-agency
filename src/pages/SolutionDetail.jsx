import { Helmet } from 'react-helmet-async'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ExternalLink, Star, CreditCard } from 'lucide-react'
import { Container, Card, Badge, Button, Accordion } from '@/components/ui'
import { useSolutions } from '@/hooks/useContent'
import { RequestModal } from './RequestModal'

const badgeMap = {
  'best-seller': 'bestseller',
  new: 'new',
  popular: 'popular',
  'coming-soon': 'comingSoon',
}

const SolutionDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [showModal, setShowModal] = useState(false)
  const solutions = useSolutions()


  const solution = solutions.find((s) => s.slug === slug)

  if (!solution) {
    return (
      <Container>
        <h1 className="text-2xl font-semibold">{t('common.notFound')}</h1>
      </Container>
    )
  }

  const getPriceDisplay = (sol) => {
    if (!sol.price.amount) return 'Custom quote'
    if (sol.priceModel === 'subscription') return `$${sol.price.amount} / month`
    return `$${sol.price.amount} one-time`
  }

  return (
    <>
      <Helmet>
        <title>{solution.name[lang] || solution.name.en} - {t('common.brandFull')}</title>
        <meta name="description" content={solution.description[lang] || solution.description.en} />
      </Helmet>

      <div className="pt-28 pb-16">
        <Container>
          <button onClick={() => navigate('/solutions')} className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {t('nav.solutions')}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeOut', duration: 0.5 }}>
                <div className="flex items-center gap-3 mb-4">
                  {solution.badge && (
                    <Badge variant={badgeMap[solution.badge]}>{solution.badge}</Badge>
                  )}
                  <Badge variant="default">{solution.category}</Badge>
                  <Badge variant="default">{solution.type}</Badge>
                </div>

                <h1 className="text-4xl md:text-5xl font-semibold text-text mb-4">{solution.name[lang] || solution.name.en}</h1>
                <p className="text-xl text-muted leading-relaxed mb-8">{solution.description[lang] || solution.description.en}</p>

                <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-12 bg-surfaceAlt">
                  <img src={solution.image} alt={solution.name[lang]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h2 className="text-2xl font-semibold text-text mb-6">{t('solutions.features')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {solution.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-text">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-2xl font-semibold text-text mb-6 mt-12">{t('solutions.tech')}</h2>
                  <div className="flex flex-wrap gap-3">
                    {solution.technologies.map((tech, i) => (
                      <Badge key={i} variant="default">{tech}</Badge>
                    ))}
                  </div>

                  <h2 className="text-2xl font-semibold text-text mb-6 mt-12">{t('solutions.pricing')}</h2>
                  <Card className="p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-semibold text-primary">
                          {solution.price.amount ? (solution.priceModel === 'subscription' ? `$${solution.price.amount}/mo` : `$${solution.price.amount}`) : 'Custom'}
                        </div>
                        <div className="text-sm text-muted mt-1">
                          {solution.licenseType ? `${solution.licenseType.replace('-', ' ')}` : ''}
                        </div>
                      </div>
                      {solution.priceModel === 'license' && (
                        <Badge variant="success">Lifetime updates</Badge>
                      )}
                    </div>
                  </Card>

                  <h2 className="text-2xl font-semibold text-text mb-6 mt-12">{t('solutions.faq')}</h2>
                  <Accordion
                    items={[
                      {
                        question: 'Can I customize this solution to fit my needs?',
                        answer: 'Absolutely. Every solution is fully open and we offer customization as an add-on service to match your brand, workflows, and specific requirements.',
                      },
                      {
                        question: 'What is included after purchase?',
                        answer: 'You receive full source code, setup documentation, a video walkthrough, 30 days of free support, and lifetime updates for your version.',
                      },
                      {
                        question: 'Do you offer installation support?',
                        answer: 'Yes, we provide remote installation support for all solutions. For complex setups requiring customization, that is offered as a paid add-on.',
                      },
                    ]}
                  />
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: 'easeOut', duration: 0.5, delay: 0.2 }}
                className="sticky top-28 space-y-6"
              >
                <Card className="p-6">
                  <div className="text-sm text-muted mb-2">{t('solutions.pricing')}</div>
                  <div className="text-3xl font-semibold text-primary mb-4">
                    {getPriceDisplay(solution)}
                  </div>
                  <p className="text-muted text-sm mb-6">
                    {t('solutions.pricingBlurb')}
                  </p>
                  <Button size="lg" className="w-full mb-3" onClick={() => setShowModal(true)}>
                    <CreditCard className="w-5 h-5" /> {t('solutions.cta')}
                  </Button>
                  {solution.demo && (
                    <a href={solution.demo} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="outline" className="w-full" icon={ExternalLink}>
                        {t('common.demo')}
                      </Button>
                    </a>
                  )}
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-accent fill-accent" />
                    <span className="text-2xl font-semibold text-text">{solution.rating}</span>
                  </div>
                  <p className="text-muted text-sm">Based on {solution.rating ? '42' : ''} verified reviews</p>
                </Card>
              </motion.div>
            </div>
          </div>
        </Container>
      </div>

      <RequestModal isOpen={showModal} onClose={() => setShowModal(false)} solution={solution} lang={lang} />
    </>
  )
}

export default SolutionDetail
