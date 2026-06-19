import classNames from "classnames";
import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import styles from "./TextField.module.scss";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const TextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextFieldProps
>(({ label, error, fullWidth, multiline, rows, className, ...props }, ref) => {
  const inputClass = classNames(
    styles.input,
    { [styles.error]: error, [styles.multiline]: multiline },
    className,
  );

  return (
    <div className={classNames(styles.wrapper, { [styles.fullWidth]: fullWidth })}>
      {multiline ? (
        <>
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows ?? 4}
            placeholder=" "
            className={inputClass}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
          {label && <label className={styles.label}>{label}</label>}
        </>
      ) : (
        <>
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            placeholder=" "
            className={inputClass}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
          {label && <label className={styles.label}>{label}</label>}
        </>
      )}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

TextField.displayName = "TextField";
