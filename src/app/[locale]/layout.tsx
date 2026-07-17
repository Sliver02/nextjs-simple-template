import "@/designSystem/globals.scss";
import "lenis/dist/lenis.css";
import { SmoothScroll } from "@/components/atoms/SmoothScroll";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";
import { locales } from "@/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Home, LayoutGrid, Mail } from "lucide-react";

export const metadata: Metadata = {
	title: {
		default: "Next.js Simple Template",
		template: "%s | Next.js Simple Template",
	},
	description:
		"A bare, immediately-usable Next.js 16 starter with atomic design, i18n, and SCSS modules.",
};

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const messages = await getMessages();
	const t = await getTranslations("header");

	return (
		<html lang={locale} data-theme="light">
			<body>
				<NextIntlClientProvider messages={messages}>
					<SmoothScroll>
						<Header
							navItems={[{ href: "/", label: t("home"), icon: <Home /> }]}
							// Example dropdown — sections scroll into view via Lenis.
							menus={[
								{
									label: t("more"),
									items: [
										{
											href: "/#features",
											label: t("features"),
											icon: <LayoutGrid />,
										},
										{
											href: "/#contact",
											label: t("contact"),
											icon: <Mail />,
										},
									],
								},
							]}
						/>
						<main style={{ paddingTop: "4.5rem" }}>{children}</main>
						<Footer
							navItems={[
								{ href: "/", label: t("home") },
								{ href: "/#features", label: t("features") },
								{ href: "/#contact", label: t("contact") },
							]}
						/>
					</SmoothScroll>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
