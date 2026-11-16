import { motion } from 'framer-motion'
import { cn } from '@/utils/helpers'

export const SectionTitle = ({ eyebrow, title, subtitle, align = 'center', variant = 'default', className, size = 'lg', level = 2 }) => {
  const sizes = {
    sm: { head: 'text-2xl', sub: 'text-base' },
    md: { head: 'text-3xl', sub: 'text-lg' },
    lg: { head: 'text-4xl md:text-5xl', sub: 'text-xl' },
    xl: { head: 'text-5xl md:text-6xl', sub: 'text-2xl' },
  }[size]
  const alignMap = { left: 'text-start', center: 'text-center', right: 'text-end' }
  const Heading = level === 1 ? motion.h1 : level === 3 ? motion.h3 : motion.h2

  return (
    <div className={cn('mx-auto max-w-3xl mb-12 md:mb-16', alignMap[align], className)}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: 'easeOut', duration: 0.5 }}
          className={cn(
            'text-sm font-semibold mb-3',
            variant === 'light' ? 'text-primary' : 'text-indigo-600 dark:text-indigo-400'
          )}
        >
          {eyebrow}
        </motion.div>
      )}
      {title && (
        <Heading
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: 'easeOut', duration: 0.5, delay: 0.1 }}
          className={cn('font-semibold text-text', sizes.head)}
        >
          {title}
        </Heading>
      )}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: 'easeOut', duration: 0.5, delay: 0.2 }}
          className={cn('text-muted mt-4', sizes.sub)}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

export default SectionTitle
