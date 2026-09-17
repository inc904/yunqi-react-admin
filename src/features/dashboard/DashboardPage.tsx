import { useState } from "react";
import "./DashboardPage.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronRight } from "lucide-react";
import { useRequest } from "@/hooks/useRequest";
import { money, shortDate } from "@/lib/presentation";
import { PageTitle, State } from "@/components/ui";
import type { Overview, Trend } from "@/types";

/** 仪表盘将概览、待办、趋势拆为同一功能域，所有数据通过单对象 Hook 获取。 */
export function DashboardPage() {
  const [days, setDays] = useState(14);
  const overview = useRequest<Overview>("/dashboard/overview");
  const trend = useRequest<Trend[]>("/dashboard/sales-trend", { days });
  const navigate = useNavigate();
  const metric = overview.data && [
    {
      label: "今日 GMV",
      value: money(overview.data.today.gmv),
      change: overview.data.changes.gmv,
      icon: "¥",
      tone: "blue",
    },
    {
      label: "支付订单",
      value: overview.data.today.paidOrders,
      change: overview.data.changes.paidOrders,
      icon: "▣",
      tone: "violet",
    },
    {
      label: "新增会员",
      value: overview.data.today.newCustomers,
      change: overview.data.changes.newCustomers,
      icon: "♙",
      tone: "orange",
    },
    {
      label: "支付转化率",
      value: `${overview.data.today.conversionRate}%`,
      change: overview.data.changes.conversionRate,
      icon: "%",
      tone: "green",
    },
  ];
  return (
    <>
      <PageTitle
        title="早上好，运营同学"
        description="今天是业务冲刺的好日子，先看看关键数据。"
      />
      <State loading={overview.loading} error={overview.error}>
        {metric && (
          <div className="metrics">
            {metric.map((item) => (
              <div className="metric-card" key={item.label}>
                <span className={`metric-icon ${item.tone}`}>{item.icon}</span>
                <div>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                  <em className={item.change >= 0 ? "up" : "down"}>
                    {item.change >= 0 ? "↑" : "↓"} {Math.abs(item.change)}%
                    较昨日
                  </em>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="pending-grid">
          {overview.data &&
            [
              {
                label: "待发货订单",
                count: overview.data.pending.pendingShipment,
                hint: "请尽快安排发货",
                to: "/orders",
              },
              {
                label: "退款处理中",
                count: overview.data.pending.refunding,
                hint: "关注客户售后诉求",
                to: "/orders",
              },
              {
                label: "库存预警商品",
                count: overview.data.pending.lowStock,
                hint: "库存低于 20 件",
                to: "/products",
              },
              {
                label: "待回复消息",
                count: overview.data.pending.customerMessages,
                hint: "来自客服工作台",
                to: "/customers",
              },
            ].map((item) => (
              <button
                className="pending-card"
                onClick={() => navigate(item.to)}
                key={item.label}
              >
                <span>{item.label}</span>
                <b>{item.count}</b>
                <small>
                  {item.hint}
                  <ChevronRight size={14} />
                </small>
              </button>
            ))}
        </div>
      </State>
      <div className="dashboard-grid">
        <section className="card trend-card">
          <div className="card-head">
            <div>
              <h3>经营趋势</h3>
              <p>GMV 与支付订单的每日变化</p>
            </div>
            <div className="segmented">
              {[7, 14, 30].map((value) => (
                <button
                  key={value}
                  className={days === value ? "selected" : ""}
                  onClick={() => setDays(value)}
                >
                  {value} 天
                </button>
              ))}
            </div>
          </div>
          <State loading={trend.loading} error={trend.error}>
            {trend.data && (
              <div className="chart">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trend.data}>
                    <defs>
                      <linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity={0.24}
                        />
                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#eef1f6" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={shortDate}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value / 1000}k`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) => money(value)}
                      labelFormatter={(value) => `日期：${value}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="gmv"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fill="url(#gmv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </State>
        </section>
        <section className="card top-products">
          <div className="card-head">
            <div>
              <h3>热销商品 Top 5</h3>
              <p>按累计销量排序</p>
            </div>
            <NavLink to="/products">查看全部</NavLink>
          </div>
          {overview.data?.topProducts.map((product, index) => (
            <div className="top-product" key={product.id}>
              <b className={`rank rank-${index + 1}`}>{index + 1}</b>
              <img src={product.cover} />
              <div>
                <strong>{product.name}</strong>
                <small>销量 {product.sales}</small>
              </div>
              <span>{money(product.price)}</span>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
