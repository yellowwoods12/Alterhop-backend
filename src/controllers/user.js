import UserModel from '../models/user'
import { generateJwtToken } from '../utils/auth/auth.util'
import { createMessage, sendMail } from '../utils/mail.util'
import { errMsg } from '../utils/message'

export const userSignup = async (req, res) => {
	const { email } = req.body
	const oldUser = await UserModel.findOne({ email })
	if (oldUser) {
		return res.send(errMsg('User already exists'))
	}
	let user
	try {
		user = new UserModel(req.body)
	} catch (err) {
		return res.send(errMsg('invalid data passed'))
	}
	await user.hashPassword()
	await user.sendOTP()
	try {
		await user.save()
	} catch (e) {
		return errMsg(e.message)
	}
	return res
		.status(201)
		.send({ status: true, message: 'successfully created user', user: user.id })
}

export const userLogin = async (req, res) => {
	const { email, password } = req.body
	const user = await UserModel.findOne({ email })
	if (!user) {
		return res.send(errMsg('No user Exists'))
	}
	if (!user.verifyPassword(password)) {
		return res.send(errMsg('password do not match'))
	}
	return res.status(200).send({
		type: user.user,
		token: `Bearer ${generateJwtToken({ id: user.id })}`,
	})
}

export const verifyUser = async (req, res) => {
	const { token, id } = req.body
	const user = await UserModel.findById(id)
	if (!user) {
		return res.send(errMsg('No user Exists'))
	}
	if (user.verifyOTP(token)) {
		const msg = createMessage(
			user.email,
			'admin@alterhop.com',
			'Alterhop - Important details about the upcoming webinars',
			`Hi, 
Welcome to the free webinar series #Learnfromleaders on Alterhop.
We are excited to connect you with eminent industry leaders.


Our speakers:

1) Data scientists from Silicon Valley

2) Forbes 30 under 30

3) Senior leaders from Amazon, Microsoft, TCS, Capgemini

4) Entrepreneurs from Singapore

5) McKinsey, New York

6) And many more!!!


These will happen every Saturday & Sunday (7-8 PM).

Please follow our Facebook page for more details (we will also send you webinar links on your email).

The industry leaders will answer all your questions.

Please login into your account on Alterhop and write down your questions.

We will talk about them in the webinar.


Thank you!

Team Alterhop

admin@alterhop.com`
		)
		await sendMail(msg)
		await user.save()
		return res.send({ status: true, verified: true })
	}
	return res.send({ status: false, verified: false, message: 'wrong token' })
}

export const resendOTP = async (req, res) => {
	const { id } = req.body
	const user = await UserModel.findById(id)
	if (!user) {
		return res.send(errMsg('No user Exists'))
	}
	await user.sendOTP()
	try {
		await user.save()
	} catch (e) {
		return errMsg(e.message)
	}
	return res
		.status(201)
		.send({ status: true, message: 'successfully resended OTP', user: user.id })
}

export const resetPasswordToken = async (req, res) => {
	const { email } = req.body
	const user = await UserModel.findOne({ email })
	if (!user) {
		return res.send(errMsg('No user Exists'))
	}
	try {
		user.sendPwdToken()
		const msg = createMessage(
			email,
			'admin@alterhop.com',
			'Password reset token',
			`
		Your reset password token is: ${user.password.reset_token}
		`
		)
		await sendMail(msg)
		await user.save()
		return res.send({ status: true, message: 'successfully sended token' })
	} catch (e) {
		res.send({ status: false, message: 'failed to send token' })
	}
}

export const resetPasswordTokenVerify = async (req, res) => {
	const { token, id } = req.body
	const user = await UserModel.findById(id)
	if (!user) {
		return res.send(errMsg('No user Exists'))
	}
	if (user.verifyPwdToken(token)) {
		await user.save()
		return res.send({ status: true, verified: true })
	} else {
		res.send({ status: false, message: 'failed to verify token' })
	}
}

export const resetPassword = async (req, res) => {
	const { password, id } = req.body
	const user = await UserModel.findById(id)
	if (!user) {
		return res.send(errMsg('No user Exists'))
	}
	user.password.current = password
	try {
		await user.save()
		return res.send({ status: true, message: 'successfuly reset password' })
	} catch (err) {
		res.send({ status: false, message: 'something error' })
	}
}
