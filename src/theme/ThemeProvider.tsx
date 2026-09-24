import type { PreferenceName, ThemeName } from './index'

import { useEffect, useState } from 'react'

import { ThemeContext } from './context'
import { applyPreference, applyTheme, getPreference, getTheme } from './index'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(getTheme())
  const [preference, setPreference] = useState<PreferenceName>(getPreference())

  const updateTheme = (newTheme: ThemeName) => {
    setTheme(newTheme)
  }

  const updatePreference = (newPreference: PreferenceName) => {
    setPreference(newPreference)
  }

  useEffect(() => {
    applyTheme(theme)
    applyPreference(preference)
  }, [theme, preference])

  useEffect(() => {
    if (preference !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const updateMode = () => applyPreference('system')
    media.addEventListener('change', updateMode)
    return () => media.removeEventListener('change', updateMode)
  }, [preference])

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, preference, setPreference: updatePreference }}>
      {children}
    </ThemeContext.Provider>
  )
}
