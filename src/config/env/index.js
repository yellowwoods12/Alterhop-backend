import path from 'path'

/**
 * [envConfig load appropiate .env file based on the NODE_ENV environemtn variable]
 * @return {Promise} [.env file]
 */
const envConfig = () => {
	const env = process.env.NODE_ENV
	switch (env) {
		case 'development':
			return require('dotenv').config({
				path: path.resolve(process.cwd(), 'src/config/env/.env.dev'),
			})
		case 'production':
			return require('dotenv').config({
				path: path.resolve(process.cwd(), 'src/config/env/.env.prod'),
			})
		case 'test':
			return require('dotenv').config({
				path: path.resolve(process.cwd(), 'src/config/env/.env.test'),
			})
		default:
			return require('dotenv').config({
				path: path.resolve(process.cwd(), 'src/config/env/.env.dev'),
			})
	}
}

export default envConfig()
