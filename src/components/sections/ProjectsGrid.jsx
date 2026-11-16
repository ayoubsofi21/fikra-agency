import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Container, Section, SectionTitle, Card } from '@/components/ui'
import { projects } from '@/data/mock'

export const ProjectsGrid = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const featured = projects.slice(0, 3)

  return (
    <Section variant="light" spacing="default">
      <Container>
        <SectionTitle
          eyebrow={t('portfolio.eyebrow')}
          title={t('portfolio.headline')}
          subtitle={t('portfolio.subheadline')}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}>
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
                  <h3 className="text-xl font-semibold text-text mb-2">{project.title[lang] || project.title.en}</h3>
                  <p className="text-muted text-sm mb-4 line-clamp-2">{project.description[lang] || project.description.en}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs px-2.5 py-1 bg-surfaceAlt text-muted rounded-md">{tech}</span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-primary font-semibold">
            {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}
