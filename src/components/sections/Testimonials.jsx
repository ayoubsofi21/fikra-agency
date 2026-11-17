import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Container, Section, SectionTitle, Card } from '@/components/ui'
import { useTestimonials } from '@/hooks/useContent'

export const Testimonials = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const testimonials = useTestimonials()

  return (
    <Section variant="surface" spacing="default">
      <Container>
        <SectionTitle
          eyebrow={t('common.featured')}
          title={t('nav.team')}
          subtitle={t('team.subheadline')}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
            >
              <Card className="h-full">
                <div className="px-6 pt-6 pb-4">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < item.rating ? 'text-accent fill-accent' : 'text-surfaceAlt'}`} />
                    ))}
                  </div>
                  <blockquote className="text-text mb-6 leading-relaxed">"{item.content[lang] || item.content.en}"</blockquote>
                  <div className="flex items-center gap-4">
                    <img src={item.avatar} alt={item.name[lang]} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-text">{item.name[lang] || item.name.en}</div>
                      <div className="text-sm text-muted">
                        {item.role[lang] || item.role.en} · {item.company[lang] || item.company.en}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
