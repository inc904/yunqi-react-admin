import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Card } from "../Card/Card";
import "./Modal.css";

/** 使用 Card 的三个插槽统一弹窗标题、内容与操作区。 */
export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-shell"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Card
          className="modal"
          header={
            <>
              <h3>{title}</h3>
              <button
                className="icon-button"
                onClick={onClose}
                aria-label="关闭弹窗"
              >
                <X size={19} />
              </button>
            </>
          }
          footer={footer && <div className="dialog-footer">{footer}</div>}
        >
          {children}
        </Card>
      </div>
    </div>
  );
}
