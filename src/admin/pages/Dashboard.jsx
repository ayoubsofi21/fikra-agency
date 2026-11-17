import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText, Mail, Send, Layers3, ArrowUpRight, RefreshCw } from 'lucide-react'
import adminApi from '@/admin/api/client'
import { useAdminAuth } from '@/admin/context/AdminAuthContext'
import { Badge, Button, Card, EmptyState, Spinner, cx } from '@/admin/components/ui'

// Map API counter keys to their real admin routes and translated labels.
const CONTENT_LINKS = {
  services: { path: '/admin/content/services', label: 'admin.services' },
  solutions: { path: '/admin/content/solutions', label: 'admin.solutions' },
  projects: { path: '/admin/content/projects', label: 'admin.projects' },
  posts: { path: '/admin/content/posts', label: 'admin.posts' },
  team: { path: '/admin/content/team', label: 'admin.team' },
  testimonials: { path: '/admin/content/testimonials', label: 'admin.testimonials' },
  faqs: { path: '/admin/content/faqs', label: 'admin.faqs' },
  pricing_plans: { path: '/admin/content/pricing', label: 'admin.pricing' },
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)
}

function StatCard({ icon: Icon, label, value, hint, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  }
  return (
    <Card className="flex items-start gap-4 p-5">
      <div className={cx('rounded-xl p-3', tones[tone])}><Icon className="h-5 w-5" /></div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-text">{value ?? 0}</p>
        {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user, can } = useAdminAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setData(await adminApi.get('/admin/dashboard'))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="flex justify-center py-24"><Spinner className="h-8 w-8 text-primary" /></div>

  if (error) return (
    <Card className="p-6">
      <p className="text-sm text-danger">{error}</p>
      <Button className="mt-4" onClick={load}><RefreshCw className="h-4 w-4" /> {t('admin.retry')}</Button>
    </Card>
  )

  const inboxVisible = can('manage-inbox')
  const content = data?.content || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text">{t('admin.welcomeBack')}, {user?.name?.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-muted">{t('admin.dashboard')} — FIKRA Agency</p>
      </div>

      {inboxVisible && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={FileText} label={t('admin.quotes')} value={data?.quotes?.total} hint={`${data?.quotes?.by_status?.new ?? 0} ${t('admin.new').toLowerCase()}`} tone="primary" />
          <StatCard icon={Mail} label={t('admin.messages')} value={data?.messages?.total} hint={`${data?.messages?.unread ?? 0} ${t('admin.unread').toLowerCase()}`} tone="warning" />
          <StatCard icon={Send} label={t('admin.subscribers')} value={data?.subscribers?.total} hint={`${data?.subscribers?.this_month ?? 0} ${t('admin.thisMonth').toLowerCase()}`} tone="info" />
          <StatCard icon={Layers3} label={t('admin.contentOverview')} value={Object.values(content).reduce((sum, n) => sum + (Number(n) || 0), 0)} tone="success" />
        </div>
      )}

      {inboxVisible && (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-text">{t('admin.recentQuotes')}</h2>
              <Link to="/admin/inbox/quotes" className="flex items-center gap-1 text-xs text-primary hover:underline">{t('admin.view')} <ArrowUpRight className="h-3 w-3" /></Link>
            </div>
            {data?.recent_quotes?.length ? (
              <ul className="divide-y divide-border">
                {data.recent_quotes.map((quote) => (
                  <li key={quote.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">{quote.name} <span className="font-normal text-muted">· {quote.company || quote.email}</span></p>
                      <p className="truncate text-xs text-muted">{quote.project_type || quote.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge tone={quote.status === 'new' ? 'warning' : quote.status === 'won' ? 'success' : 'neutral'}>{t(`admin.${quote.status}`)}</Badge>
                      <span className="text-[11px] text-muted">{formatDate(quote.created_at)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <EmptyState title={t('admin.noResults')} />}
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-text">{t('admin.recentMessages')}</h2>
              <Link to="/admin/inbox/messages" className="flex items-center gap-1 text-xs text-primary hover:underline">{t('admin.view')} <ArrowUpRight className="h-3 w-3" /></Link>
            </div>
            {data?.recent_messages?.length ? (
              <ul className="divide-y divide-border">
                {data.recent_messages.map((message) => (
                  <li key={message.id} className="flex items-start justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text">{message.name} <span className="font-normal text-muted">· {message.email}</span></p>
                      <p className="truncate text-xs text-muted">{message.subject || message.message}</p>
                    </div>
                    {!message.is_read && <Badge tone="info">{t('admin.unread')}</Badge>}
                  </li>
                ))}
              </ul>
            ) : <EmptyState title={t('admin.noResults')} />}
          </Card>
        </div>
      )}

      {can('manage-content') && (
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-text">{t('admin.contentOverview')}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {Object.entries(content).map(([key, value]) => {
              const link = CONTENT_LINKS[key]
              if (!link) return null
              return (
                <Link key={key} to={link.path} className="rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-primary/5">
                  <p className="text-lg font-semibold text-text">{value}</p>
                  <p className="truncate text-[11px] text-muted">{t(link.label)}</p>
                </Link>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
