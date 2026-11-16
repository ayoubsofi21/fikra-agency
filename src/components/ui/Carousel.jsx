import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/utils/helpers'

export const Carousel = ({ className, children, options, plugins = [], autoplay = false }) => {
  const autoplayPlugin = autoplay ? [Autoplay({ delay: 4000 })] : []
  const [emblaRef] = useEmblaCarousel({ loop: true, ...options }, [...autoplayPlugin, ...plugins])

  return (
    <div ref={emblaRef} className={cn('embla', className)}>
      <div className="embla__container">{children}</div>
    </div>
  )
}

export const CarouselContent = ({ className, children, ...props }) => (
  <div className={cn('embla__slides', className)} {...props}>
    {children}
  </div>
)

export const CarouselItem = ({ className, children, ...props }) => (
  <div className="embla__slide" {...props}>
    <div className={cn('px-3', className)}>{children}</div>
  </div>
)

export const CarouselNext = ({ className, ...props }) => (
  <button className={cn('embla__button embla__button--next', className)} {...props}>
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
  </button>
)

export const CarouselPrev = ({ className, ...props }) => (
  <button className={cn('embla__button embla__button--prev', className)} {...props}>
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
  </button>
)
