import type { ComponentPropsWithoutRef } from "react";

export function Eyebrow({ children, className = "", ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={`eyebrow ${className}`.trim()} {...props}>({children})</p>;
}
