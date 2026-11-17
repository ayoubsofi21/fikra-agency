import { useEffect } from 'react'
import { X, Loader2, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const cx = (...parts) => parts.filter(Boolean).join(' ')

export function Spinner({ className = 'w-5 h-5' }) {
  return <Loader2 className={cx('animate-spin', className)} aria-hidden="true" />
}

export function Button({ variant = 'primary', size = 'md', isLoading = false, className, children, ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90 disabled:opacity-50',
    secondary: 'bg-surfaceAlt text-text hover:bg-border/60 disabled:opacity-50',
    ghost: 'text-muted hover:bg-surfaceAlt hover:text-text disabled:opacity-50',
    danger: 'bg-danger text-white hover:opacity-90 disabled:opacity-50',
    outline: 'border border-border text-text hover:bg-surfaceAlt disabled:opacity-50',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' }

  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Spinner className="w-4 h-4" />}
      {children}
    </button>
  )
}

export function Card({ className, children, ...props }) {
  return (
    <div className={cx('rounded-xl border border-border bg-background shadow-sm', className)} {...props}>
      {children}
    </div>
  )
}

export function Badge({ tone = 'neutral', children, className }) {
  const tones = {
    neutral: 'bg-surfaceAlt text-muted',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    primary: 'bg-primary/10 text-primary',
  }
  return (
    <span className={cx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}

const fieldBase =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60'

export function Input(props) {
  return <input {...props} className={cx(fieldBase, props.className)} />
}

export function Textarea({ rows = 3, ...props }) {
  return <textarea rows={rows} {...props} className={cx(fieldBase, 'resize-y', props.className)} />
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={cx(fieldBase, 'cursor-pointer', props.className)}>
      {children}
    </select>
  )
}

export function Label({ children, required, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-muted">
      {children}
      {required && <span className="text-danger ltr:ml-1 rtl:mr-1">*</span>}
    </label>
  )
}

export function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-danger" role="alert">{message}</p>
}

export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-border',
      )}
    >
      <span
        className={cx(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ltr:left-0.5 rtl:right-0.5',
          checked ? 'ltr:translate-x-5 rtl:-translate-x-5' : '',
        )}
      />
    </button>
  )
}

export function Modal({ open, onClose, title, children, size = 'lg', footer }) {
  const { t } = useTranslation()
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6" role="presentation">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cx('relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl bg-background shadow-2xl', widths[size])}
      >
        {title && (
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-text">{title}</h2>
            <button type="button" onClick={onClose} aria-label={t('admin.close')} className="rounded-lg p-1.5 text-muted hover:bg-surfaceAlt hover:text-text">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex shrink-0 justify-end gap-2 border-t border-border bg-surface/50 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }) {
  const { t } = useTranslation()
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" footer={
      <>
        <Button variant="secondary" onClick={onClose}>{t('admin.cancel')}</Button>
        <Button variant="danger" onClick={onConfirm} isLoading={loading}>{t('admin.delete')}</Button>
      </>
    }>
      <p className="text-sm text-muted">{description}</p>
    </Modal>
  )
}

export function EmptyState({ icon: Icon = Inbox, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 rounded-2xl bg-surfaceAlt p-4 text-muted"><Icon className="h-7 w-7" /></div>
      <p className="font-medium text-text">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
    </div>
  )
}

export function Pagination({ pagination, onChange }) {
  const { t } = useTranslation()
  if (!pagination || pagination.last_page <= 1) return null
  const { current_page: current, last_page: last, total, per_page: perPage, from, to } = pagination

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted">
        {t('admin.showing')} {from ?? 0}–{to ?? 0} {t('admin.of')} {total} · {perPage} {t('admin.perPage')}
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" disabled={current <= 1} onClick={() => onChange(current - 1)}>
          <ChevronLeft className="h-4 w-4" /> {t('admin.previous')}
        </Button>
        <span className="text-xs text-muted">{t('admin.page')} {current} / {last}</span>
        <Button size="sm" variant="outline" disabled={current >= last} onClick={() => onChange(current + 1)}>
          {t('admin.next')} <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
