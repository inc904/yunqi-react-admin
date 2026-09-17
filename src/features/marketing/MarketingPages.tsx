import { Plus } from "lucide-react";
import "./MarketingPages.css";
import { PageTitle, State, TagPill } from "@/components/ui";
import { usePage } from "@/hooks/useRequest";
import { date } from "@/lib/presentation";
import type { Banner, Coupon } from "@/types";

export function CouponsPage() {
  const list = usePage<Coupon>("/coupons", {
    page: 1,
    pageSize: 20,
    _sort: "startAt",
    _order: "desc",
  });
  return (
    <>
      <PageTitle
        title="优惠券管理"
        description="配置优惠门槛、发放数量与活动周期。"
        action={
          <button className="primary">
            <Plus size={16} />
            新建优惠券
          </button>
        }
      />
      <section className="card table-card">
        <State loading={list.loading} error={list.error}>
          <table>
            <thead>
              <tr>
                <th>优惠券名称</th>
                <th>优惠规则</th>
                <th>领取 / 使用</th>
                <th>有效期</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((coupon) => (
                <tr key={coupon.id}>
                  <td>
                    <b>{coupon.name}</b>
                  </td>
                  <td>
                    {coupon.type === "amount"
                      ? `满 ${coupon.minAmount} 减 ${coupon.value}`
                      : `${coupon.value} 折`}
                  </td>
                  <td>
                    <div className="progress-label">
                      <span>
                        {coupon.claimed} / {coupon.total}
                      </span>
                      <small>已使用 {coupon.used}</small>
                    </div>
                    <div className="progress">
                      <i
                        style={{
                          width: `${(coupon.claimed / coupon.total) * 100}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    {date(coupon.startAt).split(" ")[0]} 至<br />
                    {date(coupon.endAt).split(" ")[0]}
                  </td>
                  <td>
                    <TagPill value={coupon.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </State>
      </section>
    </>
  );
}
export function BannersPage() {
  const list = usePage<Banner>("/banners", {
    page: 1,
    pageSize: 20,
    _sort: "sort",
    _order: "asc",
  });
  return (
    <>
      <PageTitle
        title="Banner 管理"
        description="维护商城首页的焦点图与跳转链接。"
        action={
          <button className="primary">
            <Plus size={16} />
            新建 Banner
          </button>
        }
      />
      <div className="banner-grid">
        <State loading={list.loading} error={list.error}>
          {list.items.map((item) => (
            <section className="card banner-card" key={item.id}>
              <img src={item.image} />
              <div>
                <div>
                  <TagPill value={item.status} />
                  <h3>{item.title}</h3>
                  <p>跳转至：{item.link}</p>
                </div>
                <div className="banner-meta">
                  <span>排序 {item.sort}</span>
                  <span>
                    {date(item.startAt).split(" ")[0]} —{" "}
                    {date(item.endAt).split(" ")[0]}
                  </span>
                  <button className="link-button">编辑</button>
                </div>
              </div>
            </section>
          ))}
        </State>
      </div>
    </>
  );
}
