import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input, Textarea, Select, Toggle, Label, FieldError, Button, cx } from './ui'

const LOCALES = [
  { code: 'en', labelKey: 'admin.english' },
  { code: 'fr', labelKey: 'admin.french' },
  { code: 'ar', labelKey: 'admin.arabic' },
]

const asText = (value) => {
  if (value == null) return ''
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return ''
  return String(value)
}

const asArray = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'string' && item.trim() !== '').map((item) => item.trim())
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
  return []
}

const asLocalized = (value) => {
  const base = { en: '', fr: '', ar: '' }
  if (value && typeof value === 'object' && !Array.isArray(value)) return { ...base, ...value }
  if (typeof value === 'string') return { ...base, en: value }
  return base
}

const linesToBlocks = (lines) => asArray(lines).map((text) => ({ type: 'p', text }))
const blocksToLines = (blocks) => Array.isArray(blocks) ? blocks.map((block) => (typeof block === 'string' ? block : block?.text || '')).filter(Boolean).join('\n') : ''

function LocalizedInput({ field, value, onChange, error, disabled }) {
  const { t } = useTranslation()
  const localizedValue = asLocalized(value)
  const kind = field.localizedType || (field.type === 'localized' ? (field.rows ? 'textarea' : 'text') : field.type)
  const isList = kind === 'lines' || kind === 'blocks'

  const update = (locale, next) => {
    if (isList) {
      const lines = asArray(next)
      onChange({ ...localizedValue, [locale]: kind === 'blocks' ? linesToBlocks(lines) : lines })
    } else {
      onChange({ ...localizedValue, [locale]: next })
    }
  }

  const rawFor = (locale) => {
    const current = localizedValue[locale]
    if (kind === 'blocks') return blocksToLines(current)
    if (kind === 'lines') return asArray(current).join('\n')
    return asText(current)
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Label required={field.required}>{t(field.label)}</Label>
        <span className="text-[10px] font-medium text-muted/70">EN · FR · AR</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {LOCALES.map((locale) => (
          <div key={locale.code}>
            <Label>{t(locale.labelKey)}</Label>
            {kind === 'textarea' || isList ? (
              <Textarea
                value={rawFor(locale.code)}
                rows={isList ? 5 : 4}
                dir={locale.code === 'ar' ? 'rtl' : 'ltr'}
                disabled={disabled}
                onChange={(event) => update(locale.code, event.target.value)}
                placeholder={field.placeholder}
              />
            ) : (
              <Input
                type={kind === 'number' ? 'number' : 'text'}
                value={rawFor(locale.code)}
                dir={locale.code === 'ar' ? 'rtl' : 'ltr'}
                disabled={disabled}
                onChange={(event) => update(locale.code, event.target.value)}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>
      <FieldError message={error} />
    </div>
  )
}

function LocalizedRows({ field, value, onChange, error, disabled }) {
  const { t } = useTranslation()
  const rows = Array.isArray(value) ? value : []
  const update = (index, locale, text) => {
    const next = rows.map((row) => ({ ...row }))
    next[index] = { ...next[index], [locale]: text }
    onChange(next)
  }

  return (
    <div>
      <Label>{t(field.label)}</Label>
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="rounded-lg border border-border bg-surface/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted">#{index + 1}</span>
              <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={() => onChange(rows.filter((_, i) => i !== index))}>
                <Trash2 className="h-4 w-4" /> {t('admin.removeItem')}
              </Button>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {LOCALES.map((locale) => (
                <Input
                  key={locale.code}
                  value={asText(row?.[locale.code])}
                  dir={locale.code === 'ar' ? 'rtl' : 'ltr'}
                  disabled={disabled}
                  onChange={(event) => update(index, locale.code, event.target.value)}
                  placeholder={t(locale.labelKey)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button type="button" size="sm" variant="secondary" className="mt-3" disabled={disabled} onClick={() => onChange([...rows, { en: '', fr: '', ar: '' }])}>
        <Plus className="h-4 w-4" /> {t('admin.addItem')}
      </Button>
      <FieldError message={error} />
    </div>
  )
}

export default function Field({ field, value, onChange, error, options = [], disabled = false }) {
  const { t } = useTranslation()

  if (field.type === 'toggle') {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2.5">
        <Label>{t(field.label)}</Label>
        <Toggle checked={!!value} onChange={onChange} label={t(field.label)} disabled={disabled} />
      </div>
    )
  }

  if (field.type === 'localizedRows') {
    return <LocalizedRows field={field} value={value} onChange={onChange} error={error} disabled={disabled} />
  }

  if (field.localized || ['lines', 'blocks'].includes(field.type)) {
    return <LocalizedInput field={field} value={value} onChange={onChange} error={error} disabled={disabled} />
  }

  const common = {
    id: `admin-field-${field.name}`,
    value: asText(value),
    disabled,
    'aria-invalid': !!error,
    onChange: (event) => onChange(event.target.value),
  }

  let control
  if (field.type === 'textarea') {
    control = <Textarea {...common} rows={field.rows || 4} placeholder={field.placeholder} />
  } else if (field.type === 'select') {
    control = (
      <Select {...common}>
        <option value="">{t('admin.selectPlaceholder')}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.labelKey ? t(option.labelKey) : option.label}</option>
        ))}
      </Select>
    )
  } else if (field.type === 'tags') {
    control = (
      <Input
        {...common}
        value={asArray(value).join(', ')}
        onChange={(event) => onChange(asArray(event.target.value))}
        placeholder={field.placeholder || 'One, two, three'}
      />
    )
  } else {
    control = <Input {...common} type={field.type || 'text'} step={field.type === 'number' ? 'any' : undefined} placeholder={field.placeholder} />
  }

  return (
    <div>
      <Label htmlFor={common.id} required={field.required}>{t(field.label)}</Label>
      {control}
      {field.hint && <p className={cx('mt-1 text-xs text-muted')}>{t(field.hint)}</p>}
      <FieldError message={error} />
    </div>
  )
}
