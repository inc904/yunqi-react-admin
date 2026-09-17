import type { ReactNode } from "react";
import "./Card.css";

/**
 * 通用卡片通过 header、children、footer 三个插槽承载不同内容，
 * 让外层布局保持一致，而不把业务内容固定在组件内部。
 */
export function Card({
  header,
  children,
  footer,
  className = "",
}: {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`.trim()}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </section>
  );
}
