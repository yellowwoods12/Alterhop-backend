import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const createMessage = (
	to,
	from = 'admin@alterhop.com',
	subject,
	text
) => {
	return {
		to,
		from,
		subject,
		text,
	}
}

export const sendMail = message => sgMail.send(message)
