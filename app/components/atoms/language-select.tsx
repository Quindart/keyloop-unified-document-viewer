'use client';

import { useTranslation } from 'react-i18next';
import i18n, { LANGUAGE_STORAGE_KEY } from '~/i18n/i18n';
import type { AppLanguage } from '~/i18n/resources';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const languageOptions = [
  {
    language: 'vi',
    labelKey: 'language.vietnamese',
    flag: '/icons/vi.png',
  },
  {
    language: 'en',
    labelKey: 'language.english',
    flag: '/icons/en.png',
  },
] as const;

export function LanguageSelect() {
  const { t, i18n: translation } = useTranslation();
  const currentLanguage: AppLanguage =
    translation.resolvedLanguage === 'en' ? 'en' : 'vi';
  const currentOption = languageOptions.find(
    (option) => option.language === currentLanguage,
  )!;

  return (
    <div className="flex shrink-0 items-center">
      <label htmlFor="language-select" className="sr-only">
        {t('language.label')}
      </label>
      <Select
        value={currentLanguage}
        onValueChange={(value) => {
          const language = value as AppLanguage;
          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
          void i18n.changeLanguage(language);
        }}
      >
        <SelectTrigger
          id="language-select"
          className="w-[170px] gap-2 bg-background text-foreground"
        >
          <span className="flex min-w-0 items-center gap-2">
            <img
              src={currentOption.flag}
              alt=""
              className="size-5 shrink-0 rounded-full object-cover"
            />
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent align="start" className="w-[170px]">
          {languageOptions.map((option) => (
            <SelectItem key={option.language} value={option.language}>
              <span className="flex items-center gap-2">
                <img
                  src={option.flag}
                  alt=""
                  className="size-5 shrink-0 rounded-full object-cover"
                />
                <span>{t(option.labelKey)}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
