import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources, type AppLanguage } from './resources';

export const LANGUAGE_STORAGE_KEY = 'workspace_language';

export function getSavedLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'vi';
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en'
    ? 'en'
    : 'vi';
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
} else {
  for (const language of Object.keys(resources) as AppLanguage[]) {
    i18n.addResourceBundle(
      language,
      'translation',
      resources[language].translation,
      true,
      true,
    );
  }

  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
  if (currentLanguage) void i18n.changeLanguage(currentLanguage);
}

export default i18n;
