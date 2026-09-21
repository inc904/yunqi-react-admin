import { useCallback, useEffect, useState } from 'react'
import api from '@/api'
import type { ApiEnvelope } from '@/api'
import type { PageResult } from '@/types'

/** 单对象接口：只取业务信封中的 data。 */
export function useRequest<T>(url: string, params?: Record<string, unknown>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const paramsKey = JSON.stringify(params ?? {})
  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response: ApiEnvelope<T> = await api.get(url, { params })
      setData(response.data)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [url, paramsKey])
  useEffect(() => {
    void reload()
  }, [reload])
  return { data, loading, error, reload }
}

/**
 * 分页接口不可复用 useRequest：它必须保留 data 数组和 meta 分页信息。
 * 这是 BUG-001 的修复边界，防止数组被再一次解包后变成 undefined。
 */
export function usePage<T>(url: string, params: Record<string, unknown>) {
  const [data, setData] = useState<PageResult<T> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const paramsKey = JSON.stringify(params)
  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response: PageResult<T> = await api.get(url, { params })
      setData(response)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [url, paramsKey])
  useEffect(() => {
    void reload()
  }, [reload])
  return {
    data,
    loading,
    error,
    reload,
    items: data?.data ?? [],
    meta: data?.meta,
  }
}
