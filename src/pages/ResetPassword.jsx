import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Check, KeyRound } from 'lucide-react'
import { Container, Card, Input, Label, Button, Section } from '@/components/ui'
import { PageTransition } from '@/components/layout'
import { resetPassword } from '@/services/api'

const resetSchema = z
  .object({
    password: z.string().min(8, 'validation.passwordMin'),
    password_confirmation: z.string().min(1, 'validation.required'),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: 'validation.passwordMatch',
    path: ['password_confirmation'],
  })

const ResetPassword = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', password_confirmation: '' },
  })

  const onSubmit = async (values) => {
    setSubmitting(true)
    setError('')
    try {
      await resetPassword({
        token,
        email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err?.message || t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const invalidLink = !token || !email

  return (
    <Section variant="surface" spacing="large">
      <Helmet>
        <title>{t('resetPassword.title')} - {t('common.brandFull')}</title>
        <meta name="description" content={t('resetPassword.subtitle')} />
      </Helmet>

      <PageTransition>
        <Container>
          <div className="max-w-md mx-auto">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <KeyRound className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-text">{t('resetPassword.title')}</h1>
                  <p className="text-sm text-muted">{t('resetPassword.subtitle')}</p>
                </div>
              </div>

              {submitted ? (
                <div className="text-center py-6" role="status">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                  <p className="text-text mb-6">{t('resetPassword.success')}</p>
                  <Link to="/" className="text-primary font-medium hover:underline">
                    {t('common.backHome')}
                  </Link>
                </div>
              ) : invalidLink ? (
                <div className="py-4">
                  <p className="text-muted mb-6">{t('resetPassword.invalidLink')}</p>
                  <Link to="/contact" className="text-primary font-medium hover:underline">
                    {t('nav.contact')}
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div>
                    <Label htmlFor="reset-email">{t('contact.form.contactInfo.email')}</Label>
                    <Input id="reset-email" type="email" value={email} readOnly className="bg-surfaceAlt" />
                  </div>

                  <div>
                    <Label htmlFor="reset-password" required>{t('resetPassword.password')}</Label>
                    <Input id="reset-password" type="password" autoComplete="new-password" {...register('password')} error={!!errors.password} />
                    {errors.password && <p className="text-danger text-sm mt-1" role="alert">{t(errors.password.message)}</p>}
                  </div>

                  <div>
                    <Label htmlFor="reset-password-confirmation" required>{t('resetPassword.passwordConfirm')}</Label>
                    <Input id="reset-password-confirmation" type="password" autoComplete="new-password" {...register('password_confirmation')} error={!!errors.password_confirmation} />
                    {errors.password_confirmation && <p className="text-danger text-sm mt-1" role="alert">{t(errors.password_confirmation.message)}</p>}
                  </div>

                  {error && <p className="text-danger text-sm" role="alert">{error}</p>}

                  <Button type="submit" size="lg" className="w-full" isLoading={submitting}>
                    {t('resetPassword.submit')}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </Container>
      </PageTransition>
    </Section>
  )
}

export default ResetPassword
