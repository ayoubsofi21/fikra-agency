import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import { PageTransition } from '@/components/layout'
import { Container, Card, Input, Tabs } from '@/components/ui'
import { projects } from '@/data/mock'

const PROJECT_CATEGORIES = [
  { value: 'all', label: 'portfolio.filterAll' },
  { value: 'saas', label: 'portfolio.category.saas' },
  { value: 'ecommerce', label: 'portfolio.category.ecommerce' },
  { value: 'mobile', label: 'portfolio.category.mobile' },
  { value: 'web', label: 'portfolio.category.web' },
  { value: 'branding', label: 'portfolio.category.branding' },
]

const ProjectCard = ({ project, lang }) => {
  const { t } = useTranslation()

  return (
    <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease: 'easeOut', duration: 0.4 }}>
      <Card className="h-full group">
        <div className="relative h-56 overflow-hidden">
          <img src={project.image} alt={project.title[lang]} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <a href={`/portfolio/${project.slug}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-6 py-3 bg-white text-text rounded-lg font-medium">{t('common.viewProject')}</span>
          </a>
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary">{project.category}</span>
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer" aria-label={t('common.viewProject')} className="p-2 rounded-lg bg-surfaceAlt text-muted hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary/40">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <h2 className="text-xl font-semibold text-text mb-2">{project.title[lang] || project.title.en}</h2>
          <p className="text-muted text-sm mb-4 line-clamp-2">{project.description[lang] || project.description.en}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((tech) => (
              <span key={tech} className="text-xs px-2.5 py-1 bg-surfaceAlt text-muted rounded-md">{tech}</span>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const PortfolioPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const scrollRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')


  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    const matchesSearch = !searchQuery ||
      (p.title[lang] || p.title.en).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div ref={scrollRef}>
      <Helmet>
        <title>{t('nav.portfolio')} - {t('common.brandFull')}</title>
        <meta name="description" content={t('portfolio.subheadline')} />
      </Helmet>

      <PageTransition>
        <div className="pt-32 pb-16 bg-surface">
          <Container>
            <div className="max-w-3xl mb-8">
              <h1 className="text-4xl md:text-5xl font-semibold text-text mb-4">{t('portfolio.headline')}</h1>
              <p className="text-xl text-muted leading-relaxed">{t('portfolio.subheadline')}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Input
                  aria-label={t('portfolio.searchPlaceholder')}
                  placeholder={t('portfolio.searchPlaceholder')}
                  icon={Search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Tabs
                  tabs={PROJECT_CATEGORIES.map((c) => ({ ...c, label: t(c.label) }))}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted text-lg">{t('common.notFound')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} lang={lang} />
                ))}
              </div>
            )}
          </Container>
        </div>
      </PageTransition>
    </div>
  )
}

export default PortfolioPage
