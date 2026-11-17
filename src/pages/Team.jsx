import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Mail } from 'lucide-react'
import { Container, Card, Section } from '@/components/ui'
import { PageTransition } from '@/components/layout'
import { useTeam } from '@/hooks/useContent'

const SocialLink = ({ href, icon: Icon, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-surfaceAlt text-muted hover:text-primary hover:bg-primary/10 transition-colors">
    <Icon className="w-5 h-5" />
    <span className="sr-only">{label}</span>
  </a>
)

const MemberCard = ({ member, lang }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease: 'easeOut', duration: 0.4 }}>
      <Card className="h-full group">
        <div className="px-6 pt-6 pb-4">
          <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-surfaceAlt">
            <img src={member.avatar} alt={member.name[lang]} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-semibold text-text">{member.name[lang] || member.name.en}</h2>
          <p className="text-sm text-primary font-medium mb-2">{member.role[lang] || member.role.en}</p>
          <p className="text-muted text-sm mb-4">{member.bio[lang] || member.bio.en}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {member.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="text-xs px-2.5 py-1 bg-surfaceAlt text-muted rounded-md">{skill}</span>
            ))}
          </div>
          <div className="flex gap-2">
            {member.github && <SocialLink href={member.github} icon={ExternalLink} label="GitHub" />}
            {member.linkedin && <SocialLink href={member.linkedin} icon={ExternalLink} label="LinkedIn" />}
            {member.twitter && <SocialLink href={member.twitter} icon={ExternalLink} label="Twitter" />}
            {member.email && <SocialLink href={`mailto:${member.email}`} icon={Mail} label="Email" />}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const TeamPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const scrollRef = useRef(null)
  const team = useTeam()


  return (
    <div ref={scrollRef}>
      <Helmet>
        <title>{t('nav.team')} - {t('common.brandFull')}</title>
        <meta name="description" content={t('team.subheadline')} />
      </Helmet>

      <PageTransition>
        <Section variant="surface" spacing="large">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-semibold text-text mb-4">{t('team.headline')}</h1>
              <p className="text-xl text-muted leading-relaxed">{t('team.subheadline')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <MemberCard key={member.id} member={member} lang={lang} />
              ))}
            </div>
          </Container>
        </Section>
      </PageTransition>
    </div>
  )
}

export default TeamPage
