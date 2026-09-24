import { getStorageItem, setStorageItem } from '@/utils/storage'

export const themes = {
  orange: '热烈',
  slate: '青岩',
  forest: '森林',
  ocean: '海洋',
  sunset: '日落',
} as const

export type ThemeName = keyof typeof themes

export const preferences = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统',
} as const

export type PreferenceName = keyof typeof preferences

const themeStorageKey = 'yunqi-theme'
const modeStorageKey = 'yunqi-mode'

export const defaultTheme: ThemeName = 'orange'
export const defaultMode: PreferenceName = 'light'

/* 检查是否为有效的主题名称 */
function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && value in themes
}

/* 获取主题 */
export function getTheme(): ThemeName {
  const savedTheme = getStorageItem(themeStorageKey)
  if (isThemeName(savedTheme)) {
    return savedTheme
  }
  return defaultTheme
}

/*
 *  获取偏好模式
 */
export function getPreference(): PreferenceName {
  const savedMode = getStorageItem(modeStorageKey)
  try {
    if (typeof savedMode === 'string' && savedMode in preferences) return savedMode as PreferenceName
  } catch {
    return defaultMode
  }
  return defaultMode
}

/*
 *  解析偏好模式
 */
export function resolveMode(preference: PreferenceName): 'light' | 'dark' {
  // 切换模式时，如果用户选择了跟随系统，则根据系统的颜色模式来决定使用浅色还是深色模式
  if (preference !== 'system') return preference
  // 如果用户明确选择了正确模式，则直接返回该模式
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/* 应用主题 */
export function applyTheme(theme: ThemeName): void {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  try {
    setStorageItem(themeStorageKey, theme)
  } catch (error) {
    console.error('Failed to apply theme:', error)
  }
}

/* 应用模式 */
export function applyPreference(preference: PreferenceName): void {
  const root = document.documentElement
  root.setAttribute('data-mode', resolveMode(preference))
  try {
    setStorageItem(modeStorageKey, preference)
  } catch (error) {
    console.error('Failed to apply preference:', error)
  }
}
