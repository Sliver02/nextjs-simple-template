import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
	const t = await getTranslations("notFound");

	return (
		<main
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "60vh",
				gap: "1rem",
				textAlign: "center",
				padding: "2rem",
			}}
		>
			<h1>{t("title")}</h1>
			<p>{t("description")}</p>
			<Link href="/">{t("backHome")}</Link>
		</main>
	);
}
