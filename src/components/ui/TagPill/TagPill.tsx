import { statusText, statusTone } from "@/lib/presentation";
import "./TagPill.css";

export function TagPill({ value }: { value: string }) {
  return (
    <span className={`tag ${statusTone(value)}`}>
      {statusText[value] || value}
    </span>
  );
}
