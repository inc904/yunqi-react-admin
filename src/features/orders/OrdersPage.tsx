import { useState } from 'react'
import './OrdersPage.css'
import type { FormEvent } from 'react'
import { ExternalLink, Send } from 'lucide-react'
import api from '@/api'
import { usePage } from '@/hooks/useRequest'
import { date, money, statusText } from '@/lib/presentation'
import { Drawer, Empty, FilterBar, Modal, PageTitle, Pagination, State, TagPill, Toast } from '@/components/ui'
import type { Order, OrderStatus } from '@/types'

const orderTabs: { label: string; status: '' | OrderStatus }[] = [
  { label: '全部', status: '' },
  { label: '待付款', status: 'pending_payment' },
  { label: '待发货', status: 'pending_shipment' },
  { label: '已发货', status: 'shipped' },
  { label: '已完成', status: 'completed' },
  { label: '退款/售后', status: 'refunding' },
]

/** 订单的“发货”使用领域接口而不是 PATCH status，让服务端执行状态校验和写日志。 */
export function OrdersPage({ canEdit }: { canEdit: boolean }) {
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState<'' | OrderStatus>('')
  const [keyword, setKeyword] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  const [shipping, setShipping] = useState<Order | null>(null)
  const [message, setMessage] = useState('')
  const list = usePage<Order>('/orders', {
    page,
    pageSize: 8,
    _sort: 'createdAt',
    _order: 'desc',
    ...(tab ? { status: tab } : {}),
    ...(keyword ? { orderNo_like: keyword } : {}),
  })
  return (
    <>
      <PageTitle title="订单管理" description="集中处理订单履约、物流与售后状态。" />
      {message && <Toast message={message} onClose={() => setMessage('')} />}
      <section className="card tabs-card">
        <div className="tabs">
          {orderTabs.map((item) => (
            <button
              className={tab === item.status ? 'active' : ''}
              key={item.label}
              onClick={() => {
                setTab(item.status)
                setPage(1)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setPage(1)
            list.reload()
          }}
        >
          <FilterBar
            onReset={() => {
              setKeyword('')
              setTab('')
            }}
          >
            <label>
              订单号
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索订单号" />
            </label>
          </FilterBar>
        </form>
      </section>
      <section className="card table-card order-table">
        <State loading={list.loading} error={list.error}>
          {list.items.length ? (
            <table>
              <thead>
                <tr>
                  <th>订单信息</th>
                  <th>商品</th>
                  <th>买家</th>
                  <th className="align-right">实付金额</th>
                  <th>支付方式</th>
                  <th>订单状态</th>
                  <th className="operations">操作</th>
                </tr>
              </thead>
              <tbody>
                {list.items.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <b>{order.orderNo}</b>
                      <small>{date(order.createdAt)}</small>
                    </td>
                    <td>
                      <div className="order-product">
                        <img src={order.items[0]?.image} />
                        <div>
                          <b>{order.items[0]?.name}</b>
                          <small>
                            {order.items[0]?.specs} × {order.items[0]?.quantity}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{order.customerName}</td>
                    <td className="align-right money">{money(order.payableAmount)}</td>
                    <td>
                      {order.paymentMethod === 'wechat'
                        ? '微信支付'
                        : order.paymentMethod === 'alipay'
                          ? '支付宝'
                          : '—'}
                    </td>
                    <td>
                      <TagPill value={order.status} />
                    </td>
                    <td className="operations">
                      <button className="link-button" onClick={() => setSelected(order)}>
                        详情
                      </button>
                      {canEdit && ['paid', 'pending_shipment'].includes(order.status) && (
                        <button className="link-button" onClick={() => setShipping(order)}>
                          发货
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty />
          )}
        </State>
        <Pagination meta={list.meta} page={page} setPage={setPage} />
      </section>
      {selected && <OrderDrawer order={selected} onClose={() => setSelected(null)} />}
      {shipping && (
        <ShipDialog
          order={shipping}
          onClose={() => setShipping(null)}
          onDone={() => {
            setShipping(null)
            setMessage('订单已发货，物流信息已更新')
            list.reload()
          }}
        />
      )}
    </>
  )
}

function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <Drawer title="订单详情" onClose={onClose}>
      <div className="order-detail">
        <section className="timeline">
          <h4>订单进度</h4>
          <div>
            <i className="timeline-dot done" />
            <b>订单创建</b>
            <span>{date(order.createdAt)}</span>
          </div>
          {order.paidAt && (
            <div>
              <i className="timeline-dot done" />
              <b>支付成功</b>
              <span>{date(order.paidAt)}</span>
            </div>
          )}
          {order.shippedAt && (
            <div>
              <i className="timeline-dot done" />
              <b>商品已发货</b>
              <span>{date(order.shippedAt)}</span>
            </div>
          )}
          <div>
            <i className="timeline-dot" />
            <b>{statusText[order.status]}</b>
            <span>订单处理中</span>
          </div>
        </section>
        <section className="detail-section">
          <h4>收货信息</h4>
          <p>
            <b>{order.receiver.name}</b>　{order.receiver.mobile}
          </p>
          <p>
            {order.receiver.province}
            {order.receiver.city}
            {order.receiver.district}
            {order.receiver.address}
          </p>
        </section>
        <section className="detail-section">
          <h4>商品清单</h4>
          {order.items.map((item) => (
            <div className="detail-product" key={`${item.name}-${item.specs}`}>
              <img src={item.image} />
              <div>
                <b>{item.name}</b>
                <small>
                  {item.specs}　× {item.quantity}
                </small>
              </div>
              <span>{money(item.price)}</span>
            </div>
          ))}
        </section>
        <section className="detail-section totals">
          <p>
            <span>商品金额</span>
            {money(order.amount)}
          </p>
          <p>
            <span>优惠金额</span>-{money(order.discountAmount)}
          </p>
          <p>
            <span>运费</span>
            {money(order.freightAmount)}
          </p>
          <p className="total">
            <span>实付金额</span>
            {money(order.payableAmount)}
          </p>
        </section>
        {order.logistics && (
          <section className="logistics">
            <Send size={18} />
            <div>
              <b>{order.logistics.company}</b>
              <span>{order.logistics.trackingNo}</span>
            </div>
            <ExternalLink size={16} />
          </section>
        )}
      </div>
    </Drawer>
  )
}
function ShipDialog({ order, onClose, onDone }: { order: Order; onClose: () => void; onDone: () => void }) {
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setLoading(true)
    try {
      await api.post(`/orders/${order.id}/ship`, {
        company: form.get('company'),
        trackingNo: form.get('trackingNo'),
      })
      onDone()
    } catch (error) {
      alert(error instanceof Error ? error.message : '发货失败')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal
      title="订单发货"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary" onClick={onClose}>
            取消
          </button>
          <button className="primary" disabled={loading} form="ship-order-form" type="submit">
            {loading ? '提交中…' : '确认发货'}
          </button>
        </>
      }
    >
      <p className="modal-intro">
        订单 <b>{order.orderNo}</b> 将更新为“已发货”。
      </p>
      <form className="dialog-form" id="ship-order-form" onSubmit={submit}>
        <label>
          物流公司
          <select name="company" defaultValue="顺丰速运">
            <option>顺丰速运</option>
            <option>京东物流</option>
            <option>中通快递</option>
          </select>
        </label>
        <label>
          物流单号
          <input name="trackingNo" required placeholder="请输入物流单号" />
        </label>
      </form>
    </Modal>
  )
}
