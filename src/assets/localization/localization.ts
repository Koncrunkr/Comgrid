import * as ruTranslation from './ru/translations.json';
import * as enTranslation from './en/translations.json';
import { Accessor, createMemo, createSignal } from 'solid-js';

export const dict: Record<string, Record<string, string>> = {
  ru: ruTranslation,
  en: enTranslation,
};

let language: () => string;
let setLanguage: (s: string) => unknown;

export const useStrings: () => [
  (key: string, defaultValue?: string) => Accessor<string>,
  () => string,
  (s: string) => unknown,
] = () => {
  if (!language) {
    [language, setLanguage] = createSignal<'ru' | 'en'>('ru');
  }

  return [
    (key: string, defaultValue?: string) => {
      return createMemo(() => {
        const result = dict[language()][key];
        return result ?? defaultValue;
      });
    },
    language,
    setLanguage,
  ];
};
