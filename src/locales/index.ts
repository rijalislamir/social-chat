import { createI18n } from 'vue-i18n';
import en from './en.json';
import id from './id.json';

export const LocaleLabels: { [key: string]: string } = {
  id: 'Bahasa Indonesia',
  en: 'English',
};

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') as string,
  fallbackLocale: 'en',
  messages: {
    en,
    id,
  },
});
