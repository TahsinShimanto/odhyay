import { Router } from "express"
import Question from "../models/Question.js"

const router = Router()

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().lean()
    res.json(questions)
  } catch (error) {
    console.error("Error fetching questions:", error)
    res.status(500).json({ message: "Failed to fetch questions" })
  }
})

export default router
