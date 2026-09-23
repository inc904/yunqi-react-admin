import type { Category } from '@/types'

import { ChevronRight, Plus } from 'lucide-react'

import { PageTitle, State, TagPill } from '@/components/ui'
import { usePage } from '@/hooks/useRequest'

import './CategoriesPage.css'

export function CategoriesPage() {
  const list = usePage<Category>('/categories', {
    page: 1,
    pageSize: 50,
    _sort: 'sort',
    _order: 'asc',
  })
  return (
    <>
      <PageTitle
        title="分类管理"
        description="以树形层级组织商品分类，并维护前台展示顺序。"
        action={
          <button className="primary">
            <Plus size={16} />
            新建分类
          </button>
        }
      />
      <section className="split-layout">
        <aside className="card category-tree">
          <h3>商品分类</h3>
          <State loading={list.loading} error={list.error}>
            {list.items.map((item) => (
              <button className="tree-item" key={item.id}>
                <ChevronRight size={14} />
                <span>{item.name}</span>
                <small>{item.productCount}</small>
              </button>
            ))}
          </State>
        </aside>
        <section className="card table-card">
          <div className="card-head">
            <div>
              <h3>全部分类</h3>
              <p>可按排序字段调整前台展示优先级</p>
            </div>
          </div>
          <State loading={list.loading} error={list.error}>
            <table>
              <thead>
                <tr>
                  <th>分类名称</th>
                  <th>商品数</th>
                  <th>排序</th>
                  <th>状态</th>
                  <th className="operations">操作</th>
                </tr>
              </thead>
              <tbody>
                {list.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <b>{item.name}</b>
                    </td>
                    <td>{item.productCount}</td>
                    <td>{item.sort}</td>
                    <td>
                      <TagPill value={item.status} />
                    </td>
                    <td className="operations">
                      <button className="link-button">编辑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </State>
        </section>
      </section>
    </>
  )
}
