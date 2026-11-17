import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { KeyRound, ArrowLeft } from 'lucide-react'
import { useAdminAuth } from '@/admin/context/AdminAuthContext'
import adminApi from '@/admin/api/client'
import { Button, Card, Input, Label } from '@/admin/components/ui'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { status, login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [authError, setAuthError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [sent, setSent] = useState(false)

  if (status === 'authenticated') return <Navigate to="/admin" replace />

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setAuthError('')
    setFieldErrors({})
    try {
      if (forgotMode) {
        await adminApi.forgotPassword(email)
        setSent(true)
      } else {
        await login(email.trim().toLowerCase(), password)
        navigate('/admin', { replace: true })
      }
    } catch (err) {
      // The API returns English auth copy; show a localized message instead.
      if (err.status === 401 && !forgotMode) {
        setAuthError(t('admin.invalidCredentials'))
      } else {
        setError(err.message || t('admin.error'))
        setFieldErrors(err.errors || {})
      }
    } finally {
      setLoading(false)
    }
  }

  const errorText = authError || fieldErrors.email?.[0] || fieldErrors.password?.[0] || error

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <Helmet><title>{t('admin.signIn')} — FIKRA Agency</title></Helmet>

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white">F</div>
          <h1 className="text-2xl font-semibold text-text">{t('admin.welcomeBack')}</h1>
          <p className="mt-1 text-sm text-muted">{t('admin.loginSubtitle')}</p>
        </div>

        <Card className="p-6 shadow-lg sm:p-8">
          {sent ? (
            <div className="text-center" role="status">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                <KeyRound className="h-6 w-6" />
              </div>
              <p className="text-sm text-text">{t('admin.resetSent')}</p>
              <Button variant="secondary" className="mt-6 w-full" onClick={() => { setSent(false); setForgotMode(false) }}>{t('admin.back')}</Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <div>
                <Label htmlFor="admin-email" required>{t('admin.email')}</Label>
                <Input id="admin-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>

              {!forgotMode && (
                <div>
                  <Label htmlFor="admin-password" required>{t('admin.password')}</Label>
                  <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
              )}

              {errorText && <p className="text-sm text-danger" role="alert">{errorText}</p>}

              <Button type="submit" size="lg" className="w-full" isLoading={loading}>
                {loading ? t('admin.signingIn') : t(forgotMode ? 'admin.sendResetLink' : 'admin.signIn')}
              </Button>

              <div className="text-center">
                <button type="button" onClick={() => { setForgotMode(!forgotMode); setError(''); setAuthError(''); setFieldErrors({}) }} className="text-xs text-primary hover:underline">
                  {forgotMode ? t('admin.back') : t('admin.forgotPassword')}
                </button>
              </div>
            </form>
          )}
        </Card>

        <a href="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-muted hover:text-text">
          <ArrowLeft className="h-4 w-4" /> {t('admin.backToSite')}
        </a>
      </div>
    </div>
  )
}
