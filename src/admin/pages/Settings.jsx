import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, RotateCcw } from 'lucide-react'
import adminApi from '@/admin/api/client'
import { useToast } from '@/admin/components/Toast'
import { Button, Card, EmptyState, Input, Label, Spinner, Textarea } from '@/admin/components/ui'

const SITE_FIELDS = [
  { key: 'name', label: 'admin.name' },
  { key: 'tagline', label: 'admin.tagline' },
  { key: 'description', label: 'admin.description', textarea: true },
  { key: 'email', label: 'admin.email' },
  { key: 'phone', label: 'admin.phone' },
  { key: 'location', label: 'admin.location' },
  { key: 'workingHours', label: 'admin.workingHours' },
]

const emptySocial = { name: '', url: '', icon: '' }
const emptyStat = { value: 0, suffix: { en: '', fr: '', ar: '' }, label: '' }

export default function Settings() {
  const { t } = useTranslation()
  const toast = useToast()
  const [data, setData] = useState(null)
  const [form, setForm] = useState({ site: {}, social: [], stats: [], whatsapp: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const apply = (payload) => {
    setData(payload)
    setForm({
      site: { ...(payload.site || {}) },
      social: Array.isArray(payload.social) ? payload.social : [],
      stats: Array.isArray(payload.stats) ? payload.stats : [],
      whatsapp: payload.whatsapp || '',
    })
  }

  useEffect(() => {
    adminApi.get('/admin/settings')
      .then(apply)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const result = await adminApi.update('/admin/settings', {
        site: form.site,
        social: form.social.filter((row) => row.name && row.url),
        stats: form.stats.filter((row) => row.label),
        whatsapp: form.whatsapp,
      })
      apply(result)
      toast(t('admin.settingsSaved'))
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner className="h-8 w-8 text-primary" /></div>
  if (error) return <Card className="p-6"><p className="text-sm text-danger">{error}</p><Button className="mt-4" onClick={() => window.location.reload()}>{t('admin.retry')}</Button></Card>

  const setSocial = (index, key, value) => setForm((prev) => ({ ...prev, social: prev.social.map((row, i) => (i === index ? { ...row, [key]: value } : row)) }))
  const setStat = (index, key, value) => setForm((prev) => ({ ...prev, stats: prev.stats.map((row, i) => (i === index ? { ...row, [key]: value } : row)) }))
  const setStatSuffix = (index, locale, value) => setForm((prev) => ({ ...prev, stats: prev.stats.map((row, i) => (i === index ? { ...row, suffix: { ...row.suffix, [locale]: value } } : row)) }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text">{t('admin.settings')}</h1>
          <p className="mt-1 text-sm text-muted">FIKRA Agency</p>
        </div>
        <Button onClick={save} isLoading={saving}><RotateCcw className="h-4 w-4" /> {t('admin.saveSettings')}</Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-text">{t('admin.siteIdentity')}</h2>
          <div className="space-y-4">
            {SITE_FIELDS.map((field) => (
              <div key={field.key}>
                <Label>{t(field.label)}</Label>
                {field.textarea ? (
                  <Textarea rows={3} value={form.site[field.key] || ''} onChange={(event) => setForm({ ...form, site: { ...form.site, [field.key]: event.target.value } })} />
                ) : (
                  <Input value={form.site[field.key] || ''} onChange={(event) => setForm({ ...form, site: { ...form.site, [field.key]: event.target.value } })} />
                )}
              </div>
            ))}
            <div>
              <Label>{t('admin.whatsapp')}</Label>
              <Input value={form.whatsapp} onChange={(event) => setForm({ ...form, whatsapp: event.target.value })} placeholder="212600000000" />
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">{t('admin.socialLinks')}</h2>
              <Button size="sm" variant="secondary" onClick={() => setForm({ ...form, social: [...form.social, { ...emptySocial }] })}><Plus className="h-4 w-4" /> {t('admin.addItem')}</Button>
            </div>
            {form.social.length ? (
              <div className="space-y-3">
                {form.social.map((row, index) => (
                  <div key={index} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_1.4fr_0.8fr_auto]">
                    <Input value={row.name || ''} onChange={(event) => setSocial(index, 'name', event.target.value)} placeholder={t('admin.name')} />
                    <Input value={row.url || ''} onChange={(event) => setSocial(index, 'url', event.target.value)} placeholder="https://" />
                    <Input value={row.icon || ''} onChange={(event) => setSocial(index, 'icon', event.target.value)} placeholder={t('admin.icon')} />
                    <Button size="sm" variant="ghost" onClick={() => setForm({ ...form, social: form.social.filter((_, i) => i !== index) })} aria-label={t('admin.removeItem')}><Trash2 className="h-4 w-4 text-danger" /></Button>
                  </div>
                ))}
              </div>
            ) : <EmptyState title={t('admin.noResults')} />}
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">{t('admin.homeStats')}</h2>
              <Button size="sm" variant="secondary" onClick={() => setForm({ ...form, stats: [...form.stats, { ...emptyStat, suffix: { ...emptyStat.suffix } }] })}><Plus className="h-4 w-4" /> {t('admin.addItem')}</Button>
            </div>
            {form.stats.length ? (
              <div className="space-y-3">
                {form.stats.map((row, index) => (
                  <div key={index} className="space-y-2 rounded-lg border border-border p-3">
                    <div className="flex gap-2">
                      <Input type="number" value={row.value ?? 0} onChange={(event) => setStat(index, 'value', Number(event.target.value))} className="w-28" placeholder={t('admin.total')} />
                      <Input value={row.label || ''} onChange={(event) => setStat(index, 'label', event.target.value)} placeholder={t('admin.name')} className="flex-1" />
                      <Button size="sm" variant="ghost" onClick={() => setForm({ ...form, stats: form.stats.filter((_, i) => i !== index) })} aria-label={t('admin.removeItem')}><Trash2 className="h-4 w-4 text-danger" /></Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['en', 'fr', 'ar'].map((locale) => (
                        <Input key={locale} value={row.suffix?.[locale] || ''} onChange={(event) => setStatSuffix(index, locale, event.target.value)} placeholder={`Suffix ${locale}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState title={t('admin.noResults')} />}
          </Card>
        </div>
      </div>

      {data && Object.keys(data).filter((key) => !['site', 'social', 'stats', 'whatsapp'].includes(key)).length > 0 && (
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-semibold text-text">{t('admin.details')}</h2>
          <pre className="overflow-x-auto rounded-lg bg-surface p-3 text-xs text-muted">{JSON.stringify(Object.fromEntries(Object.entries(data).filter(([key]) => !['site', 'social', 'stats', 'whatsapp'].includes(key))), null, 2)}</pre>
        </Card>
      )}
    </div>
  )
}
