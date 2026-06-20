import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import styles from "./Footer.module.scss";

export interface FooterProps {
  children?: ReactNode;
  className?: string;
}

export const Footer = ({ children, className }: FooterProps) => {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className={className}>
      <div className={styles.inner}>
        {children && <nav className={styles.links}>{children}</nav>}
        <p className={styles.copyright}>
          © {year} — {t("copyright")}
        </p>
      </div>
    </footer>
  );
};
