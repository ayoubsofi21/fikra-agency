import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Image as ImageIcon, Upload, Trash2, Pencil, FileText, ExternalLink } from 'lucide-react'
import adminApi from '@/admin/api/client'
import { useAdminAuth } from '@/admin/context/AdminAuthContext'
import { useToast } from '@/admin/components/Toast'
import { Badge, Button, Card, EmptyState, Input, Label, Modal, Select, Spinner } from '@/admin/components/ui'

const TYPES = [
  { value: 'projects', path: '/admin/projects', label: 'admin.projects', collections: ['cover', 'gallery'], permission: 'manage-content' },
  { value: 'posts', path: '/admin/posts', label: 'admin.posts', collections: ['cover'], permission: 'manage-content' },
  { value: 'team', path: '/admin/team', label: 'admin.team', collections: ['photo'], permission: 'manage-content' },
  { value: 'testimonials', path: '/admin/testimonials', label: 'admin.testimonials', collections: ['avatar'], permission: 'manage-content' },
  { value: 'users', path: '/admin/users', label: 'admin.users', collections: ['avatar'], permission: 'manage-users' },
]

const itemLabel = (item) => {
  const name = item.name || item.title || item.author_name
  if (name && typeof name === 'object') return name.en || name.fr || name.ar || `#${item.id}`
  return name ? `${name} (#${item.id})` : `#${item.id}`
}

