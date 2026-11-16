import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
}

export const defaultNS = 'translation'

/**
 * Read persisted language, tolerating both JSON (`"fr"`) and legacy raw (`fr`) values
 */
const readStoredLanguage = () => {
  const raw = localStorage.getItem('fikra-language')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return ['en', 'fr', 'ar'].includes(parsed) ? parsed : null
  } catch {
    return ['en', 'fr', 'ar'].includes(raw) ? raw : null
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLanguage() || 'en',
  fallbackLng: 'en',
  ns: ['translation'],
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
  react: {
    useSuspense: false,
  },
})

export const RTL_LANGS = ['ar']

export const setLanguage = (lng) => {
  try {
    localStorage.setItem('fikra-language', JSON.stringify(lng))
  } catch {
    /* storage unavailable */
  }
  document.documentElement.lang = lng
  document.documentElement.dir = RTL_LANGS.includes(lng) ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('data-lang', lng)
}

export const isRTL = (lng = i18n.language) => RTL_LANGS.includes(lng)

export default i18n
