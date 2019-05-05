import bodyParser from 'body-parser'
import compression from 'compression'

import cors from './cors'
import toobusy from './toobussy'
import ignoreRequest from './ignReq'
import security from './security'
import { verifyJwt } from '../utils/auth/auth.util'

export default app => {
	app.set('trust proxy', true)
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	cors(app)
	app.use(compression())
	app.use(toobusy)
	ignoreRequest(app)
	security(app)
	app.use(verifyJwt)
}
