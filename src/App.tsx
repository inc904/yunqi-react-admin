import type { Auth } from '@/types'

import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'

import api, { AUTH_EXPIRED_EVENT, clearAuthStorage } from '@/api'
import { NotFoundPage } from '@/app/NotFoundPage'
import { ConsoleLayout, hasPermission } from '@/components/layout/ConsoleLayout'
import { Login } from '@/features/auth/Login'
import { CategoriesPage } from '@/features/catalog/CategoriesPage'
import { CustomersPage } from '@/features/customers/CustomersPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { BannersPage, CouponsPage } from '@/features/marketing/MarketingPages'
import { OrdersPage } from '@/features/orders/OrdersPage'
import { ProductsPage } from '@/features/products/ProductsPage'
import { AdminUsersPage, LogsPage, RolesPage } from '@/features/system/SystemPages'

/**
 * 根组件只做两件事：恢复登录态、声明路由。具体业务页面全部放在 features 下，
 * 应用壳与通用组件不再和具体商品/订单逻辑耦合。
 */
export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [auth, setAuth] = useState<Auth | null>(() => {
    const raw = localStorage.getItem('yunqi-auth')
    return raw ? JSON.parse(raw) : null
  })
  const [returnTo, setReturnTo] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthExpired = () => {
      // 保存完整地址，重新登录后可以回到令牌失效前的页面和筛选状态。
      setReturnTo(`${location.pathname}${location.search}${location.hash}`)
      setAuth(null)
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
  }, [location.pathname, location.search, location.hash])

  const currentPath = `${location.pathname}${location.search}${location.hash}`
  const redirectFromLogin = new URLSearchParams(location.search).get('redirect')
  const destination = returnTo || (redirectFromLogin?.startsWith('/') ? redirectFromLogin : null) || '/dashboard'

  if (!auth) {
    if (location.pathname !== '/login') {
      return <Navigate to={`/login?redirect=${encodeURIComponent(returnTo || currentPath)}`} replace />
    }
    return (
      <Login
        onLogin={(nextAuth) => {
          setAuth(nextAuth)
          setReturnTo(null)
          navigate(destination, { replace: true })
        }}
      />
    )
  }

  // 已登录时访问登录页没有意义，避免浏览器后退再次停留在登录表单。
  if (location.pathname === '/login') return <Navigate to="/dashboard" replace />

  return (
    <ConsoleLayout
      auth={auth}
      onLogout={async () => {
        try {
          // 服务端会把当前 Token 加入注销列表，避免它在退出后继续访问受保护接口。
          await api.post('/auth/logout')
        } catch {
          // 网络异常或 Token 已失效时仍然完成本地退出，避免用户被困在登录态。
        } finally {
          clearAuthStorage()
          setAuth(null)
        }
      }}
    >
      <Routes>
        {/* 根路径是业务入口，不应该吞掉所有未知 URL。 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage canEdit={hasPermission(auth, 'product:*')} />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/orders" element={<OrdersPage canEdit={hasPermission(auth, 'order:*')} />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/banners" element={<BannersPage />} />
        <Route path="/admin-users" element={<AdminUsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/logs" element={<LogsPage />} />
        {/* 只匹配未定义的前端路径，保留用户发现问题与返回的机会。 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ConsoleLayout>
  )
}
