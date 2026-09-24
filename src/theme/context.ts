import type { PreferenceName, ThemeName } from './index'

import { createContext } from 'react'

export interface ThemeContextValue {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  preference: PreferenceName
  setPreference: (mode: PreferenceName) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
