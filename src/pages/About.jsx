import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Compass, Heart, Users, Zap, ExternalLink } from 'lucide-react'
import { Container, Card, Button, Section, SectionTitle } from '@/components/ui'
import { PageTransition } from '@/components/layout'
import { team } from '@/data/mock'

const values = [
  { icon: Heart, key: 'valuePassion' },
  { icon: Compass, key: 'valueCuriosity' },
  { icon: Users, key: 'valuePeople' },
  { icon: Zap, key: 'valueQuality' },
]

const stats = [
  { value: '87+', label: 'about.statProjects' },
  { value: '42+', label: 'about.statClients' },
  { value: '7', label: 'about.statSolutions' },
  { value: '100%', label: 'about.statSatisfaction' },
]

const TeamPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const scrollRef = useRef(null)


  return (
    <div ref={scrollRef}>
      <Helmet>
        <title>{t('nav.about')} - {t('common.brandFull')}</title>
        <meta name="description" content={t('hero.subheadline')} />
      </Helmet>

      <PageTransition>
        <Section variant="gradient" spacing="hero" className="relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-grid-small opacity-20" />


          <Container className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeOut', duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
                {t('about.headline')}
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">{t('hero.subheadline')}</p>
              <Link to="/contact">
                <Button size="lg" variant="white">{t('nav.getQuote')}</Button>
              </Link>
            </motion.div>
          </Container>
        </Section>

        <Section variant="surface" spacing="large">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <SectionTitle eyebrow={t('about.eyebrow')} title={t('about.story')} align="left" size="md" />
                <p className="text-lg text-muted leading-relaxed mb-6">
                  {t('about.storyP1')}
                </p>
                <p className="text-lg text-muted leading-relaxed">
                  {t('about.storyP2')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}>
                    <Card className="p-6 text-center">
                      <div className="text-3xl font-semibold text-amber-700 dark:text-amber-400 mb-1 tabular-nums">{stat.value}</div>
                      <div className="text-sm text-muted">{t(stat.label)}</div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        <Section variant="light" spacing="large">
          <Container>
            <SectionTitle eyebrow={t('common.featured')} title={t('nav.team')} subtitle={t('team.subheadline')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}>
                  <Card className="h-full group">
                    <div className="px-6 pt-6 pb-4">
                      <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-surfaceAlt">
                        <img src={member.avatar} alt={member.name[lang]} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-lg font-semibold text-text">{member.name[lang] || member.name.en}</h3>
                      <p className="text-sm text-primary font-medium mb-2">{member.role[lang] || member.role.en}</p>
                      <div className="flex gap-2 mb-4">
                        {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 rounded"><ExternalLink className="w-4 h-4" aria-hidden="true" /></a>}
                        {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 rounded"><ExternalLink className="w-4 h-4" aria-hidden="true" /></a>}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>

        <Section variant="surface" spacing="large">
          <Container>
            <SectionTitle title={t('about.values')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
              {values.map((value) => (
                <motion.div key={value.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease: 'easeOut', duration: 0.5 }}>
                  <Card className="p-6 flex gap-4 items-start h-full">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-2">{t(`about.${value.key}Title`)}</h3>
                      <p className="text-muted">{t(`about.${value.key}Desc`)}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>

        <Section variant="gradient" spacing="hero" className="text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-small opacity-20" />
          <Container className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">{t('contact.headline')}</h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">{t('hero.subheadline')}</p>
            <Link to="/contact">
              <Button size="lg" variant="white">{t('nav.getQuote')}</Button>
            </Link>
          </Container>
        </Section>
      </PageTransition>
    </div>
  )
}

export default TeamPage
