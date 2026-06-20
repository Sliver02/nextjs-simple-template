import { ReactNode } from "react";

export interface BaseProps {
	id?: string;
	children?: ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export interface LinkProps {
	id?: string;
	href: string;
	title?: string;
	target?: string;
	label?: string;
	download?: boolean | string;
}

export interface AlertResponse {
	severity: "success" | "warning" | "error";
	text: string;
}
