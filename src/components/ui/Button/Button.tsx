import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "text";

/**
 * 轻量按钮封装：保留原生 button 全部能力，只统一项目中的视觉变体。
 * 历史页面仍可用对应 className，后续新页面建议优先使用此组件。
 */
export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const variantClass = variant === "text" ? "text-button" : variant;
  return (
    <button className={`${variantClass} ${className}`.trim()} {...props} />
  );
}
