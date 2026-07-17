import { Card } from "@/components/atoms/Card";
import { FadeIn } from "@/components/atoms/FadeIn";
import { Col, Container, Row } from "@/components/atoms/Grid";
import { Contact } from "@/components/organisms/Contact";
import { MousePointerClick, ScrollText, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Page() {
	const t = await getTranslations("demo");

	const features = [
		{
			icon: <MousePointerClick />,
			title: t("features.smoothTitle"),
			body: t("features.smoothBody"),
		},
		{
			icon: <Sparkles />,
			title: t("features.fadeTitle"),
			body: t("features.fadeBody"),
		},
		{
			icon: <ScrollText />,
			title: t("features.iconsTitle"),
			body: t("features.iconsBody"),
		},
	];

	return (
		<>
			<section id="features">
				<Container>
					<Row>
						<Col xs={12}>
							<h1 className={"text--h-lg"}>{t("title")}</h1>
							<p className={"text--p-lg"}>{t("subtitle")}</p>
						</Col>
					</Row>
					<Row>
						{features.map((feature, i) => (
							<Col key={feature.title} xs={12} md={4}>
								{/* Staggered scroll-reveal via GSAP */}
								<FadeIn delay={i * 0.1}>
									<Card icon={feature.icon} title={feature.title}>
										{feature.body}
									</Card>
								</FadeIn>
							</Col>
						))}
					</Row>
				</Container>
			</section>

			<section>
				<Contact />
			</section>
		</>
	);
}
