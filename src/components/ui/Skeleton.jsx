import { cn } from '@/utils/helpers'

export const Skeleton = ({ className, variant = 'rect', ...props }) => {
  const variants = {
    rect: 'animate-pulse rounded-lg bg-surfaceAlt',
    circle: 'animate-pulse rounded-full bg-surfaceAlt',
    text: 'animate-pulse rounded bg-surfaceAlt',
  }

  return <div className={cn(variants[variant], className)} {...props} />
}

export const Shimmer = ({ className }) => (
  <div className={cn('relative overflow-hidden bg-surface/50', className)}>
    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5" />
  </div>
)

export const FadeIn = ({ children, className, delay = 0 }) => (
  <div className={cn('animate-fade-in', className)} style={{ animationDelay: `${delay}ms` }}>
    {children}
  </div>
)

export default Skeleton
