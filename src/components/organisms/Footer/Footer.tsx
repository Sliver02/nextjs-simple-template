import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import styles from "./Footer.module.scss";

export interface FooterNavItem {
	href: string;
	label: string;
}

export interface FooterProps {
	navItems?: FooterNavItem[];
	className?: string;
}

export const Footer = ({ navItems, className }: FooterProps) => {
	const t = useTranslations("footer");
	const year = new Date().getFullYear();

	return (
		<footer className={className}>
			<div className={styles.inner}>
				{navItems && navItems.length > 0 && (
					<nav className={styles.links}>
						{navItems.map(({ href, label }) => (
							<Link key={href} href={href} className={styles.link}>
								{label}
							</Link>
						))}
					</nav>
				)}
				<p className={styles.copyright}>
					© {year} — {t("copyright")}
				</p>
			</div>
		</footer>
	);
};