export default function Media() {
  const { t } = useTranslation()
  const toast = useToast()
  const { can } = useAdminAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const availableTypes = useMemo(() => TYPES.filter((type) => can(type.permission)), [can])

  const [type, setType] = useState(() => {
    const initial = searchParams.get('type')
    return availableTypes.some((entry) => entry.value === initial) ? initial : availableTypes[0]?.value || 'projects'
  })
  const [itemId, setItemId] = useState(() => searchParams.get('id') || '')
  const [items, setItems] = useState([])
  const [media, setMedia] = useState([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [error, setError] = useState('')
  const [files, setFiles] = useState([])
  const [collection, setCollection] = useState('cover')
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', alt: '' })
  const [saving, setSaving] = useState(false)

  const currentType = TYPES.find((entry) => entry.value === type) || TYPES[0]

  useEffect(() => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      if (type) next.set('type', type)
      if (itemId) next.set('id', itemId)
      else next.delete('id')
      return next
    }, { replace: true })
  }, [type, itemId, setSearchParams])

  useEffect(() => {
    if (!currentType.collections.includes(collection)) setCollection(currentType.collections[0])
  }, [currentType, collection])

  useEffect(() => {
    setItems([])
    setMedia([])
    let cancelled = false
    adminApi.list(currentType.path, { limit: 50 })
      .then(({ items: rows }) => { if (!cancelled) setItems(rows) })
      .catch((err) => { if (!cancelled) setError(err.message) })
    return () => { cancelled = true }
  }, [currentType])

  const loadMedia = useCallback(async () => {
    if (!itemId) { setMedia([]); return }
    setLoadingMedia(true)
    setError('')
    try {
      const result = await adminApi.get(`/admin/media/${type}/${itemId}`)
      setMedia(result.media || [])
    } catch (err) {
      setError(err.message)
      setMedia([])
    } finally {
      setLoadingMedia(false)
    }
  }, [type, itemId])

  useEffect(() => { loadMedia() }, [loadMedia])

  const upload = async () => {
    if (!files.length) return
    if (files.length > 10) { toast(t('admin.tooManyFiles'), 'error'); return }
    setUploading(true)
    try {
      await adminApi.upload(`/admin/media/${type}/${itemId}`, files, collection)
      setFiles([])
      toast(t('admin.saved'))
      await loadMedia()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await adminApi.update(`/admin/media/${editing.id}`, form)
      setEditing(null)
      toast(t('admin.saved'))
      await loadMedia()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    try {
      await adminApi.remove(`/admin/media/${id}`)
      toast(t('admin.deleted'))
      await loadMedia()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-text">{t('admin.media')}</h1>
        <p className="mt-1 text-sm text-muted">{t('admin.mediaHint')}</p>
      </div>

      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>{t('admin.chooseResource')}</Label>
            <Select value={type} onChange={(event) => { setType(event.target.value); setItemId('') }}>
              {availableTypes.map((entry) => <option key={entry.value} value={entry.value}>{t(entry.label)}</option>)}
            </Select>
          </div>
          <div>
            <Label>{t('admin.chooseItem')}</Label>
            <Select value={itemId} onChange={(event) => setItemId(event.target.value)}>
              <option value="">{t('admin.selectPlaceholder')}</option>
              {items.map((item) => <option key={item.id} value={item.id}>{itemLabel(item)}</option>)}
            </Select>
          </div>
        </div>
      </Card>

      {error && <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">{error}</div>}

      {itemId ? (
        <>
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-text">{t('admin.upload')}</h2>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="lg:w-48">
                <Label>{t('admin.collection')}</Label>
                <Select value={collection} onChange={(event) => setCollection(event.target.value)}>
                  {currentType.collections.map((name) => <option key={name} value={name}>{name}</option>)}
                </Select>
              </div>
              <div className="flex-1">
                <Label>{t('admin.files')}</Label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(event) => setFiles(Array.from(event.target.files || []))}
                  className="block w-full text-sm text-muted file:me-3 file:rounded-lg file:border-0 file:bg-surfaceAlt file:px-3 file:py-2 file:text-sm file:text-text"
                />
              </div>
              <Button onClick={upload} isLoading={uploading} disabled={!files.length}>
                <Upload className="h-4 w-4" /> {t('admin.upload')}
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-text">{t('admin.media')} ({media.length})</h2>
            </div>
            {loadingMedia ? (
              <div className="flex justify-center py-16"><Spinner className="h-8 w-8 text-primary" /></div>
            ) : !media.length ? (
              <EmptyState icon={ImageIcon} title={t('admin.noMedia')} />
            ) : (
              <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {media.map((file) => (
                  <div key={file.id} className="group overflow-hidden rounded-xl border border-border bg-background">
                    <div className="flex h-36 items-center justify-center overflow-hidden bg-surfaceAlt">
                      {file.mime_type?.startsWith('image/') ? (
                        <img src={file.thumb || file.url} alt={file.custom_properties?.alt || file.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : <FileText className="h-10 w-10 text-muted" />}
                    </div>
                    <div className="space-y-2 p-3">
                      <p className="truncate text-sm font-medium text-text" title={file.name}>{file.name}</p>
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone="info">{file.collection}</Badge>
                        <span className="text-[11px] text-muted">{Math.round((file.size || 0) / 1024)} KB</span>
                      </div>
                      <div className="flex gap-1 pt-1">
                        <a href={file.url} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-muted hover:bg-surfaceAlt hover:text-text" aria-label={t('admin.openAttachment')}>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button type="button" onClick={() => { setEditing(file); setForm({ name: file.name || '', alt: file.custom_properties?.alt || '' }) }} className="rounded-lg p-2 text-muted hover:bg-surfaceAlt hover:text-text" aria-label={t('admin.edit')}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => remove(file.id)} className="rounded-lg p-2 text-danger hover:bg-danger/10" aria-label={t('admin.delete')}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      ) : (
        <Card><EmptyState icon={ImageIcon} title={t('admin.chooseItem')} description={t('admin.mediaHint')} /></Card>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={t('admin.edit')}
        size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setEditing(null)}>{t('admin.cancel')}</Button>
          <Button onClick={save} isLoading={saving}>{t('admin.save')}</Button>
        </>}
      >
        <div className="space-y-4">
          <div><Label>{t('admin.fileName')}</Label><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
          <div><Label>{t('admin.altText')}</Label><Input value={form.alt} onChange={(event) => setForm({ ...form, alt: event.target.value })} /></div>
        </div>
      </Modal>
    </div>
  )
}
