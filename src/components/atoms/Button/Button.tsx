"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./Button.module.scss";

export interface ButtonProps extends ButtonPrimitive.Props {
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Button = ({
  variant = "contained",
  size = "medium",
  fullWidth,
  startIcon,
  endIcon,
  className,
  children,
  ...props
}: ButtonProps) => (
  <ButtonPrimitive
    className={classNames(
      styles.button,
      styles[variant],
      styles[size],
      { [styles.fullWidth]: fullWidth },
      className,
    )}
    {...props}
  >
    {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
    {children}
    {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
  </ButtonPrimitive>
);
