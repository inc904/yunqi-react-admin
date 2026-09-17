import type { ReactNode } from "react";
import { RefreshCw, X } from "lucide-react";
import "./State.css";

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
