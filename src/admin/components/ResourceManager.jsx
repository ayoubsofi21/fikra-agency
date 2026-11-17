import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Pencil, Trash2, RotateCcw, RefreshCw, Paperclip, Download } from 'lucide-react'
import adminApi from '@/admin/api/client'
import { optionSets } from '@/admin/config/resources'
import ResourceForm from './ResourceForm'
import { Button, Card, Badge, Input, Select, Modal, ConfirmDialog, EmptyState, Pagination, Spinner, cx } from './ui'

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

const cellValue = (column, item) => {
  const value = item?.[column.key]
  if (column.kind === 'localized') {
    if (value && typeof value === 'object') return value.en || value.fr || value.ar || '—'
    return value ?? '—'
  }
  if (column.kind === 'relation') {
    if (!value) return '—'
    if (typeof value === 'object') return value.name?.en || value.name?.fr || value.name?.ar || value.name || '—'
    return String(value)
  }
  if (column.kind === 'status') {
    return value ? <Badge tone="success">✓</Badge> : <Badge tone="neutral">—</Badge>
  }
  if (column.kind === 'date') return formatDate(value)
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? '✓' : '—'
  if (Array.isArray(value)) return value.slice(0, 3).join(', ') || '—'
  return String(value)
}

export default function ResourceManager({ config, onToast }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState({})
  const [trashed, setTrashed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [parentOptions, setParentOptions] = useState([])
  const [parentValue, setParentValue] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const path = useMemo(() => (
    config.parent ? config.path.replace(`{${config.parent.key}}`, parentValue || 0) : config.path
  ), [config, parentValue])

  useEffect(() => {
    if (!config.parent) return
    adminApi.list(config.parent.path, { limit: 50 })
      .then(({ items: parents }) => {
        setParentOptions(parents.map((entry) => ({
          value: entry.id,
          label: config.parent.localizedLabel
            ? (entry[config.parent.labelKey]?.en || entry[config.parent.labelKey]?.fr || `#${entry.id}`)
            : (entry[config.parent.labelKey] ?? `#${entry.id}`),
        })))
      })
      .catch(() => setParentOptions([]))
  }, [config])

  const load = useCallback(async () => {
    if (config.parent && !parentValue) {
      setItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const params = { page, limit: 20, ...(debouncedSearch ? { search: debouncedSearch } : {}), ...filters }
      if (config.softDeletes && trashed) params.trashed = 'only'
      const result = await adminApi.list(path, params)
      setItems(result.items)
      setPagination(result.pagination)
    } catch (err) {
      setError(err.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [config, parentValue, page, debouncedSearch, filters, path, trashed])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (item) => { setEditing(item); setFormOpen(true) }

  const saved = async (_result, created) => {
    setFormOpen(false)
    onToast?.(t(created ? 'admin.createdMsg' : 'admin.saved'))
    await load()
  }

  const confirmDelete = async () => {
    setBusy(true)
    try {
      await adminApi.remove(`${path}/${deleting.id}`)
      onToast?.(t('admin.deleted'))
      setDeleting(null)
      await load()
    } catch (err) {
      onToast?.(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const restore = async (item) => {
    try {
      await adminApi.create(`${path}/${item.id}/restore`, {})
      onToast?.(t('admin.restored') || t('admin.saved'))
      await load()
    } catch (err) {
      onToast?.(err.message, 'error')
    }
  }

  const toggle = async (item) => {
    try {
      await adminApi.update(`${path}/${item.id}/toggle`, {})
      setItems((previous) => previous.map((entry) => (entry.id === item.id ? { ...entry, is_active: !entry.is_active } : entry)))
    } catch (err) {
      onToast?.(err.message, 'error')
    }
  }

  const exportCsv = async () => {
    setExporting(true)
    try {
      await adminApi.download(`${path}/export`, `${config.title?.split('.').pop() || 'export'}-${new Date().toISOString().slice(0, 10)}.csv`, filters)
    } catch (err) {
      onToast?.(err.message, 'error')
    } finally {
      setExporting(false)
    }
  }

  const canCreate = !trashed

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">{t(config.title)}</h1>
          <p className="mt-1 text-sm text-muted">
            {pagination ? `${t('admin.showing')} ${pagination.total} ${t('admin.of')} ${t('admin.total').toLowerCase()}` : t('admin.loading')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {config.export && (
            <Button variant="outline" size="sm" onClick={exportCsv} isLoading={exporting}>
              <Download className="h-4 w-4" /> {t('admin.export')}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /> {t('admin.refresh')}</Button>
          {canCreate && (
            <Button size="sm" onClick={openCreate} disabled={config.parent && !parentValue}>
              <Plus className="h-4 w-4" /> {t('admin.create')}
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center">
          {config.parent && (
            <div className="lg:w-64">
              <Select value={parentValue} onChange={(event) => { setParentValue(event.target.value); setPage(1) }}>
                <option value="">{t('admin.chooseItem')}</option>
                {parentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </Select>
            </div>
          )}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('admin.search')} className="ps-9" />
          </div>
          {config.filters?.map((filter) => (
            <Select key={filter.key} value={filters[filter.key] || ''} onChange={(event) => { setFilters((prev) => ({ ...prev, [filter.key]: event.target.value })); setPage(1) }} className="lg:w-40">
              <option value="">{t(filter.label)}: {t('admin.all')}</option>
              {(optionSetsLocal(filter.optionsKey)).map((option) => (
                <option key={option.value} value={option.value}>{option.labelKey ? t(option.labelKey) : option.label}</option>
              ))}
            </Select>
          ))}
          {config.softDeletes && (
            <Button variant={trashed ? 'primary' : 'outline'} size="sm" onClick={() => { setTrashed(!trashed); setPage(1) }}>
              <RotateCcw className="h-4 w-4" /> {t('admin.trashed')}
            </Button>
          )}
        </div>

        {error && (
          <div className="m-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
            {error} <Button variant="ghost" size="sm" onClick={load}>{t('admin.retry')}</Button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><Spinner className="h-8 w-8 text-primary" /></div>
        ) : !items.length ? (
          <EmptyState title={t('admin.noResults')} description={config.parent && !parentValue ? t('admin.mediaHint') : t('admin.noItems')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/60 text-start text-xs uppercase tracking-wide text-muted">
                  {config.columns.map((column) => <th key={column.key} className="px-4 py-3 text-start font-semibold">{t(column.label)}</th>)}
                  <th className="px-4 py-3 text-end font-semibold">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-surface/40">
                    {config.columns.map((column) => (
                      <td key={column.key} className={cx('px-4 py-3', column.primary && 'font-medium text-text', !column.primary && 'text-muted')}>
                        {cellValue(column, item)}
                      </td>
                    ))}
                    <td>
                      <div className="flex justify-end gap-1">
                        {config.mediaTypes?.length > 0 && (
                          <Button variant="ghost" size="sm" aria-label={t('admin.media')} onClick={() => navigate(`/admin/media?type=${config.mediaTypes[0]}&id=${item.id}`)}>
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        )}
                        {config.toggle && !trashed && (
                          <button
                            type="button"
                            aria-label={t('admin.active')}
                            title={t(item.is_active ? 'admin.active' : 'admin.inactive')}
                            onClick={() => toggle(item)}
                            className={cx('rounded-lg px-2 py-1 text-xs font-medium', item.is_active ? 'bg-success/10 text-success' : 'bg-surfaceAlt text-muted')}
                          >
                            {item.is_active ? t('admin.active') : t('admin.inactive')}
                          </button>
                        )}
                        {trashed ? (
                          <Button variant="ghost" size="sm" onClick={() => restore(item)}>
                            <RotateCcw className="h-4 w-4" /> {t('admin.restore')}
                          </Button>
                        ) : (
                          <>
                            <Button variant="ghost" size="sm" aria-label={t('admin.edit')} onClick={() => openEdit(item)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" aria-label={t('admin.delete')} onClick={() => setDeleting(item)}>
                              <Trash2 className="h-4 w-4 text-danger" />
                            </Button>
                          </>
                        )}
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
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={`${editing ? t('admin.edit') : t('admin.create')} — ${t(config.title)}`}
        size="xl"
      >
        {formOpen && (
          <ResourceForm
            config={config}
            item={editing}
            parentValue={parentValue}
            onSave={saved}
            onCancel={() => setFormOpen(false)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={busy}
        title={t('admin.confirmDelete')}
        description={t('admin.deleteQuestion')}
      />
    </div>
  )
}

function optionSetsLocal(key) {
  return optionSets[key]?.options || []
}
