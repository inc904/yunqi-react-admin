import type { Customer } from '@/types'

import { useState } from 'react'

import { FilterBar, PageTitle, Pagination, State, TagPill } from '@/components/ui'
import { usePage } from '@/hooks/useRequest'
import { date, money } from '@/lib/presentation'

import './CustomersPage.css'

export function CustomersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('')
  const list = usePage<Customer>('/customers', {
    page,
    pageSize: 10,
    ...(search ? { q: search } : {}),
    ...(level ? { level } : {}),
  })
  const names = {
    normal: '普通会员',
    silver: '白银会员',
    gold: '黄金会员',
    diamond: '钻石会员',
  }
  return (
    <>
      <PageTitle title="会员管理" description="查看会员价值，并及时发现异常或高价值用户。" />
      <section className="card">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setPage(1)
            list.reload()
          }}
        >
          <FilterBar
            onReset={() => {
              setSearch('')
              setLevel('')
            }}
          >
            <label>
              会员搜索
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="姓名或手机号" />
            </label>
            <label>
              会员等级
              <select value={level} onChange={(event) => setLevel(event.target.value)}>
                <option value="">全部等级</option>
                <option value="normal">普通会员</option>
                <option value="silver">白银会员</option>
                <option value="gold">黄金会员</option>
                <option value="diamond">钻石会员</option>
              </select>
            </label>
          </FilterBar>
        </form>
      </section>
      <section className="card table-card">
        <State loading={list.loading} error={list.error}>
          <table>
            <thead>
              <tr>
                <th>会员</th>
                <th>手机号</th>
                <th>等级</th>
                <th className="align-right">累计订单</th>
                <th className="align-right">累计消费</th>
                <th>状态</th>
                <th>注册时间</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="member">
                      <span>{item.name.slice(0, 1)}</span>
                      <b>{item.name}</b>
                    </div>
                  </td>
                  <td>{item.mobile}</td>
                  <td>
                    <span className={`level ${item.level}`}>{names[item.level]}</span>
                  </td>
                  <td className="align-right">{item.totalOrders}</td>
                  <td className="align-right money">{money(item.totalSpent)}</td>
                  <td>
                    <TagPill value={item.status} />
                  </td>
                  <td>{date(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </State>
        <Pagination meta={list.meta} page={page} setPage={setPage} />
      </section>
    </>
  )
}
