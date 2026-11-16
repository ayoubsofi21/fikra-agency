/**
 * Language context: English, French, Arabic with RTL support
 * Persists choice to localStorage
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/constants'
import { storage } from '@/utils/helpers'
import { setLanguage, isRTL } from '@/i18n/config'

const LANG_KEY = 'fikra-language'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() =>
    storage.get(LANG_KEY, DEFAULT_LANGUAGE)
  )

  const { i18n } = useTranslation()

  useEffect(() => {
    const newLang = i18n.language
    setLangState(newLang)
  }, [i18n.language])

  useEffect(() => {
    setLanguage(lang)
  }, [lang])

  const changeLanguage = (newLang) => {
    if (newLang === lang) return
    i18n.changeLanguage(newLang)
    storage.set(LANG_KEY, newLang)
    setLanguage(newLang)
  }

  const value = {
    lang,
    languages: LANGUAGES,
    isRTL: isRTL(lang),
    dir: isRTL(lang) ? 'rtl' : 'ltr',
    changeLanguage,
    t: i18n.t,
  }

  return (
    <LangContext.Provider value={value}>{children}</LangContext.Provider>
  )
}

export const useLang = () => {
  const context = useContext(LangContext)
  if (!context)
    throw new Error('useLang must be used within a LangProvider')
  return context
}

export default LangContext
