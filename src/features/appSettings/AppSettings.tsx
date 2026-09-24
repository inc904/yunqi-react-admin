import type { PreferenceName, ThemeName } from '@/theme/index'

import { preferences, themes } from '@/theme/index'
import useTheme from '@/theme/useTheme'

import ChildPage from './childPage'

export default function AppSettings() {
  console.log('themes', themes)
  const { theme, setTheme, preference, setPreference } = useTheme()
  return (
    <div className="app-settings">
      <h2>App Settings</h2>
      <p>Here you can configure your application settings.</p>
      <div>
        current theme:
        <select value={theme} onChange={(event) => setTheme(event.target.value as ThemeName)}>
          {Object.entries(themes).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        current preference:
        <select value={preference} onChange={(event) => setPreference(event.target.value as PreferenceName)}>
          {Object.entries(preferences).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button onClick={() => setPreference?.(preference === 'light' ? 'dark' : 'light')}>Toggle Preference</button>
      </div>
      <hr />
      <ChildPage />
    </div>
  )
}
