export interface ContactFormProps {
	name: string;
	email: string;
	message: string;
}

const ContactTemplate: React.FC<Readonly<ContactFormProps>> = ({ name, email, message }) => (
	<div>
		<h1>New contact form submission</h1>
		<p>
			<strong>Name:</strong> {name}
			<br />
			<strong>Email:</strong> {email}
		</p>
		<p>
			<strong>Message:</strong> {message}
		</p>
	</div>
);

export default ContactTemplate;
