import express from 'express'
import {
	userSignup,
	userLogin,
	verifyUser,
	resendOTP,
	resetPasswordToken,
	resetPasswordTokenVerify,
	resetPassword,
} from '../controllers/user'

const router = express.Router()
router.route('/auth/login').post(userLogin)
router.route('/auth/signup').post(userSignup)
router.route('/auth/verifyuser').post(verifyUser)
router.route('/auth/resendotp').post(resendOTP)
router.route('/auth/resetpasswordtoken').post(resetPasswordToken)
router.route('/auth/resetpasswordverify').post(resetPasswordTokenVerify)
router.route('/auth/resetpassword').post(resetPassword)

export default router
