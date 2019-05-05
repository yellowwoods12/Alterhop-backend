import crypto from 'crypto'
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const accountSid = process.env.TWILIO_AUTH_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

import generateToken from '../utils/token'

const userSchema = new Schema(
	{
		fullname: {
			type: String,
			trim: true,
			validate: {
				validator(v) {
					return /^([a-zA-z0-9 _]){2,}$/.test(v)
				},
				message: props => `${props.value} is not a valid name`,
			},
			required: [true, 'firstname is required'],
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			validate: {
				/* eslint-disable */
				validator(v) {
					return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
						v
					)
				},
				message: props => `${props.value} is not a valid email`,
			},
			required: [true, 'email is required'],
		},
		password: {
			current: {
				type: String,
				trim: true,
				required: true,
			},
			reset_token: { type: String },
		},
		mobile: {
			no: {
				type: String,
				unique: true,
				validate: {
					validator(v) {
						return /^[0-9]{10}$/.test(v)
					},
					message: props =>
						`${props.value} is not a valid 10 digit phone number`,
				},
				required: [true, 'phone no is required'],
			},
			con_code: { type: String, default: '+91' },
			token: { type: String },
			verified: { type: Boolean, default: false },
		},
		college: {
			type: String,
			lowercase: true,
			trim: true,
		},
		branch: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

/*
 * Method's to encrypt and decrypt the password
 * @params {password}
 * @return {hashed password}
 */
userSchema.methods.hashPassword = function hashPassword(length = 64) {
	const salt = Buffer.from(`${process.env.HASH_SECRET}`, 'base64')
	const key = crypto.pbkdf2Sync(
		this.password.current,
		salt,
		100000,
		length,
		'sha512'
	)
	this.password.current = key.toString('hex')
	return true
}

userSchema.methods.verifyPassword = function verifyPassword(
	password,
	length = 64
) {
	const salt = Buffer.from(`${process.env.HASH_SECRET}`, 'base64')
	const key = crypto.pbkdf2Sync(password, salt, 100000, length, 'sha512')
	if (this.password.current === key.toString('hex')) {
		return true
	}
	return false
}

/*
 * Method's to aend and receive token
 * @params {token}
 * @return {boolean status}
 */
userSchema.methods.sendOTP = function sendOTP() {
	const token = generateToken(4)
	this.mobile.token = token
	client.messages
		.create({
			body: `Your OTP token is: ${token}`,
			from: '+17753128664',
			to: `${this.mobile.con_code}${this.mobile.no}`,
		})
		.then(message => {
			return true
		})
		.catch(err => {
			return false
		})
}

userSchema.methods.verifyOTP = function verifyOTP(token) {
	if (this.mobile.token === token) {
		this.mobile.token = ''
		this.mobile.verified = true
		return true
	}
	return false
}

userSchema.methods.sendPwdToken = function sendPwdToken() {
	const token = generateToken()
	try {
		this.password.reset_token = generateToken()
		return true
	} catch (e) {
		return false
	}
}

userSchema.methods.verifyPwdToken = function verifyPwdToken(token) {
	if (this.password.reset_token === token) {
		this.password.reset_token = ''
		return true
	}
	return false
}

export default mongoose.model('User', userSchema)
