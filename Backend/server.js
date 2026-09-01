import express from 'express'
import dotenv from "dotenv"
import { connectDB } from './src/config/database.js'
import questionsRouter from './src/routes/questions.js'
import authRouter from './src/routes/auth.js'
import usersRouter from './src/routes/users.js'
import dns from 'dns'

dns.setServers(['8.8.8.8', '1.1.1.1']);

// App config
const app = express()
const port = process.env.PORT || 4000

// Setting up a listener for our server
app.listen(port, () => {
  console.log('server started on port: ' + port);
})

// Dotenv
dotenv.config()

// connect to MongoDB
connectDB()

// Middlewares
app.use(express.json())


///////////////////API Endpoints///////////////////////

// authentication related APIs
app.use('/api/auth', authRouter)


// user related APIs
app.use('/api/users', usersRouter)


// question related APIs
app.use('/api/questions', questionsRouter)