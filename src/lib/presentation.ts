/** 只放展示转换：页面无需重复处理金额、时间、状态文案。 */
export const money = (value: number) =>
  `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const date = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("zh-CN", {
        dateStyle: "medium",
        timeStyle: "short",
        hour12: false,
      }).format(new Date(value))
    : "—";

export const shortDate = (value: string) =>
  new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit" }).format(
    new Date(value),
  );

export const statusText: Record<string, string> = {
  draft: "草稿",
  on_sale: "销售中",
  off_sale: "已下架",
  active: "启用",
  disabled: "已禁用",
  pending_payment: "待付款",
  paid: "已付款",
  pending_shipment: "待发货",
  shipped: "已发货",
  completed: "已完成",
  cancelled: "已取消",
  refunding: "退款中",
  refunded: "已退款",
  scheduled: "待开始",
  ended: "已结束",
};

export const statusTone = (value: string) =>
  ({
    on_sale: "success",
    active: "success",
    completed: "success",
    shipped: "success",
    pending_shipment: "warning",
    paid: "warning",
    off_sale: "warning",
    refunding: "danger",
    refunded: "danger",
    disabled: "muted",
    draft: "muted",
    pending_payment: "muted",
    cancelled: "muted",
    scheduled: "warning",
    ended: "muted",
  })[value] || "muted";
