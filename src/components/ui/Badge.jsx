import { cva } from 'class-variance-authority'
import { cn } from '@/utils/helpers'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surfaceAlt text-text border border-border',
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        accent: 'bg-accent/10 text-amber-700 dark:text-amber-400',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-amber-600 dark:text-amber-400',
        danger: 'bg-danger/10 text-danger',
        new: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        popular: 'bg-accent/15 text-amber-700 dark:text-amber-400 border border-accent/30',
        bestseller: 'bg-primary/10 text-primary',
        comingSoon: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export function Badge({ className, variant = 'default', children, icon: Icon, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {Icon && <Icon className="me-1 h-3 w-3" />}
      {children}
    </span>
  )
}

export default Badge
