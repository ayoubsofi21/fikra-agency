import { useTranslation } from 'react-i18next'
import { Container, Section } from '@/components/ui'

const techStack = [
  'React', 'Next.js', 'Laravel', 'PHP', 'Node.js', 'TypeScript',
  'Tailwind CSS', 'PostgreSQL', 'MySQL', 'Figma', 'Docker', 'AWS',
]

export const TechStackMarquee = () => {
  const { t } = useTranslation()

  return (
    <Section variant="default" spacing="compact">
      <Container>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-text">{t('common.techStack')}</h2>
        </div>
        <div data-testid="tech-marquee" className="flex flex-wrap justify-center gap-3">
          {techStack.map((name) => (
            <div
              key={name}
              className="flex min-w-[128px] items-center justify-center rounded-lg border border-border bg-surface px-6 py-3"
            >
              <span className="font-medium text-text">{name}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default TechStackMarquee
