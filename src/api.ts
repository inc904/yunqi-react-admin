import axios from 'axios'

/**
 * 后端约定：不论单条数据还是列表，业务内容都位于 data 字段。
 * 列表场景会额外携带 meta 分页信息。保留这层信封，而非在拦截器中
 * 直接返回 data，可以让“单对象”和“分页列表”在调用处被明确区分。
 */
export type ApiEnvelope<T> = {
  data: T
  meta?: { page: number; pageSize: number; total: number; totalPages: number }
}

// Axios 实例只负责 HTTP 层的公共约定；页面不需要重复写基础地址和超时配置。
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api',
  timeout: 8000,
})
api.interceptors.request.use((config) => {
  // token 只在登录成功后保存。每一次受保护的请求都会自动带上它。
  const token = localStorage.getItem('yunqi-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use(
  // 这里只剥离 AxiosResponse，保留 Mock API 的 { data, meta } 业务信封。
  (response) => response.data,
  // 将不同 HTTP 状态统一为页面可以直接展示的 Error.message。
  (error) => Promise.reject(new Error(error.response?.data?.error?.message || error.message || '请求失败')),
)
export default api
