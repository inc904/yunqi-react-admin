import { Package } from "lucide-react";
import "./Empty.css";

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
