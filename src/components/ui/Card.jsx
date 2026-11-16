import { forwardRef } from 'react'
import { cn } from '@/utils/helpers'

const cardVariants = {
  base: 'relative overflow-hidden rounded-xl border border-border bg-surface transition-[border-color,box-shadow] duration-300',
  hoverable: 'hover:shadow-xl hover:border-primary/50',
  elevated: 'bg-surface shadow-lg border border-border',
  plain: 'bg-white dark:bg-surface',
}

export const Card = forwardRef(
  ({ className, variant = 'hoverable', children, hover = true, ...props }, ref) => {
    const classes = cn(
      cardVariants.base,
      hover && cardVariants.hoverable,
      variant !== 'hoverable' && cardVariants[variant],
      className
    )

    return <div ref={ref} className={classes} {...props}>{children}</div>
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 pt-6', className)} {...props}>{children}</div>
))

CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-xl font-semibold text-text', className)} {...props}>{children}</h3>
))

CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted mt-1', className)} {...props}>{children}</p>
))

CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 pb-6', className)} {...props}>{children}</div>
))

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 pb-6 pt-0', className)} {...props}>{children}</div>
))

CardFooter.displayName = 'CardFooter'

export const CardImage = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('overflow-hidden', className)} {...props}>{children}</div>
))

CardImage.displayName = 'CardImage'

export default Card
