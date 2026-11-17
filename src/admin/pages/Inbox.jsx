import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, RefreshCw, Download, Eye, Trash2, CheckCheck, Paperclip, Mail } from 'lucide-react'
import adminApi from '@/admin/api/client'
import { optionSets } from '@/admin/config/resources'
import { useToast } from '@/admin/components/Toast'
import { Badge, Button, Card, EmptyState, Input, Label, Modal, Pagination, Select, Spinner, Textarea, cx } from '@/admin/components/ui'

const CONFIGS = {
  quotes: {
    path: '/admin/quotes',
    title: 'admin.quotes',
    export: 'quote-requests',
    filters: [{ key: 'status', optionsKey: 'quoteStatuses' }],
  },
  messages: {
    path: '/admin/contact-messages',
    title: 'admin.messages',
    export: 'contact-messages',
  },
  newsletter: {
    path: '/admin/newsletter',
    title: 'admin.subscribers',
    export: 'newsletter-subscribers',
  },
}

const dateOf = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

const statusTone = { new: 'warning', in_progress: 'info', won: 'success', lost: 'neutral' }

function DetailRow({ label, value, wide }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-text">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
    </div>
  )
}

export default function Inbox({ type }) {
  const { t } = useTranslation()
  const toast = useToast()
  const config = CONFIGS[type]
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [term, setTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => { setTerm(search); setPage(1) }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await adminApi.list(config.path, {
        page, limit: 20,
        ...(term ? { search: term } : {}),
        ...filters,
      })
      setItems(result.items)
      setPagination(result.pagination)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [config, page, term, filters])

  useEffect(() => { load() }, [load])

  const open = async (item) => {
    try {
      const detail = await adminApi.get(`${config.path}/${item.id}`)
      setSelected(detail)
      setForm({
        status: detail.status || 'new',
        internal_notes: detail.internal_notes || '',
        is_read: detail.is_read || false,
      })
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      const payload = type === 'quotes'
        ? { status: form.status, internal_notes: form.internal_notes || null }
        : { is_read: !!form.is_read }
      const result = await adminApi.update(`${config.path}/${selected.id}`, payload)
      setSelected(result)
      toast(t('admin.saved'))
      await load()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const markRead = async (item) => {
    try {
      await adminApi.update(`${config.path}/${item.id}`, { is_read: true })
      setItems((all) => all.map((entry) => (entry.id === item.id ? { ...entry, is_read: true } : entry)))
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await adminApi.remove(`${config.path}/${deleting.id}`)
      setDeleting(null)
      toast(t('admin.deleted'))
      await load()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const exportCsv = async () => {
    setExporting(true)
    try {
      await adminApi.download(`${config.path}/export`, `${config.export}-${new Date().toISOString().slice(0, 10)}.csv`, filters)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setExporting(false)
    }
  }

  const downloadAttachment = async (quote, index) => {
    try {
      await adminApi.download(`/admin/quotes/${quote.id}/attachments/${index}`, quote.attachments_meta?.[index]?.name || `attachment-${index}`)
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">{t(config.title)}</h1>
          <p className="mt-1 text-sm text-muted">{pagination ? `${pagination.total} ${t('admin.total').toLowerCase()}` : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /> {t('admin.refresh')}</Button>
          <Button variant="outline" size="sm" onClick={exportCsv} isLoading={exporting}><Download className="h-4 w-4" /> {t('admin.export')}</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('admin.search')} className="ps-9" />
          </div>
          {config.filters?.map((filter) => (
            <Select key={filter.key} value={filters[filter.key] || ''} onChange={(event) => { setFilters({ [filter.key]: event.target.value }); setPage(1) }} className="sm:w-48">
              <option value="">{t('admin.all')}</option>
              {(optionSets[filter.optionsKey]?.options || []).map((option) => (
                <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
              ))}
            </Select>
          ))}
        </div>

        {error && <div className="m-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-16"><Spinner className="h-8 w-8 text-primary" /></div>
        ) : !items.length ? (
          <EmptyState icon={Mail} title={t('admin.noResults')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/60 text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 text-start font-semibold">{type === 'newsletter' ? t('admin.email') : t('admin.name')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{type === 'quotes' ? t('admin.projectType') : type === 'messages' ? t('admin.subject') : t('admin.createdAt')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t('admin.status')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t('admin.createdAt')}</th>
                  <th className="px-4 py-3 text-end font-semibold">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className={cx('hover:bg-surface/40', !item.is_read && type === 'messages' && 'bg-primary/[0.03]')}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-text">{item.name || item.email}</p>
                      {item.name && <p className="text-xs text-muted">{item.email}</p>}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted">{item.project_type || item.subject || '—'}</td>
                    <td className="px-4 py-3">
                      {type === 'quotes'
                        ? <Badge tone={statusTone[item.status] || 'neutral'}>{t(`admin.${item.status}`)}</Badge>
                        : type === 'messages'
                          ? <Badge tone={item.is_read ? 'neutral' : 'info'}>{t(item.is_read ? 'admin.read' : 'admin.unread')}</Badge>
                          : <Badge tone="success">{t('admin.active')}</Badge>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{dateOf(item.created_at || item.subscribed_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {type === 'messages' && !item.is_read && (
                          <Button variant="ghost" size="sm" aria-label={t('admin.markRead')} onClick={() => markRead(item)}><CheckCheck className="h-4 w-4" /></Button>
                        )}
                        {type !== 'newsletter' && (
                          <Button variant="ghost" size="sm" aria-label={t('admin.view')} onClick={() => open(item)}><Eye className="h-4 w-4" /></Button>
                        )}
                        <Button variant="ghost" size="sm" aria-label={t('admin.delete')} onClick={() => setDeleting(item)}><Trash2 className="h-4 w-4 text-danger" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination pagination={pagination} onChange={setPage} />
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={type === 'quotes' ? `${t('admin.quotes')} #${selected?.id}` : `${t('admin.messages')} #${selected?.id}`}
        size="lg"
        footer={
          type === 'newsletter' ? null : (
            <>
              <Button variant="secondary" onClick={() => setSelected(null)}>{t('admin.close')}</Button>
              <Button onClick={save} isLoading={saving}>{t('admin.save')}</Button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow label={t('admin.name')} value={selected.name} />
              <DetailRow label={t('admin.email')} value={selected.email} />
              <DetailRow label={t('admin.phone')} value={selected.phone} />
              <DetailRow label={t('admin.company')} value={selected.company} />
              <DetailRow label={t('admin.projectType')} value={selected.project_type} />
              <DetailRow label={t('admin.budget')} value={selected.budget_range} />
              <DetailRow label={t('admin.timeline')} value={selected.timeline} />
              <DetailRow label={t('admin.subject')} value={selected.subject} />
              <DetailRow label={t('admin.createdAt')} value={dateOf(selected.created_at)} />
              <DetailRow label={t('admin.projectBrief')} value={selected.description || selected.message} wide />
            </div>

            {type === 'quotes' && (
              <>
                {selected.attachments_meta?.length > 0 && (
                  <div>
                    <Label><Paperclip className="me-1 inline h-4 w-4" /> {t('admin.attachments')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {selected.attachments_meta.map((attachment) => (
                        <Button key={attachment.index} variant="outline" size="sm" onClick={() => downloadAttachment(selected, attachment.index)}>
                          <Paperclip className="h-4 w-4" /> {attachment.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>{t('admin.statusUpdate')}</Label>
                    <Select value={form.status || ''} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                      {(optionSets.quoteStatuses.options).map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label>{t('admin.internalNotes')}</Label>
                    <Textarea rows={2} value={form.internal_notes || ''} onChange={(event) => setForm({ ...form, internal_notes: event.target.value })} />
                  </div>
                </div>
              </>
            )}

            {type === 'messages' && (
              <label className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm">
                <input type="checkbox" checked={!!form.is_read} onChange={(event) => setForm({ ...form, is_read: event.target.checked })} />
                {t('admin.markRead')}
              </label>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={t('admin.confirmDelete')}
        size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleting(null)}>{t('admin.cancel')}</Button>
          <Button variant="danger" onClick={remove} isLoading={busy}>{t('admin.delete')}</Button>
        </>}
      >
        <p className="text-sm text-muted">{t('admin.deleteQuestion')}</p>
      </Modal>
    </div>
  )
}
