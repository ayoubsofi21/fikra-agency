import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Modal, Input, Textarea, Label, Select, Button, Flex } from '@/components/ui'
import { sendSolutionRequest } from '@/services/api'

// Error messages are i18n keys — translated at render time via t()
const requestSchema = z.object({
  name: z.string().min(2, 'validation.nameMin'),
  email: z.string().email('validation.email'),
  company: z.string().optional(),
  message: z.string().min(10, 'validation.messageMin'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  terms: z.boolean().refine((v) => v === true, { message: 'validation.terms' }),
})

export const RequestModal = ({ isOpen, onClose, solution, lang }) => {
  const { t } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const closeTimer = useRef(null)

  // Clean up the auto-close timer if the modal unmounts mid-flight
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      terms: false,
      message: `Hi! I'm interested in "${solution.name[lang] || solution.name.en}". Could you tell me more about customization options and pricing?`,
    },
  })

  const onSubmit = async (values) => {
    setSubmitting(true)
    setError('')
    try {
      await sendSolutionRequest(solution.slug, {
        name: values.name,
        email: values.email,
        company: values.company,
        message: values.message,
      })
      setSubmitted(true)
      closeTimer.current = setTimeout(() => {
        reset()
        setSubmitted(false)
        onClose()
      }, 2000)
    } catch (err) {
      setError(err?.message || t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const budgets = [
    ['under-2k', 'contact.form.budget.lessThan2k'],
    ['2k-5k', 'contact.form.budget.2k-5k'],
    ['5k-10k', 'contact.form.budget.5k-10k'],
    ['10k-20k', 'contact.form.budget.10k-20k'],
    ['over-20k', 'contact.form.budget.moreThan20k'],
  ]
  const timelines = [
    ['asap', 'contact.form.timeline.asap'],
    ['1-month', 'contact.form.timeline.withinMonth'],
    ['3-months', 'contact.form.timeline.within3Months'],
    ['flexible', 'contact.form.timeline.flexible'],
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('solutions.cta')} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {submitted ? (
          <div className="text-center py-12" role="status">
            <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">{t('contact.success')}</h3>
            <p className="text-muted">{t('contact.reply24h')}</p>
          </div>
        ) : (
          <>
            <div className="bg-surfaceAlt rounded-xl p-4">
              <div className="text-sm text-muted">{t('solutions.cta')}</div>
              <div className="font-semibold text-text text-lg">{solution.name[lang] || solution.name.en}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="request-name" required>{t('contact.form.contactInfo.name')}</Label>
                <Input id="request-name" placeholder={t('contact.form.contactInfo.name')} {...register('name')} error={!!errors.name} />
                {errors.name && <p className="text-danger text-sm mt-1" role="alert">{t(errors.name.message)}</p>}
              </div>
              <div>
                <Label htmlFor="request-email" required>{t('contact.form.contactInfo.email')}</Label>
                <Input id="request-email" type="email" placeholder={t('contact.form.contactInfo.email')} {...register('email')} error={!!errors.email} />
                {errors.email && <p className="text-danger text-sm mt-1" role="alert">{t(errors.email.message)}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="request-company">{t('contact.form.contactInfo.company')}</Label>
              <Input id="request-company" placeholder={t('contact.form.contactInfo.company')} {...register('company')} />
            </div>

            <div>
              <Label htmlFor="request-budget">{t('contact.form.budgetLabel')}</Label>
              <Select id="request-budget" {...register('budget')}>
                <option value="">{t('common.select')}</option>
                {budgets.map(([value, key]) => (
                  <option key={value} value={value}>{t(key)}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="request-timeline">{t('contact.form.timelineLabel')}</Label>
              <Select id="request-timeline" {...register('timeline')}>
                <option value="">{t('common.select')}</option>
                {timelines.map(([value, key]) => (
                  <option key={value} value={value}>{t(key)}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="request-message" required>{t('contact.form.step3')}</Label>
              <Textarea id="request-message" rows={4} placeholder={t('contact.form.step3Desc')} {...register('message')} error={!!errors.message} />
              {errors.message && <p className="text-danger text-sm mt-1" role="alert">{t(errors.message.message)}</p>}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="request-terms" className="rounded border-border" {...register('terms')} />
                <label htmlFor="request-terms" className="text-sm text-muted">
                  {t('common.i-agree')} — <Link to="/terms" className="text-primary hover:underline">{t('legal.terms')}</Link> {t('common.and')} <Link to="/privacy" className="text-primary hover:underline">{t('legal.privacy')}</Link>
                </label>
              </div>
              {errors.terms && <p className="text-danger text-sm mt-1" role="alert">{t(errors.terms.message)}</p>}
            </div>

            {error && <p className="text-danger text-sm" role="alert">{error}</p>}

            <Flex direction="column" gap="gap-4">
              <Button type="submit" size="lg" isLoading={submitting} className="w-full">
                {t('solutions.cta')}
              </Button>
              <Button type="button" variant="outline" size="md" onClick={onClose} className="w-full">
                {t('common.cancel')}
              </Button>
            </Flex>
          </>
        )}
      </form>
    </Modal>
  )
}
