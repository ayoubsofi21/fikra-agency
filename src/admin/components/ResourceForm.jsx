import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import adminApi from '@/admin/api/client'
import { optionSets } from '@/admin/config/resources'
import Field from './Field'
import { Button, Spinner } from './ui'

const LOCALES = ['en', 'fr', 'ar']

const buildInitialValues = (config, item) => {
  const values = {}
  config.fields.forEach((field) => {
    const raw = item?.[field.name]

    if (field.type === 'toggle') {
      values[field.name] = raw ?? field.defaultValue ?? false
    } else if (field.localized) {
      values[field.name] = { en: '', fr: '', ar: '', ...(raw && typeof raw === 'object' ? raw : {}) }
      if (field.type === 'blocks' && !raw) values[field.name] = { en: [], fr: [], ar: [] }
    } else if (field.type === 'tags' || field.type === 'localizedRows') {
      values[field.name] = Array.isArray(raw) ? raw : field.type === 'localizedRows' ? [] : []
    } else {
      values[field.name] = raw ?? field.defaultValue ?? ''
    }
  })
  return values
}

const errorFor = (errors, name) => {
  const keys = [name, ...LOCALES.map((locale) => `${name}.${locale}`)]
  for (const key of keys) {
    const value = errors?.[key]
    if (Array.isArray(value) && value.length) return value[0]
    if (typeof value === 'string') return value
  }
  return null
}

const toPayload = (config, values, isEdit) => {
  const payload = {}
  config.fields.forEach((field) => {
    let value = values[field.name]

    if (field.type === 'number') {
      if (value === '' || value === null || value === undefined) value = null
      else value = Number(value)
    }

    if (field.localized) {
      const clean = {}
      LOCALES.forEach((locale) => {
        if (value?.[locale] !== undefined && value[locale] !== null) clean[locale] = value[locale]
      })
      value = clean
    }

    // Optional empty values would otherwise override model defaults with ''
    // or NULL and break NOT NULL columns (e.g. services.category,
    // testimonials.rating, posts.reading_time).
    if (!field.required && (value === '' || value === null)) return

    payload[field.name] = value
  })

  return config.prepare ? config.prepare(payload, isEdit) : payload
}

export default function ResourceForm({ config, item, parentValue, onSave, onCancel }) {
  const { t } = useTranslation()
  const [values, setValues] = useState(() => buildInitialValues(config, item))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [optionData, setOptionData] = useState({})

  const usedOptionKeys = useMemo(
    () => [...new Set(config.fields.map((field) => field.optionsKey).filter(Boolean))],
    [config],
  )

  useEffect(() => {
    let cancelled = false

    const loadOptions = async (key) => {
      const set = optionSets[key]
      if (!set) return [key, []]
      if (set.options) return [key, set.options]

      try {
        const { items } = await adminApi.list(set.path, { limit: 50 })
        return [key, items.map((entry) => ({
          value: entry[set.valueKey || 'id'],
          label: set.localizedLabel
            ? (entry[set.labelKey]?.en || entry[set.labelKey]?.fr || entry[set.labelKey]?.ar || `#${entry.id}`)
            : (entry[set.labelKey] ?? `#${entry.id}`),
        }))]
      } catch {
        return [key, []]
      }
    }

    Promise.all(usedOptionKeys.map(loadOptions)).then((entries) => {
      if (!cancelled) setOptionData(Object.fromEntries(entries))
    })

    return () => { cancelled = true }
  }, [usedOptionKeys])

  const setValue = (name, value) => {
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => {
      if (!previous[name]) return previous
      const next = { ...previous }
      delete next[name]
      LOCALES.forEach((locale) => { delete next[`${name}.${locale}`] })
      return next
    })
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setSubmitError('')
    setErrors({})

    try {
      const payload = toPayload(config, values, !!item)
      const path = config.parent
        ? config.path.replace(`{${config.parent.key}}`, parentValue)
        : config.path
      const result = await (item
        ? adminApi.update(`${path}/${item.id}`, payload)
        : adminApi.create(path, payload))
      onSave(result, !item)
    } catch (error) {
      setErrors(error.errors || {})
      setSubmitError(error.message || t('admin.error'))
    } finally {
      setSaving(false)
    }
  }

  const layout = config.formLayout || []
  const fields = layout.length
    ? layout.flatMap((row) => (Array.isArray(row) ? row : [row]))
    : config.fields.map((field) => field.name)
  const ordered = fields
    .map((name) => config.fields.find((field) => field.name === name))
    .filter(Boolean)
  const remaining = config.fields.filter((field) => !fields.includes(field.name))
  const allFields = [...ordered, ...remaining]

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {allFields.map((field) => (
        <Field
          key={field.name}
          field={field}
          value={values[field.name]}
          options={optionData[field.optionsKey] || []}
          error={errorFor(errors, field.name)}
          onChange={(value) => setValue(field.name, value)}
        />
      ))}

      {submitError && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
          {submitError}
          {Object.keys(errors).length > 0 && <span className="block text-xs opacity-80">{t('admin.validation')}</span>}
        </div>
      )}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>{t('admin.cancel')}</Button>
        <Button type="submit" isLoading={saving}>
          {saving ? t('admin.saving') : t('admin.save')}
        </Button>
      </div>
      {saving && <Spinner className="hidden" />}
    </form>
  )
}
