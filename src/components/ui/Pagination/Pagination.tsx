import type { PageResult } from '@/types'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import './Pagination.css'

export function Pagination({
  meta,
  page,
  setPage,
}: {
  meta?: PageResult<unknown>['meta']
  page: number
  setPage: (page: number) => void
}) {
  if (!meta) return null
  return (
    <div className="pagination">
      <span>共 {meta.total} 条</span>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        <ChevronLeft size={16} />
      </button>
      <b>{page}</b>
      <span>/ {meta.totalPages}</span>
      <button disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
