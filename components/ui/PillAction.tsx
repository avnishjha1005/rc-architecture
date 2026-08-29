import Image from "next/image";
import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import styles from "./PillAction.module.css";

type PillActionProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  arrow?: "right" | "diagonal" | false;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement> | MouseEventHandler<HTMLButtonElement>;
};

export function PillAction({
  children,
  className = "",
  href,
  arrow = "right",
  type = "button",
  disabled,
  ariaLabel,
  onClick,
}: PillActionProps) {
  const classes = `${styles.action} ${className}`.trim();
  const arrowIcon = arrow ? (
    <Image
      className="cta-arrow"
      src={arrow === "diagonal" ? "/ArrowDiagonal.svg" : "/Arrow.svg"}
      alt=""
      width={16}
      height={14}
    />
  ) : null;

  if (href) {
    return <Link className={classes} href={href} aria-label={ariaLabel} onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}>{children}{arrowIcon}</Link>;
  }

  return <button className={classes} type={type} disabled={disabled} aria-label={ariaLabel} onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}>{children}{arrowIcon}</button>;
}
