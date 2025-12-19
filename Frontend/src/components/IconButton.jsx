import React from "react";

export default function IconButton({ title, variant = "default", children, ...props }) {
  const cls =
    variant === "danger"
      ? "iconBtn iconBtnDanger"
      : "iconBtn";

  return (
    <button className={cls} aria-label={title} title={title} type="button" {...props}>
      {children}
    </button>
  );
}
