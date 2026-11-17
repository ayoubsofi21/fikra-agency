import { useTranslation } from 'react-i18next'
import { Container, CountUp, Flex, Section } from '@/components/ui'
import { useStats } from '@/hooks/useContent'

/**
 * API stat labels are stable slugs (projects_completed, …); the translation
 * catalogue uses shorter keys under `common`.
 */
const LABEL_KEYS = {
  projects_completed: 'common.projects',
  clients_trusted: 'common.clients',
  ready_made_solutions: 'common.solutions',
  years_experience: 'common.years',
}

export const Stats = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const stats = useStats()

  const suffixOf = (stat) => {
    if (stat?.suffix && typeof stat.suffix === 'object') {
      return stat.suffix[lang] ?? stat.suffix.en ?? ''
    }
    return stat?.suffix ?? ''
  }

  return (
    <Section variant="surface" spacing="compact">
      <Container>
        <Flex direction="row" gap="gap-8" justify="justify-center" wrap="flex-wrap">
          {stats.map((stat) => (
            <Flex key={stat.label} direction="column" align="center" gap="gap-2" className="flex-1 min-w-[140px]">
              <div className="text-3xl sm:text-4xl font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                <CountUp to={stat.value} suffix={suffixOf(stat)} duration={2} />
              </div>
              <div className="text-sm text-muted">{t(LABEL_KEYS[stat.label] || stat.label)}</div>
            </Flex>
          ))}
        </Flex>
      </Container>
    </Section>
  )
}
