import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import { connectDB } from './src/config/db.js'

// Dotenv
dotenv.config()

// App config
const app = express()
const port = process.env.PORT || 4000

// Middlewares
app.use(express.json())
app.use(cors())

// API endpoints
app.get('/', (req, res) => {
  res.send("API WORKING");
})

app.listen(port, () => {
  console.log('server started on port: ' + port);
})

// MongoDB
connectDB()