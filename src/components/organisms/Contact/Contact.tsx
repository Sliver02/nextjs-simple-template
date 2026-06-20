"use client";

import ContactTemplate from "@/common/emailTemplates/ContactTemplate";
import { AlertResponse } from "@/common/globalInterfaces";
import { Alert } from "@/components/atoms/Alert";
import { Button } from "@/components/atoms/Button";
import { Col, Container, Row } from "@/components/atoms/Grid";
import { Input } from "@/components/atoms/Input/Input";
import { Select } from "@/components/atoms/Select/Select";
import emailjs from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./Contact.module.scss";
import { Autocomplete } from "@/components/atoms/Autocomplete/Autocomplete";

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE as string;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE as string;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_KEY as string;

const contactSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	message: z.string().min(10, "Message must be at least 10 characters"),
	reason: z.string().min(2, "Reason must be at least 2 characters"),
	region: z.string().min(2, "Region must be at least 2 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact = () => {
	const t = useTranslations("contact");
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState<AlertResponse | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

	const onSubmit = async (data: ContactFormData) => {
		try {
			setLoading(true);
			setAlert(null);

			const htmlContent = renderToStaticMarkup(<ContactTemplate {...data} />);

			const res = await emailjs.send(
				serviceId,
				templateId,
				{
					name: data.name,
					email: data.email,
					title: `Message from ${data.name}`,
					message_html: htmlContent,
				},
				publicKey
			);

			if (res.text === "OK") {
				setAlert({ severity: "success", text: t("successMessage") });
				reset();
			} else {
				setAlert({ severity: "error", text: t("errorMessage") });
			}
		} catch (error) {
			setAlert({
				severity: "error",
				text: `${t("errorPrefix")} ${error}`,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className={classNames(styles.contact)}>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Container>
					<Row>
						<Col xs={12}>
							<h2 className={styles.title}>{t("title")}</h2>
							<p className={styles.description}>{t("description")}</p>
						</Col>
					</Row>

					<Row>
						<Col xs={12} md={6}>
							<Input
								fullWidth
								label={t("name")}
								error={errors.name?.message}
								{...register("name")}
							/>
						</Col>
						<Col xs={12} md={6}>
							<Input
								fullWidth
								type="email"
								label={t("email")}
								error={errors.email?.message}
								{...register("email")}
							/>
						</Col>
						<Col xs={12} md={6}>
							<Autocomplete
								fullWidth
								options={[
									{ value: "patagonia", label: t("selectOptions.general") },
									{ value: "andes", label: t("selectOptions.support") },
									{ value: "atacama", label: t("selectOptions.feedback") },
								]}
								label={t("region")}
								error={errors.region?.message}
								{...register("region")}
							/>
						</Col>
						<Col xs={12} md={6}>
							<Select
								options={[
									{ value: "general", label: t("selectOptions.general") },
									{ value: "support", label: t("selectOptions.support") },
									{ value: "feedback", label: t("selectOptions.feedback") },
								]}
								label={t("reason")}
								error={errors.reason?.message}
								{...register("reason")}
							/>
						</Col>
						<Col xs={12}>
							<Input
								fullWidth
								multiline
								rows={6}
								label={t("message")}
								error={errors.message?.message}
								{...register("message")}
							/>
						</Col>
						<Col xs={12}>
							<Button type="submit" fullWidth size="large" disabled={loading}>
								{loading ? t("loading") : t("send")}
							</Button>
						</Col>
					</Row>

					{alert && (
						<Row>
							<Col xs={12}>
								<Alert severity={alert.severity} onClose={() => setAlert(null)}>
									{alert.text}
								</Alert>
							</Col>
						</Row>
					)}
				</Container>
			</form>
		</section>
	);
};
