import express from 'express'
import mongoose from 'mongoose'
import middlewares from './middleware'
import homeRouter from './routes/home'
import userRouter from './routes/user'


const app = express()
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://alterhop:india123@18.191.25.159:27017/alterhop', {
	useNewUrlParser: true,
})

middlewares(app)
app.use(homeRouter)
app.use(userRouter)

export default app
