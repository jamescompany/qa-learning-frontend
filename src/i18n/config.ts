import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// You can use either structure:
// Option 1: Single file (original)
// import en from './locales/en';
// import ko from './locales/ko';

// Option 2: Modular files (new) - uncomment to use
import en from './locales/en/index';
import ko from './locales/ko/index';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ko: {
        translation: ko,
      },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'querystring', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false,
    },
    supportedLngs: ['en', 'ko'],
    load: 'languageOnly',
  });

export default i18n;