import './src/config/env'
import http from 'http'
import app from './src/app'

const server = http.createServer(app)
let currentApp = app

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
	console.log('running app')
})

if (module.hot) {
	module.hot.accept('./src/app', () => {
		server.removeListener('request', currentApp)
		server.on('request', app)
		currentApp = app
	})
}
