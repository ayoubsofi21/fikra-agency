import React, { useEffect } from 'react'
import { cn } from '@/utils/helpers'

export const useImageLoader = (src) => {
  const [loaded, setLoaded] = React.useState(false)

  useEffect(() => {
    if (!src) { setLoaded(true); return }
    const img = new Image()
    img.src = src
    img.onload = () => setLoaded(true)
    img.onerror = () => setLoaded(true)
    return () => { img.onload = null; img.onerror = null }
  }, [src])

  return loaded
}

export const ImageWithLoader = ({ src, alt, className, fallback = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80', children }) => {
  const [loading, setLoading] = React.useState(true)
  const [failed, setFailed] = React.useState(false)

  // Swap to the fallback when the primary source fails to load
  const resolvedSrc = failed && fallback && fallback !== src ? fallback : (src || fallback)

  return (
    <div className={cn('relative overflow-hidden bg-surfaceAlt', className)}>
      {loading && <div className="absolute inset-0 animate-pulse bg-surfaceAlt" />}
      <img
        src={resolvedSrc}
        alt={alt}
        className={cn('w-full h-full object-cover transition-opacity duration-300', loading && 'opacity-0')}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (!failed && fallback && fallback !== resolvedSrc) {
            setFailed(true)
            setLoading(true)
          } else {
            setLoading(false)
          }
       }}
      />
      {children}
    </div>
  )
}
