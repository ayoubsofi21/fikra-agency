import { forwardRef, useId } from 'react'
import { cn } from '@/utils/helpers'

const inputVariants = {
  base: 'w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-base text-text placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed',
  withIcon: 'ps-11',
}

const useFieldIds = (propsId) => {
  const autoId = useId()
  const id = propsId || autoId
  return { id, descId: `${id}-desc` }
}

const FieldMessage = ({ id, error, helperText }) => {
  const errorText = typeof error === 'string' ? error : null
  if (!errorText && !helperText) return null
  return (
    <p
      id={id}
      role={errorText ? 'alert' : undefined}
      className={cn('mt-1.5 text-sm', errorText ? 'text-danger' : 'text-muted')}
    >
      {errorText || helperText}
    </p>
  )
}

export const Input = forwardRef(
  (
    { className, icon: Icon, error, helperText, ...props },
    ref
  ) => {
    const { id, descId } = useFieldIds(props.id)
    const hasMessage = Boolean(typeof error === 'string' ? error : helperText)

    return (
      <div className={cn('relative', className)}>
        {Icon && (
          <Icon className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" aria-hidden="true" />
        )}
        <input
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? descId : undefined}
          {...props}
          id={id}
          className={cn(
            inputVariants.base,
            Icon && inputVariants.withIcon,
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
        />
        {hasMessage && <FieldMessage id={descId} error={error} helperText={helperText} />}
      </div>
    )
  }
)

Input.displayName = 'Input'

export const Textarea = forwardRef(
  ({ className, error, helperText, rows = 4, ...props }, ref) => {
    const { id, descId } = useFieldIds(props.id)
    const hasMessage = Boolean(typeof error === 'string' ? error : helperText)

    return (
      <div className="relative">
        <textarea
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? descId : undefined}
          {...props}
          id={id}
          className={cn(
            inputVariants.base,
            'min-h-[120px] resize-y',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
          rows={rows}
        />
        {hasMessage && <FieldMessage id={descId} error={error} helperText={helperText} />}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export const Select = forwardRef(
  ({ className, icon: Icon, children, error, helperText, ...props }, ref) => {
    const { id, descId } = useFieldIds(props.id)
    const hasMessage = Boolean(typeof error === 'string' ? error : helperText)

    return (
      <div className={cn('relative', className)}>
        {Icon && (
          <Icon className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" aria-hidden="true" />
        )}
        <select
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? descId : undefined}
          {...props}
          id={id}
          className={cn(
            inputVariants.base,
            Icon && inputVariants.withIcon,
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
        >
          {children}
        </select>
        {hasMessage && <FieldMessage id={descId} error={error} helperText={helperText} />}
      </div>
    )
  }
)

Select.displayName = 'Select'

export const Label = forwardRef(({ className, htmlFor, required, ...props }, ref) => (
  <label
    ref={ref}
    htmlFor={htmlFor}
    className={cn(
      'block text-sm font-medium text-text mb-1.5',
      required && 'after:content-["*"] after:ms-0.5 after:text-danger',
      className
    )}
    {...props}
  />
))

Label.displayName = 'Label'

export default Input
