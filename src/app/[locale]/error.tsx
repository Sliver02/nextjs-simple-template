"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error({
	error,
	unstable_retry,
}: {
	error: Error & { digest?: string };
	unstable_retry: () => void;
}) {
	const t = useTranslations("error");

	useEffect(() => {
		console.error(error);
	}, [error]);

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
			<button onClick={unstable_retry}>{t("retry")}</button>
		</main>
	);
}
