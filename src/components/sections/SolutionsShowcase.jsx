import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container, Section, SectionTitle, Card, Badge } from '@/components/ui'
import { useSolutions } from '@/hooks/useContent'

const badgeMap = {
  'best-seller': 'bestseller',
  'new': 'new',
  popular: 'popular',
  'coming-soon': 'comingSoon',
  null: null,
}

export const SolutionsShowcase = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const solutions = useSolutions()

  const featured = solutions.filter((s) => s.badge || s.priceModel === 'subscription').slice(0, 3)

  return (
    <Section variant="surface" spacing="default">
      <Container>
        <SectionTitle
          eyebrow={t('solutions.eyebrow')}
          title={t('solutions.headline')}
          subtitle={t('solutions.subheadline')}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {featured.map((solution, i) => {
            const badge = badgeMap[solution.badge]
            return (
              <motion.div key={solution.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}>
                <Card className="h-full">
                  {badge && (
                    <div className="px-6 pt-6">
                      <Badge variant={badge}>{t(solution.badge === 'best-seller' ? 'common.popular' : solution.badge === 'new' ? 'common.new' : solution.badge === 'popular' ? 'common.popular' : 'common.soon')}</Badge>
                    </div>
                  )}
                  <div className="h-48 bg-surfaceAlt overflow-hidden">
                    <img src={solution.image} alt={solution.name[lang]} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-6 pb-6 flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-text mb-2">{solution.name[lang] || solution.name.en}</h3>
                    <p className="text-muted text-sm mb-4 flex-1">{solution.description[lang] || solution.description.en}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-semibold text-primary">
                          {solution.price.amount ? `$${solution.price.amount}` : 'Custom'}
                        </span>
                      </div>
                      {solution.priceModel === 'subscription' ? (
                        <span className="text-xs text-muted">{t('solutions.priceModel.subscription')}</span>
                      ) : (
                        <span className="text-xs text-muted">{t('solutions.priceModel.license')}</span>
                      )}
                    </div>
                    <a href={`/solutions/${solution.slug}`} className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors">
                      {t('common.learnMore')} <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
        <div className="text-center mt-10">
          <Link to="/solutions" className="inline-flex items-center gap-2 text-primary font-semibold">
            {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}
