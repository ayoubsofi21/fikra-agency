import { Helmet } from 'react-helmet-async'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, ChevronRight } from 'lucide-react'
import { Container, Card, Badge, Button } from '@/components/ui'
import { projects } from '@/data/mock'

const ProjectDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language


  const project = projects.find((p) => p.slug === slug)
  const index = projects.findIndex((p) => p.slug === slug)
  const nextProject = projects[(index + 1) % projects.length]

  if (!project) {
    return (
      <Container>
        <h1 className="text-2xl font-semibold">{t('common.notFound')}</h1>
      </Container>
    )
  }

  return (
    <>
      <Helmet>
        <title>{project.title[lang] || project.title.en} - {t('common.brandFull')}</title>
        <meta name="description" content={project.description[lang] || project.description.en} />
      </Helmet>

      <div className="pt-28 pb-16">
        <Container>
          <button onClick={() => navigate('/portfolio')} className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> {t('nav.portfolio')}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeOut', duration: 0.5 }}>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="primary">{project.category}</Badge>
                  <span className="text-sm text-muted">{project.year}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-semibold text-text mb-4">{project.title[lang] || project.title.en}</h1>
                <p className="text-xl text-muted mb-8">{project.description[lang] || project.description.en}</p>

                <div className="relative h-72 md:h-96 rounded-xl overflow-hidden mb-12 bg-surfaceAlt">
                  <img src={project.image} alt={project.title[lang]} className="w-full h-full object-cover" />
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="bg-surface rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-text mb-4">{t('portfolio.problem')}</h2>
                    <p className="text-text leading-relaxed">{project.challenge[lang] || project.challenge.en}</p>
                  </div>

                  <div className="bg-surface rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-text mb-4">{t('portfolio.solution')}</h2>
                    <p className="text-text leading-relaxed">{project.solution[lang] || project.solution.en}</p>
                  </div>

                  <div className="bg-surface rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-text mb-4">{t('portfolio.result')}</h2>
                    <p className="text-text leading-relaxed">{project.result[lang] || project.result.en}</p>
                  </div>

                  <h2 className="text-2xl font-semibold text-text mb-6">{t('common.techStack')}</h2>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="default">{tech}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                <Card className="p-6">
                  <div className="text-sm text-muted mb-2">{t('common.client')}</div>
                  <div className="text-xl font-semibold text-text mb-4">{project.client}</div>
                  <div className="text-sm text-muted mb-6">{t('common.year')} {project.year}</div>
                  {project.liveLink && (
                    <Button variant="outline" size="lg" className="w-full" icon={ExternalLink} onClick={() => window.open(project.liveLink, '_blank')}>
                      {t('portfolio.liveSite')}
                    </Button>
                  )}
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-text mb-4">{t('portfolio.nextProject')}</h2>
                  <div className="flex gap-4 items-center">
                    <img src={nextProject.image} alt={nextProject.title[lang]} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text truncate">{nextProject.title[lang] || nextProject.title.en}</h3>
                      <p className="text-sm text-muted">{nextProject.category}</p>
                    </div>
                    <Button size="icon" variant="ghost" aria-label={t('portfolio.nextProject')} onClick={() => navigate(`/portfolio/${nextProject.slug}`)}>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default ProjectDetail
