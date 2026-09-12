import { Router } from "express"
import Question from "../models/Question.js"
import { createQuestion, deleteAllQuestions, deleteQuestion, getQuestions, updateQuestion } from "../controllers/questionController.js"
import pagination from "../middlewares/pagination.js"
import { questionUpload, handleUploadErrors } from "../middlewares/upload.js"

const router = Router()

// public routes
router.get("/", pagination(), getQuestions);


// admin routes
router.post("/", questionUpload, handleUploadErrors, createQuestion);
router.patch("/:id", updateQuestion);
router.delete("/all", deleteAllQuestions);
router.delete("/:id", deleteQuestion);


export default router
