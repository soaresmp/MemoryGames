import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ptBR from './locales/pt-BR.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

export const SUPPORTED_LANGUAGES = ['en', 'pt-BR', 'es', 'fr'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_LABEL: Record<Language, string> = {
  en: 'English',
  'pt-BR': 'Português (Brasil)',
  es: 'Español',
  fr: 'Français',
}

/** Locale tag used for Intl date formatting per language. */
export const DATE_LOCALE: Record<Language, string> = {
  en: 'en-US',
  'pt-BR': 'pt-BR',
  es: 'es-ES',
  fr: 'fr-FR',
}

/** Southern-hemisphere languages need the season question flipped. */
export const SOUTHERN_HEMISPHERE: Record<Language, boolean> = {
  en: false,
  'pt-BR': true,
  es: false,
  fr: false,
}

export function detectSupportedLanguage(): Language {
  const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en'
  const match = SUPPORTED_LANGUAGES.find(
    (lang) => browserLang.toLowerCase() === lang.toLowerCase() || browserLang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()),
  )
  return match ?? 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'pt-BR': { translation: ptBR },
    es: { translation: es },
    fr: { translation: fr },
  },
  lng: detectSupportedLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
