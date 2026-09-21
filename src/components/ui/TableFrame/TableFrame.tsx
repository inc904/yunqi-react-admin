import type { HTMLAttributes } from 'react'
import './TableFrame.css'

/**
 * 数据表格的外框约定。它不绑定列和数据，业务页只负责 table 内容、状态与分页。
 */
export function TableFrame({ className = '', ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`card table-card ${className}`.trim()} {...props} />
}
