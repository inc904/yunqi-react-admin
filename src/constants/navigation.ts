import {
  ClipboardList,
  Gift,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Users,
} from 'lucide-react'

export type Permission =
  'dashboard:view' | 'product:*' | 'order:*' | 'customer:view' | 'coupon:*' | 'banner:*' | 'system:*'
export type NavigationItem =
  | { group: string }
  | {
      to: string
      label: string
      icon: typeof LayoutDashboard
      permission: Permission
    }

/** 菜单配置集中维护，布局组件只负责按照登录权限过滤并渲染。 */
export const navigation: NavigationItem[] = [
  {
    to: '/dashboard',
    label: '仪表盘',
    icon: LayoutDashboard,
    permission: 'dashboard:view',
  },
  { group: '商品中心' },
  {
    to: '/products',
    label: '商品管理',
    icon: Package,
    permission: 'product:*',
  },
  { to: '/categories', label: '分类管理', icon: Tag, permission: 'product:*' },
  { group: '订单中心' },
  {
    to: '/orders',
    label: '订单管理',
    icon: ShoppingCart,
    permission: 'order:*',
  },
  { group: '会员中心' },
  {
    to: '/customers',
    label: '会员管理',
    icon: Users,
    permission: 'customer:view',
  },
  { group: '营销中心' },
  { to: '/coupons', label: '优惠券管理', icon: Gift, permission: 'coupon:*' },
  {
    to: '/banners',
    label: 'Banner 管理',
    icon: Megaphone,
    permission: 'banner:*',
  },
  { group: '系统设置' },
  {
    to: '/admin-users',
    label: '管理员',
    icon: Settings,
    permission: 'system:*',
  },
  {
    to: '/roles',
    label: '角色权限',
    icon: ShieldCheck,
    permission: 'system:*',
  },
  {
    to: '/logs',
    label: '操作日志',
    icon: ClipboardList,
    permission: 'system:*',
  },
]
