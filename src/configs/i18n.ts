import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    lng: 'uz',
    fallbackLng: 'uz',
    keySeparator: false,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    resources: {
      uz: {
        translation: require('@/locales/uz.json'),
      },
      en: {
        translation: require('@/locales/en.json'),
      },
      ru: {
        translation: require('@/locales/ru.json'),
      },
    },
  })

export default i18n
