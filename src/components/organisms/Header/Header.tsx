"use client";

import { useScroll } from "@/hooks/useScroll";
import { Link, usePathname } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import classNames from "classnames";
import { LuMenu, LuX } from "react-icons/lu";
import { useState } from "react";
import styles from "./Header.module.scss";

export interface NavItem {
	href: string;
	label: string;
}

export interface HeaderProps {
	logo?: React.ReactNode;
	navItems?: NavItem[];
	className?: string;
}

export const Header = ({ logo, navItems, className }: HeaderProps) => {
	const { scrollY, direction } = useScroll();
	const pathname = usePathname();
	const [menuOpen, setMenuOpen] = useState(false);

	const hidden = direction === "down" && scrollY > 80;

	return (
		<header className={classNames(styles.header, { [styles.hidden]: hidden }, className)}>
			{/* Logo */}
			<div className={styles.logo}>
				<Link href="/" className={styles.logoLink} onClick={() => setMenuOpen(false)}>
					{logo ?? <span className={styles.logoText}>Logo</span>}
				</Link>
			</div>

			{/* Desktop nav */}
			<nav className={styles.nav} aria-label="Main navigation">
				{navItems?.map(({ href, label }) => (
					<Link key={href} href={href} className={styles.navLink}>
						{label}
					</Link>
				))}
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
				{menuOpen ? <LuX /> : <LuMenu />}
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
					{navItems?.map(({ href, label }) => (
						<Link key={href} href={href} className={styles.mobileNavLink}>
							{label}
						</Link>
					))}
				</nav>
				<LocaleSwitcher pathname={pathname} onClick={() => setMenuOpen(false)} />
			</div>
		</header>
	);
};

// ── locale switcher ───────────────────────────────────────────────────────────

function LocaleSwitcher({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
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
