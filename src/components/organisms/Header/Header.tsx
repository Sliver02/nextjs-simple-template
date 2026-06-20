"use client";

import { useScroll } from "@/hooks/useScroll";
import { Link, usePathname } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import classNames from "classnames";
import { ReactNode, useState } from "react";
import styles from "./Header.module.scss";

export interface HeaderProps {
  logo?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const Header = ({ logo, children, className }: HeaderProps) => {
  const { scrollY, direction } = useScroll();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const hidden = direction === "down" && scrollY > 80;

  return (
    <header
      className={classNames(
        styles.header,
        { [styles.hidden]: hidden, [styles.menuOpen]: menuOpen },
        className,
      )}
    >
      {/* Logo */}
      <div className={styles.logo}>
        <Link href="/" onClick={() => setMenuOpen(false)}>
          {logo ?? <span className={styles.logoText}>Logo</span>}
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className={styles.nav} aria-label="Main navigation">
        {children}
        <LocaleSwitcher pathname={pathname} />
      </nav>

      {/* Hamburger */}
      <button
        type="button"
        className={styles.hamburger}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className={styles.hamburgerBar} />
        <span className={styles.hamburgerBar} />
        <span className={styles.hamburgerBar} />
      </button>

      {/* Mobile overlay */}
      <div
        className={classNames(styles.mobileMenu, {
          [styles.mobileMenuOpen]: menuOpen,
        })}
        aria-hidden={!menuOpen}
      >
        <nav
          className={styles.mobileNav}
          aria-label="Mobile navigation"
          onClick={() => setMenuOpen(false)}
        >
          {children}
        </nav>
        <LocaleSwitcher pathname={pathname} onClick={() => setMenuOpen(false)} />
      </div>
    </header>
  );
};

// ── locale switcher ───────────────────────────────────────────────────────────

function LocaleSwitcher({
  pathname,
  onClick,
}: {
  pathname: string;
  onClick?: () => void;
}) {
  return (
    <div className={styles.localeSwitcher}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className={styles.localeLink}
          onClick={onClick}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
