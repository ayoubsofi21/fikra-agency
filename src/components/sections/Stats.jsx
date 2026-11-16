import { useTranslation } from 'react-i18next'
import { Container, CountUp, Flex, Section } from '@/components/ui'

export const Stats = () => {
  const { t } = useTranslation()

  const stats = [
    { value: 87, suffix: '+', label: 'common.projects' },
    { value: 42, suffix: '+', label: 'common.clients' },
    { value: 7, suffix: '', label: 'common.solutions' },
    { value: 5, suffix: '+', label: 'common.years' },
  ]

  return (
    <Section variant="surface" spacing="compact">
      <Container>
        <Flex direction="row" gap="gap-8" justify="justify-center" wrap="flex-wrap">
          {stats.map((stat) => (
            <Flex key={stat.label} direction="column" align="center" gap="gap-2" className="flex-1 min-w-[140px]">
              <div className="text-3xl sm:text-4xl font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                <CountUp to={stat.value} suffix={stat.suffix} duration={2} />
              </div>
              <div className="text-sm text-muted">{t(stat.label)}</div>
            </Flex>
          ))}
        </Flex>
      </Container>
    </Section>
  )
}
