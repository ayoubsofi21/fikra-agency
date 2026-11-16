import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))

/**
 * Local storage helpers with safe parsing.
 * Tolerates legacy raw values (e.g. `fr`) written before JSON encoding.
 */
export const storage = {
  get(key, defaultValue) {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      try {
        return JSON.parse(item)
      } catch {
        return item
      }
    } catch {
      return defaultValue
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },
}

/**
 * Reduce-motion check
 */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Sleep / delay (for mock API)
 */
export function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
