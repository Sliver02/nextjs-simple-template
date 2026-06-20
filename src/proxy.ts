import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const SKIP_PREFIXES = [
	"/_next",
	"/api",
	"/images",
	"/icons",
	"/assets",
	"/fonts",
	"/static",
	"/favicon.ico",
	"/robots.txt",
	"/sitemap.xml",
];

const hasFileExt = (pathname: string) => /\.[a-zA-Z0-9]{1,6}$/.test(pathname);

export function proxy(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	if (SKIP_PREFIXES.some((p) => pathname.startsWith(p)) || hasFileExt(pathname)) {
		return NextResponse.next();
	}

	return intlMiddleware(req);
}

export const config = {
	matcher: ["/", "/((?!api|_next|static|.*\\..*).*)"],
};
