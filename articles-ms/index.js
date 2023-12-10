import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import articlesRoute from './routes/articles.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3001
const DB_NAME = process.env.DB_NAME

app.use(cors())
app.use(express.json())

app.use('/api/article', articlesRoute)

async function start() {
	try {
		await mongoose.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`)
		app.listen(3002, () => console.log(`Server started on port ${PORT}`))
	} catch (error) {
		console.log(error)
	}
}

start()