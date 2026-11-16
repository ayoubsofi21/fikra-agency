import { cva } from 'class-variance-authority'
import { cn } from '@/utils/helpers'

const sectionVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      light: 'bg-background',
      surface: 'bg-surface',
      alt: 'bg-surfaceAlt',
      dark: 'bg-[#0B1020]',
      gradient: 'bg-indigo-950 text-white',
    },
    spacing: {
      compact: 'py-12 md:py-16',
      default: 'py-16 md:py-20',
      large: 'py-20 md:py-28',
      hero: 'py-28 md:py-36 lg:py-44',
      massive: 'py-28 md:py-40',
    },
  },
  defaultVariants: {
    variant: 'default',
    spacing: 'default',
  },
})

export const Section = ({ className, variant = 'default', spacing = 'default', children, ...props }) => (
  <section className={cn(sectionVariants({ variant, spacing }), className)} {...props}>
    {children}
  </section>
)

export const Container = ({ className, children, size = 'lg', ...props }) => {
  const sizes = {
    sm: 'max-w-screen-sm px-4',
    md: 'max-w-screen-md px-4',
    lg: 'max-w-screen-xl px-4',
    xl: 'max-w-[1600px] px-4',
    full: 'px-4',
  }
  return (
    <div className={cn('mx-auto w-full', sizes[size], className)} {...props}>{children}</div>
  )
}

export const Flex = ({ className, children, direction = 'row', gap = 'gap-4', align = 'items-center', justify = 'justify-between', wrap = '', ...props }) => (
  <div className={cn('flex flex-col', `flex-${direction === 'column' ? 'col' : direction}`, wrap, `${align}`, `${justify}`, gap, className)} {...props}>
    {children}
  </div>
)

export default Section
