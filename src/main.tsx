import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import App from '@/App'
import { applyPreference, applyTheme, getPreference, getTheme } from '@/theme'
import ThemeProvider from '@/theme/ThemeProvider'

// 全局样式与主题统一由 styles.css 加载。
import '@/styles.css'

applyTheme(getTheme())
applyPreference(getPreference())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
