import { createSignal } from 'solid-js';

export type Colors = {
  background: string;
  secondaryBackground: string;
  invertedBackground: string;
  text: string;
  secondaryText: string;
  invertedText: string;
  button: {
    text: string;
    background: string;
  };
  link: {
    text: string;
    opacity: number;
  };
};

export type Fonts = {
  text: string;
};

export interface Theme {
  id: string;
  type: ThemeType;
  colors: Colors;
  fonts: Fonts;
}

export enum ThemeType {
  DARK,
  LIGHT,
}

export const LightTheme: Theme = {
  id: 'Light',
  type: ThemeType.LIGHT,
  colors: {
    invertedBackground: '#343A40',
    secondaryBackground: '#F8F9FA',
    background: '#FFFFFF',
    text: '#181819',
    invertedText: '#fff3f3',
    secondaryText: '#000',
    button: {
      text: '#FFFFFF',
      background: '#000000',
    },
    link: {
      text: 'teal',
      opacity: 1,
    },
  },
  fonts: {
    text: 'Tinos',
  },
};
export const DarkTheme: Theme = {
  id: 'T_007',
  type: ThemeType.DARK,
  colors: {
    invertedBackground: '#FFEECC',
    background: '#9be7ff',
    secondaryBackground: '#9be7ff',
    text: '#000d21',
    invertedText: '#cce5ff',
    secondaryText: '#0d47a1',
    button: {
      text: '#ffffff',
      background: '#0d47a1',
    },
    link: {
      text: '#0d47a1',
      opacity: 0.8,
    },
  },
  fonts: {
    text: 'Ubuntu',
  },
};

const themes: Record<ThemeType, Theme> = {
  [ThemeType.LIGHT]: LightTheme,
  [ThemeType.DARK]: DarkTheme,
};

let isInitialized = false;
let currentTheme: () => Theme;
let setTheme: (themeType: ThemeType) => unknown;

export const useTheme: () => [() => Theme, (themeType: ThemeType) => unknown] = () => {
  if (isInitialized) {
    return [currentTheme, setTheme];
  }

  let [theme, setTheme0] = createSignal(LightTheme);

  setTheme = themeType => {
    setTheme0(themes[themeType]);
  };
  currentTheme = theme;
  return [currentTheme, setTheme];
};
