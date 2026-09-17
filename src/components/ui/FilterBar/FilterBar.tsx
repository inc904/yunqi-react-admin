import type { ReactNode } from "react";
import { Search } from "lucide-react";
import "./FilterBar.css";

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
