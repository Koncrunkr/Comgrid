import { createSignal } from 'solid-js';

export type Colors = {
  background: string;
  secondaryBackground: string;
  invertedBackground: string;
  borderColor: string;
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
    borderColor: '1px solid ' + 'rgba(10, 10, 10, 0.2)',
    text: '#181819',
    invertedText: '#fff3f3',
    secondaryText: '#000',
    button: {
      text: '#FFFFFF',
      background: '#007BFF',
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
    invertedBackground: '#C6A8DA',
    background: '#07021B',
    secondaryBackground: '#1A0F49',
    borderColor: '1px solid ' + 'rgba(200, 200, 200, 0.2)',
    text: '#B6ADDD',
    invertedText: '#2F0B47',
    secondaryText: '#6D60A4',
    button: {
      text: '#B6ADDD',
      background: '#07021B',
    },
    link: {
      text: '#2D4675',
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

function themeListener(event: MediaQueryListEvent) {
  if (event.matches) {
    setTheme(ThemeType.DARK);
  } else {
    setTheme(ThemeType.LIGHT);
  }
}

function recoverThemeFromCookies<U>(
  setTheme0: (<U extends Theme>(value: (prev: Theme) => U) => U) &
    (<U extends Theme>(value: Exclude<U, Function>) => U) &
    (<U extends Theme>(value: Exclude<U, Function> | ((prev: Theme) => U)) => U),
) {
  const preferredTheme = localStorage.getItem('preferred_theme');
  if (preferredTheme === 'DARK') {
    setTheme0(DarkTheme);
  } else if (preferredTheme === 'LIGHT') {
    setTheme0(LightTheme);
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme0(DarkTheme);
    } else {
      setTheme0(LightTheme);
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', themeListener);
  }
}

export const useTheme: () => [
  () => Theme,
  (themeType: ThemeType) => unknown,
  () => unknown,
] = () => {
  if (isInitialized) {
    return [currentTheme, setTheme, changeTheme];
  }

  let [theme, setTheme0] = createSignal(LightTheme);

  recoverThemeFromCookies(setTheme0);

  setTheme = themeType => {
    setTheme0(themes[themeType]);
  };
  currentTheme = theme;
  isInitialized = true;
  return [currentTheme, setTheme, changeTheme];
};

const changeTheme = () => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .removeEventListener('change', themeListener);

  if (currentTheme().type === ThemeType.DARK) {
    localStorage.setItem('preferred_theme', 'LIGHT');
    setTheme(ThemeType.LIGHT);
  } else {
    localStorage.setItem('preferred_theme', 'DARK');
    setTheme(ThemeType.DARK);
  }
};
