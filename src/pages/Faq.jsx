import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { Container, SectionTitle, Accordion } from '@/components/ui'
import { PageTransition } from '@/components/layout'
import { faqs } from '@/data/mock'

const FAQPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const scrollRef = useRef(null)


  return (
    <div ref={scrollRef}>
      <Helmet>
        <title>{t('nav.contact')} - {t('common.brandFull')}</title>
        <meta name="description" content={t('faq.subheadline')} />
      </Helmet>

      <PageTransition>
        <div className="pt-32 pb-16 bg-surface">
          <Container>
            <SectionTitle
              level={1}
              eyebrow={t('faq.eyebrow')}
              title={t('faq.headline')}
              subtitle={t('faq.subheadline')}
            />

            <div className="max-w-3xl mx-auto">
              <Accordion
                items={faqs.map((faq) => ({
                  question: faq.question[lang] || faq.question.en,
                  answer: faq.answer[lang] || faq.answer.en,
                }))}
              />
            </div>
          </Container>
        </div>
      </PageTransition>
    </div>
  )
}

export default FAQPage
