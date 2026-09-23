import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import App from '@/App'

// 两类纯样式基础组件由入口统一加载，业务页面可以直接复用其 className。
import '@/components/ui/Button/Button.css'
import '@/components/ui/Card/Card.css'
import '@/components/ui/TableFrame/TableFrame.css'
import '@/styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
