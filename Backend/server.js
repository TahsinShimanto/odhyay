import express from 'express'
import dotenv from "dotenv"
import { connectDB } from './src/config/database.js'
import questionsRouter from './src/routes/questions.js'
import usersRouter from './src/routes/users.js'

import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Dotenv
dotenv.config()

// App config
const app = express()
const port = process.env.PORT || 4000

// Middlewares
app.use(express.json())

// Routes
app.use('/api/questions', questionsRouter)
app.use('/api/users', usersRouter)

app.listen(port, () => {
  console.log('server started on port: ' + port);
})

// MongoDB
connectDB()