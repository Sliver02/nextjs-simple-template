"use client";

import { Dropdown } from "@/components/atoms/Dropdown";
import { useScroll } from "@/hooks/useScroll";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import classNames from "classnames";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import { MouseEvent, ReactNode, useState } from "react";
import styles from "./Header.module.scss";

export interface NavItem {
	href: string;
	label: string;
	/** Optional leading icon (e.g. a lucide-react glyph). */
	icon?: ReactNode;
}

export interface NavMenu {
	label: string;
	/** Optional leading icon (e.g. a lucide-react glyph). */
	icon?: ReactNode;
	items: NavItem[];
}

export interface HeaderProps {
	logo?: React.ReactNode;
	navItems?: NavItem[];
	/** Dropdown menus rendered alongside the flat nav links. */
	menus?: NavMenu[];
	className?: string;
}

export const Header = ({ logo, navItems, menus, className }: HeaderProps) => {
	const { scrollY } = useScroll();
	const pathname = usePathname();
	const router = useRouter();
	const lenis = useLenis();
	const [menuOpen, setMenuOpen] = useState(false);

	const scrolled = scrollY > 8;

	// Smooth-scroll to same-page anchors via Lenis; fall back to routing
	// when the target isn't on the current page. Returns true if handled here.
	const goTo = (href: string) => {
		setMenuOpen(false);

		const hashIndex = href.indexOf("#");
		if (hashIndex !== -1 && lenis) {
			const target = href.slice(hashIndex);
			if (document.querySelector(target)) {
				lenis.scrollTo(target, { offset: -80 });
				return true;
			}
		}
		return false;
	};

	// For <Link> elements: prevent the default jump only when we scroll in-page.
	const handleNavClick = (href: string) => (e: MouseEvent) => {
		if (goTo(href)) e.preventDefault();
	};

	return (
		<header
			className={classNames(
				styles.header,
				{ [styles.scrolled]: scrolled },
				className
			)}
		>
			{/* Logo */}
			<div className={styles.logo}>
				<Link href="/" className={styles.logoLink} onClick={() => setMenuOpen(false)}>
					{logo ?? <span className={styles.logoText}>Logo</span>}
				</Link>
			</div>

			{/* Desktop nav */}
			<nav className={styles.nav} aria-label="Main navigation">
				{navItems?.map(({ href, label, icon }) => (
					<Link
						key={href}
						href={href}
						className={styles.navLink}
						onClick={handleNavClick(href)}
					>
						{icon && <span className={styles.navIcon}>{icon}</span>}
						{label}
					</Link>
				))}
				{menus?.map((menu) => (
					<Dropdown
						key={menu.label}
						className={styles.navLink}
						label={
							<>
								{menu.icon && <span className={styles.navIcon}>{menu.icon}</span>}
								{menu.label}
							</>
						}
						items={menu.items.map(({ href, label, icon }) => ({
							label,
							icon,
							onClick: () => {
								if (!goTo(href)) router.push(href);
							},
						}))}
					/>
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
				{menuOpen ? <X /> : <Menu />}
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
					{navItems?.map(({ href, label, icon }) => (
						<Link
							key={href}
							href={href}
							className={styles.mobileNavLink}
							onClick={handleNavClick(href)}
						>
							{icon && <span className={styles.navIcon}>{icon}</span>}
							{label}
						</Link>
					))}
					{menus?.map((menu) => (
						<div key={menu.label} className={styles.mobileGroup}>
							<span className={styles.mobileGroupLabel}>{menu.label}</span>
							{menu.items.map(({ href, label, icon }) => (
								<Link
									key={href}
									href={href}
									className={styles.mobileNavLink}
									onClick={handleNavClick(href)}
								>
									{icon && <span className={styles.navIcon}>{icon}</span>}
									{label}
								</Link>
							))}
						</div>
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
