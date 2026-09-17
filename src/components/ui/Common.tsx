import { useEffect } from "react";
import type { ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import type { PageResult } from "../../types";
import { statusText, statusTone } from "../../lib/presentation";

export function TagPill({ value }: { value: string }) {
  return (
    <span className={`tag ${statusTone(value)}`}>
      {statusText[value] || value}
    </span>
  );
}
export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
/** 所有异步页面共享三态，避免每个业务组件重复维护加载和错误 JSX。 */
export function State({
  loading,
  error,
  children,
}: {
  loading: boolean;
  error: string;
  children: ReactNode;
}) {
  if (loading)
    return (
      <div className="state-card">
        <RefreshCw className="spin" />
        正在加载数据…
      </div>
    );
  if (error)
    return (
      <div className="state-card error">
        <X />
        {error}
      </div>
    );
  return <>{children}</>;
}
export function FilterBar({
  children,
  onReset,
}: {
  children: ReactNode;
  onReset?: () => void;
}) {
  return (
    <div className="filter-bar">
      <div className="filter-fields">{children}</div>
      <div className="filter-actions">
        <button className="secondary" type="submit">
          <Search size={16} />
          查询
        </button>
        {onReset && (
          <button className="text-button" type="button" onClick={onReset}>
            重置
          </button>
        )}
      </div>
    </div>
  );
}
export function Pagination({
  meta,
  page,
  setPage,
}: {
  meta?: PageResult<unknown>["meta"];
  page: number;
  setPage: (page: number) => void;
}) {
  if (!meta) return null;
  return (
    <div className="pagination">
      <span>共 {meta.total} 条</span>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        <ChevronLeft size={16} />
      </button>
      <b>{page}</b>
      <span>/ {meta.totalPages}</span>
      <button
        disabled={page >= meta.totalPages}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
export function Empty({ onReset }: { onReset?: () => void }) {
  return (
    <div className="empty">
      <Package size={34} />
      <b>暂时没有符合条件的数据</b>
      {onReset && (
        <button className="text-button" onClick={onReset}>
          重置筛选
        </button>
      )}
    </div>
  );
}
export function Drawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="drawer"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose}>
            <X />
          </button>
        </header>
        {children}
      </aside>
    </div>
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <h3>{title}</h3>
          <button className="icon-button" onClick={onClose}>
            <X size={19} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
export function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const id = setTimeout(onClose, 2800);
    return () => clearTimeout(id);
  }, [onClose]);
  return <div className="toast">✓ {message}</div>;
}
