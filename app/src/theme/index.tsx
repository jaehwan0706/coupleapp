import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { palette, type ColorScheme, type Colors } from './tokens';

export * from './tokens';

type Theme = { scheme: ColorScheme; colors: Colors };

const ThemeContext = createContext<Theme>({ scheme: 'light', colors: palette.light });

// v1은 라이트 고정. 다크 모드(F-82)는 v4에서 시스템 설정을 따른다.
export function ThemeProvider({ children, followSystem = false }: { children: ReactNode; followSystem?: boolean }) {
  const system = useColorScheme();
  const scheme: ColorScheme = followSystem && system === 'dark' ? 'dark' : 'light';
  return <ThemeContext.Provider value={{ scheme, colors: palette[scheme] }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
