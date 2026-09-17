import { useEffect, useState } from "react";
import "./SystemPages.css";
import { Plus } from "lucide-react";
import { PageTitle, Pagination, State, TagPill } from "../../components/ui";
import { usePage } from "../../hooks/useRequest";
import { date } from "../../lib/presentation";
import type { AdminUser, Log, Role } from "../../types";

/** 系统设置下的页面共享只读/配置型表格，按领域集中在 system 模块。 */
export function AdminUsersPage() {
  const list = usePage<AdminUser>("/adminUsers", { page: 1, pageSize: 20 });
  return (
    <>
      <PageTitle
        title="管理员"
        description="管理后台账号、角色与使用状态。"
        action={
          <button className="primary">
            <Plus size={16} />
            新建管理员
          </button>
        }
      />
      <section className="card table-card">
        <State loading={list.loading} error={list.error}>
          <table>
            <thead>
              <tr>
                <th>账号</th>
                <th>昵称</th>
                <th>角色 ID</th>
                <th>最后登录</th>
                <th>状态</th>
                <th className="operations">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="admin-cell">
                      <img src={item.avatar} />
                      <b>{item.username}</b>
                    </div>
                  </td>
                  <td>{item.nickname}</td>
                  <td>{item.roleIds.join("、")}</td>
                  <td>{date(item.lastLoginAt)}</td>
                  <td>
                    <TagPill value={item.status} />
                  </td>
                  <td className="operations">
                    <button className="link-button">编辑</button>
                    <button className="link-button danger-text">禁用</button>
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
export function RolesPage() {
  const list = usePage<Role>("/roles", { page: 1, pageSize: 20 });
  const [selected, setSelected] = useState<Role | null>(null);
  useEffect(() => {
    if (!selected && list.items[0]) setSelected(list.items[0]);
  }, [list.items, selected]);
  const permissions = [
    "dashboard:view",
    "product:*",
    "order:*",
    "customer:view",
    "coupon:*",
    "banner:*",
    "system:*",
  ];
  return (
    <>
      <PageTitle
        title="角色权限"
        description="路由、菜单与操作按钮统一使用权限码控制。"
      />
      <section className="split-layout roles">
        <aside className="card role-list">
          <div className="card-head">
            <h3>角色列表</h3>
            <button className="icon-button">
              <Plus size={17} />
            </button>
          </div>
          {list.items.map((role) => (
            <button
              key={role.id}
              className={`role-item ${selected?.id === role.id ? "selected" : ""}`}
              onClick={() => setSelected(role)}
            >
              <b>{role.name}</b>
              <span>{role.description}</span>
            </button>
          ))}
        </aside>
        <section className="card permissions">
          <h3>{selected?.name || "选择角色"}</h3>
          <p>勾选的权限会以字符串数组保存到 `permissions` 字段。</p>
          <div className="permission-list">
            {permissions.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  defaultChecked={
                    selected?.permissions.includes("*") ||
                    selected?.permissions.includes(item)
                  }
                />
                <span>{item}</span>
                <small>{item.split(":")[0]} 模块权限</small>
              </label>
            ))}
          </div>
          <button className="primary">保存权限</button>
        </section>
      </section>
    </>
  );
}
export function LogsPage() {
  const [page, setPage] = useState(1);
  const list = usePage<Log>("/operationLogs", {
    page,
    pageSize: 10,
    _sort: "createdAt",
    _order: "desc",
  });
  return (
    <>
      <PageTitle
        title="操作日志"
        description="记录账号在运营后台中的关键操作，支持审计追溯。"
      />
      <section className="card table-card">
        <State loading={list.loading} error={list.error}>
          <table>
            <thead>
              <tr>
                <th>操作人</th>
                <th>模块</th>
                <th>操作</th>
                <th>详情</th>
                <th>IP 地址</th>
                <th>操作时间</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <b>{item.adminName}</b>
                  </td>
                  <td>{item.module}</td>
                  <td>
                    <span className="action-dot">{item.action}</span>
                  </td>
                  <td>{item.detail}</td>
                  <td>{item.ip}</td>
                  <td>{date(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </State>
        <Pagination meta={list.meta} page={page} setPage={setPage} />
      </section>
    </>
  );
}
