import { Router } from "express"
import Question from "../models/Question.js"
import { createQuestion, deleteQuestion, getQuestions, updateQuestion } from "../controllers/questionController.js"
import pagination from "../middlewares/pagination.js"

const router = Router()

// public routes
router.get("/", pagination(), getQuestions);


// admin routes
router.post("/", createQuestion);
router.patch("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);


export default router
