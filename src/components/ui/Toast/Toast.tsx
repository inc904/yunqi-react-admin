import { useEffect } from "react";
import "./Toast.css";

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
