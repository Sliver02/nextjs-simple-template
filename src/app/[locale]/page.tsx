import { Contact } from "@/components/organisms/Contact";
import { Col, Container, Row } from "@/components/atoms/Grid";
import { getTranslations } from "next-intl/server";

export default async function Page() {
	const t = await getTranslations("demo");

	return (
		<>
			<section>
				<Container>
					<Row>
						<Col xs={12}>
							<h1 className={"text--h-lg"}>{t("title")}</h1>
							<p className={"text--p-lg"}>{t("subtitle")}</p>
						</Col>
					</Row>
				</Container>
			</section>

			<div id="contact">
				<Contact />
			</div>
		</>
	);
}
