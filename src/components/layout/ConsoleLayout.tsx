import { Modal } from '@/components/ui'
import { navigation } from '@/constants/navigation'
import type { Auth } from '@/types'
import { Bell, ChevronDown, ChevronLeft, ChevronRight, Menu, Search, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export const hasPermission = (auth: Auth, code: string) =>
  auth.permissions.includes('*') || auth.permissions.includes(code)

/** 应用壳只关心框架与导航；具体业务内容由 App 路由作为 children 注入。 */
export function ConsoleLayout({ auth, onLogout, children }: { auth: Auth; onLogout: () => void; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  // 退出登录会清除本地凭证，属于不可逆的当前会话操作，先要求用户确认。
  const [logoutConfirming, setLogoutConfirming] = useState(false)
  const location = useLocation()
  const current = navigation.find((item) => 'to' in item && item.to === location.pathname)
  const title = current && 'label' in current ? current.label : '仪表盘'
  return (
    <div className={`shell ${collapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Zap size={19} fill="currentColor" />
          </span>
          {!collapsed && (
            <>
              <b className="brand-text">云栖商城</b>
              <span className="brand-subtext">运营台</span>
            </>
          )}
        </div>
        <nav>
          {navigation.map((item, index) =>
            'group' in item
              ? !collapsed && (
                  <div className="nav-group" key={`g${index}`}>
                    {item.group}
                  </div>
                )
              : hasPermission(auth, item.permission) && (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={19} />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                ),
          )}
        </nav>
        <button className="collapse-button" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ChevronRight size={17} />
          ) : (
            <>
              <ChevronLeft size={17} /> 收起侧边栏
            </>
          )}
        </button>
      </aside>
      <section className="main">
        <header className="topbar">
          <div className="crumb">
            <button className="icon-button mobile-menu" onClick={() => setCollapsed(!collapsed)}>
              <Menu size={20} />
            </button>
            <span>运营后台</span>
            <ChevronRight size={14} />
            <b>{title}</b>
          </div>
          <div className="top-actions">
            <div className="global-search">
              <Search size={16} />
              <input placeholder="搜索订单、商品或会员" />
            </div>
            <button className="icon-button notification">
              <Bell size={19} />
              <i />
            </button>
            <img className="avatar" src={auth.user.avatar} />
            <button className="user-menu" onClick={() => setLogoutConfirming(true)}>
              {auth.user.nickname}
              <ChevronDown size={15} />
            </button>
          </div>
        </header>
        <main className="content">{children}</main>
      </section>
      {logoutConfirming && (
        <Modal
          title="确认退出登录"
          onClose={() => setLogoutConfirming(false)}
          footer={
            <>
              <button className="secondary" onClick={() => setLogoutConfirming(false)}>
                取消
              </button>
              <button
                className="primary"
                onClick={() => {
                  setLogoutConfirming(false)
                  onLogout()
                }}
              >
                确认退出
              </button>
            </>
          }
        >
          <p className="modal-intro">退出后将清除当前登录状态，需要重新输入账号和密码才能进入运营台。</p>
        </Modal>
      )}
    </div>
  )
}
