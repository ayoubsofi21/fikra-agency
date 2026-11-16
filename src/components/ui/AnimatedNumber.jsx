import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { cn } from '@/utils/helpers'

export function CountUp({ to, duration = 2, suffix = '', prefix = '', className, start = 0, decimals = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-1px' })
  const [value, setValue] = useState(start)

  useEffect(() => {
    if (!isInView) return undefined
    let frame
    let startTimestamp = null
    const target = Number(to)
    const base = Number(start)

    const step = (timestamp) => {
      if (startTimestamp === null) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = base + (target - base) * eased
      setValue(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current))
      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
      // stop scheduling once complete — no idle rAF loop
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [isInView, to, duration, start, decimals])

  const display = decimals > 0
    ? value.toFixed(decimals)
    : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return (
    <span ref={ref} className={cn('font-semibold', className)}>
      {prefix}{display}{suffix}
    </span>
  )
}

export const AnimatedNumber = CountUp
