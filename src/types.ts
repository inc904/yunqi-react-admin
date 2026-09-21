/**
 * 这份文件是页面层依赖的数据契约。字段与 mock-api/types/index.ts 保持一致，
 * 让组件在编译阶段就能发现接口字段名或状态值不匹配的问题。
 */
export type ProductStatus = 'draft' | 'on_sale' | 'off_sale'
export type OrderStatus =
  'pending_payment' | 'paid' | 'pending_shipment' | 'shipped' | 'completed' | 'cancelled' | 'refunding' | 'refunded'
export type UserStatus = 'active' | 'disabled'
/** 跨功能共享的认证信息；放在 types 层，避免布局组件反向依赖 auth 功能模块。 */
export type Auth = { token: string; user: AdminUser; permissions: string[] }
/** 列表接口的固定形状：数组与分页信息必须同时保留。 */
export type PageResult<T> = {
  data: T[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
}
export type Product = {
  id: string
  name: string
  subtitle: string
  categoryId: string
  brand: string
  cover: string
  images: string[]
  price: number
  originalPrice: number
  stock: number
  sales: number
  status: ProductStatus
  skus: {
    id: string
    name: string
    specs: Record<string, string>
    price: number
    stock: number
    sales: number
  }[]
  createdAt: string
  updatedAt: string
}
export type Order = {
  id: string
  orderNo: string
  customerName: string
  items: {
    name: string
    image: string
    specs: string
    price: number
    quantity: number
  }[]
  amount: number
  discountAmount: number
  freightAmount: number
  payableAmount: number
  status: OrderStatus
  paymentMethod: string | null
  createdAt: string
  paidAt: string | null
  shippedAt: string | null
  receiver: {
    name: string
    mobile: string
    province: string
    city: string
    district: string
    address: string
  }
  logistics: { company: string; trackingNo: string } | null
}
export type Category = {
  id: string
  name: string
  parentId: string | null
  sort: number
  status: UserStatus
  productCount: number
}
export type Customer = {
  id: string
  name: string
  mobile: string
  level: 'normal' | 'silver' | 'gold' | 'diamond'
  status: UserStatus
  totalOrders: number
  totalSpent: number
  createdAt: string
}
export type Coupon = {
  id: string
  name: string
  type: 'amount' | 'discount'
  value: number
  minAmount: number
  total: number
  claimed: number
  used: number
  status: 'scheduled' | 'active' | 'ended'
  startAt: string
  endAt: string
}
export type Banner = {
  id: string
  title: string
  image: string
  link: string
  sort: number
  status: UserStatus
  startAt: string
  endAt: string
}
export type AdminUser = {
  id: string
  username: string
  nickname: string
  roleIds: string[]
  avatar: string
  status: UserStatus
  lastLoginAt: string | null
  createdAt: string
}
export type Role = {
  id: string
  name: string
  code: string
  description: string
  permissions: string[]
  createdAt: string
}
export type Log = {
  id: string
  adminName: string
  module: string
  action: string
  detail: string
  ip: string
  createdAt: string
}
export type Overview = {
  today: {
    gmv: number
    paidOrders: number
    newCustomers: number
    conversionRate: number
  }
  changes: {
    gmv: number
    paidOrders: number
    newCustomers: number
    conversionRate: number
  }
  pending: {
    pendingShipment: number
    refunding: number
    lowStock: number
    customerMessages: number
  }
  topProducts: Pick<Product, 'id' | 'name' | 'cover' | 'sales' | 'price'>[]
}
export type Trend = {
  date: string
  gmv: number
  orders: number
  customers: number
}
