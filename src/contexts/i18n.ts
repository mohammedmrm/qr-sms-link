import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    backend: {
      loadPath: import.meta.env.VITE_BASE_URL + '/locales/{{lng}}.json?t=' + new Date().toISOString(),
    },
    ns: 'common',
    react: {
      useSuspense: true,
    },
    supportedLngs: ['en', 'it'],
    fallbackLng: 'it',
    interpolation: {
      escapeValue: true,
    },
  });
export default i18n;
