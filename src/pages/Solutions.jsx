import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { PageTransition } from '@/components/layout'
import { Container, Input, Tabs, Card, Badge } from '@/components/ui'
import { solutions } from '@/data/mock'

const SOLUTION_CATEGORIES = [
  { value: 'all', label: 'solutions.filterAll' },
  { value: 'business', label: 'solutions.category.business' },
  { value: 'commerce', label: 'solutions.category.commerce' },
  { value: 'events', label: 'solutions.category.events' },
  { value: 'health', label: 'solutions.category.health' },
  { value: 'saas', label: 'solutions.category.saas' },
  { value: 'food', label: 'solutions.category.food' },
]

const SolutionCard = ({ solution, lang }) => {
  const { t } = useTranslation()
  const badgeMap = {
    'best-seller': 'bestseller',
    new: 'new',
    popular: 'popular',
    'coming-soon': 'comingSoon',
  }

  const getPriceDisplay = (sol) => {
    if (!sol.price.amount) return 'Custom'
    if (sol.priceModel === 'subscription') return `$${sol.price.amount}/mo`
    return `$${sol.price.amount}`
  }

  const priceTypeLabel = solution.priceModel === 'subscription' ? 'solutions.priceModel.subscription' : 'solutions.priceModel.license'

  return (
    <motion.div
      key={solution.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: 'easeOut', duration: 0.4 }}
    >
      <Card className="h-full group">
        <div className="px-6 pt-6">
          {solution.badge && (
            <Badge variant={badgeMap[solution.badge]}>{solution.badge}</Badge>
          )}
        </div>
        <div className="h-48 overflow-hidden">
          <img src={solution.image} alt={solution.name[lang]} className="w-full h-full object-cover" />
        </div>
        <div className="px-6 pb-6 flex flex-col h-full">
          <h2 className="text-lg font-semibold text-text mb-2">{solution.name[lang] || solution.name.en}</h2>
          <p className="text-muted text-sm mb-4 flex-1">{solution.description[lang] || solution.description.en}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-semibold text-primary">{getPriceDisplay(solution)}</span>
            <span className="text-xs text-muted">{t(priceTypeLabel)}</span>
          </div>
          <a href={`/solutions/${solution.slug}`} className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors">
            {t('common.learnMore')} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </Card>
    </motion.div>
  )
}

const SolutionsPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const scrollRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')


  const filteredSolutions = solutions.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory
    const matchesSearch = !searchQuery ||
      (s.name[lang] || s.name.en).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description[lang] || s.description.en).toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div ref={scrollRef}>
      <Helmet>
        <title>{t('nav.solutions')} - {t('common.brandFull')}</title>
        <meta name="description" content={t('solutions.subheadline')} />
      </Helmet>

      <PageTransition>
        <div className="pt-32 pb-16 bg-surface">
          <Container>
            <div className="max-w-3xl mb-8">
              <h1 className="text-4xl md:text-5xl font-semibold text-text mb-4">{t('solutions.headline')}</h1>
              <p className="text-xl text-muted leading-relaxed">{t('solutions.subheadline')}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Input
                  aria-label={t('solutions.searchPlaceholder')}
                  placeholder={t('solutions.searchPlaceholder')}
                  icon={Search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Tabs
                  tabs={SOLUTION_CATEGORIES.map((c) => ({ ...c, label: t(c.label) }))}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>
            </div>

            {filteredSolutions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted text-lg">{t('common.notFound')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSolutions.map((solution) => (
                  <SolutionCard key={solution.id} solution={solution} lang={lang} />
                ))}
              </div>
            )}
          </Container>
        </div>
      </PageTransition>
    </div>
  )
}

export default SolutionsPage
