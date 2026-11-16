import { useTranslation } from 'react-i18next'
import { Code2, FileText, PenTool, Rocket, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'
import { Container, Section, SectionTitle } from '@/components/ui'

const steps = [
  {
    number: '01',
    title: { en: 'Discover', fr: 'Découverte', ar: 'اكتشاف' },
    description: {
      en: 'We dig deep into your goals, users, and market to uncover the real opportunity behind your idea.',
      fr: "Nous plongeons au cœur de vos objectifs, utilisateurs et marché pour révéler l'opportunité réelle.",
      ar: 'نغوص في أهدافكم وجمهوركم والسوق لنفهم الفرصة الحقيقية وراء فكرتكم.',
    },
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    title: { en: 'Design', fr: 'Conception', ar: 'تصميم' },
    description: {
      en: 'We craft wireframes, prototypes, and visual designs that are as beautiful as they are intuitive.',
      fr: 'Nous concevons maquettes, prototypes et designs visuels beaux et intuitifs.',
      ar: 'نصمم مخططات ونماذج أولية وتصاميم بصرية جميلة وبديهية.',
    },
    icon: PenTool,
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    title: { en: 'Build', fr: 'Développement', ar: 'بناء' },
    description: {
      en: 'We code clean, scalable, and performant solutions using modern, battle-tested technologies.',
      fr: 'Nous codons des solutions propres, évolutives et performantes avec des technologies modernes.',
      ar: 'نبني أكواداً نظيفة وقابلة للتوسع وأداءً عالياً باستخدام تقنيات حديثة.',
    },
    icon: Code2,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    number: '04',
    title: { en: 'Launch', fr: 'Lancement', ar: 'إطلاق' },
    description: {
      en: 'From staging to production, we handle deployment, testing, and go-live with zero surprises.',
      fr: 'De la staging à la production, nous gérons le déploiement et la mise en ligne.',
      ar: 'من الاختبار إلى الإنتاج، نتولى النشر والاختبار والإطلاق.',
    },
    icon: Rocket,
    color: 'from-amber-500 to-orange-500',
  },
  {
    number: '05',
    title: { en: 'Support', fr: 'Support', ar: 'دعم' },
    description: {
      en: 'Your success doesn\'t stop at launch. We provide ongoing support and continuous improvements.',
      fr: "Votre succès ne s'arrête pas au lancement. Support continu et améliorations.",
      ar: 'نجاحكم لا يتوقف عند الإطلاق. دعم مستمر وتحسينات.',
    },
    icon: Headphones,
    color: 'from-green-500 to-emerald-500',
  },
]

export const Process = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return (
    <Section variant="surface" spacing="default">
      <Container>
        <SectionTitle
          eyebrow={t('about.eyebrow')}
          title={t('about.method')}
        />
        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ ease: 'easeOut', delay: i * 0.08, duration: 0.5 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-xl bg-background border border-border flex flex-col items-center justify-center mb-4">
                    <div className="font-mono text-xs text-muted mb-1">{step.number}</div>
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">{step.title[lang] || step.title.en}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.description[lang] || step.description.en}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
