/**
 * Theme context: light/dark mode with system preference detection
 * Persists choice to localStorage
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { THEME } from '@/utils/theme'
import { storage } from '@/utils/helpers'

const THEME_KEY = 'fikra-theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    storage.get(THEME_KEY, 'light')
  )

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark'

    // Apply theme to body
    root.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'

    // Sync CSS variables
    Object.entries(THEME[theme]).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    // Persist
    storage.set(THEME_KEY, theme)
  }, [theme])

  // Respect system preference on first load if no explicit choice
  useEffect(() => {
    if (storage.get(THEME_KEY) === null) {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemDark) setTheme('dark')
    }
  }, [])

  const toggleTheme = () =>
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const value = {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
    colors: THEME[theme],
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context)
    throw new Error('useTheme must be used within a ThemeProvider')
  return context
}

export const useDarkMode = () => {
  const { isDark } = useTheme()
  return isDark
}

export default ThemeContext
