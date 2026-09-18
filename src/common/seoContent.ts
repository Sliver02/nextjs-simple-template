// Project-specific SEO content. The handling lives in `@/common/seo` (identical across projects).
import { RouteEnum } from "@/common/routeEnum";
import type { Page } from "@/common/seo";
import type { Locale } from "@/i18n/routing";

// TODO(per project): set the production origin, no trailing slash.
export const SITE_URL = "https://example.com";
export const SITE_NAME = "Next.js Simple Template";

/** `og:locale` value for each supported locale. */
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", it: "it_IT" };

/**
 * Routes that are real pages. If RouteEnum also holds non-page entries (mailto:, external
 * URLs, #anchors), exclude them: `Exclude<RouteEnum, RouteEnum.EMAIL | RouteEnum.INSTAGRAM>`.
 */
export type PageRoute = RouteEnum;

// Every page route needs copy in every locale. TypeScript fails the build when one is missing.
// Titles ≤ ~50 chars (SITE_NAME is appended), descriptions ≤ ~160, images under 5 MB.
export const pages: Record<PageRoute, Page> = {
	[RouteEnum.HOME]: {
		// TODO(per project): add a 1200×630 image at public/images/og.jpg (or point to another file).
		image: "og.jpg",
		en: {
			title: "Next.js Simple Template",
			description:
				"A bare, immediately-usable Next.js 16 starter with atomic design, i18n, and SCSS modules.",
		},
		it: {
			title: "Next.js Simple Template",
			description:
				"Uno starter Next.js 16 essenziale e subito utilizzabile, con atomic design, i18n e moduli SCSS.",
		},
		// Optional per-locale overrides (fall back to title/description when omitted):
		// og: { title: "…", description: "…" },
		// twitter: { title: "…", description: "…" },
	},
};

/**
 * schema.org JSON-LD rendered in the root layout's <head>.
 * Generic `WebSite` by default. Businesses: switch to a `LocalBusiness` subtype and add
 * address, telephone, areaServed and sameAs — only with confirmed facts; wrong data is worse than none.
 */
export const structuredData = (locale: string) => ({
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: SITE_NAME,
	url: `${SITE_URL}/${locale}`,
	inLanguage: locale,
});
