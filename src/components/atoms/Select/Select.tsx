"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import classNames from "classnames";
import styles from "./Select.module.scss";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.ComponentProps<typeof SelectPrimitive.Root> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
}

export const Select = ({
  label,
  options,
  placeholder = "Select…",
  error,
  className,
  ...props
}: SelectProps) => (
  <div className={classNames(styles.wrapper, className)}>
    {label && <span className={styles.label}>{label}</span>}
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        className={classNames(styles.trigger, { [styles.error]: error })}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <span aria-hidden className={styles.chevron}>
          ▾
        </span>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Positioner className={styles.positioner}>
        <SelectPrimitive.Popup className={styles.popup}>
          {options.map((opt) => (
            <SelectPrimitive.Item
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className={styles.item}
            >
              <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Root>
    {error && <span className={styles.errorText}>{error}</span>}
  </div>
);
