import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { cn, prefersReducedMotion } from '@/utils/helpers'

export const ScrollProgress = () => {
  const { scrollY } = useScroll()
  const progress = useTransform(scrollY, [0, 1000], [0, 1])
  const spring = useSpring(progress, { stiffness: 200, damping: 30 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 start-0 h-1 w-full origin-left bg-primary rtl:origin-right z-[1100]"
      style={{ scaleX: spring }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  )
}

export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export const ScrollToTop = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={cn(
        'fixed bottom-24 end-6 z-[1000] p-3 rounded-full bg-primary text-white shadow-lg shadow-indigo-500/40 hover:bg-indigo-600 transition-colors focus-visible:ring-2 focus-visible:ring-white',
        !show && 'pointer-events-none'
      )}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </motion.button>
  )
}

export const FloatingWhatsApp = ({ number = '212600000000' }) => (
  <a
    href={`https://wa.me/${number}`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 start-6 z-[1000] p-4 rounded-full bg-green-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-green-300"
    aria-label="Chat on WhatsApp"
  >
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  </a>
)

export const useScrollReveal = (options = {}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const {
    direction = 'up',
    distance = 40,
    duration = 0.6,
    delay = 0,
    ease = 'easeOut',
  } = options

  const transforms = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }

  return {
    ref,
    isVisible: isInView,
    initial: { opacity: 0, ...transforms[direction] },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: {
      duration,
      delay,
      ease: typeof ease === 'string' ? [0.16, 1, 0.3, 1] : ease,
    },
  }
}

export const FadeIn = ({ children, className, delay = 0, direction = 'up', distance = 30 }) => {
  const { ref, isVisible, initial, animate, transition } = useScrollReveal({ direction, distance, duration: 0.6, delay })

  if (prefersReducedMotion()) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <motion.div ref={ref} initial={initial} animate={isVisible ? animate : initial} transition={transition} className={className}>
      {children}
    </motion.div>
  )
}

export const StaggerContainer = ({ children, className, delay = 0.1, staggerChildren = 0.1 }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerChildren,
            delayChildren: delay,
          },
        },
     }}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
     }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollProgress
