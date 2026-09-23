import { Router } from "express"
import Question from "../models/Question.js"
import { createQuestion, deleteAllQuestions, deleteQuestion, getQuestions, updateQuestion } from "../controllers/questionController.js"
import verifyToken from "../middlewares/verifyToken.js"
import requireRole from "../middlewares/requireRole.js"
import pagination from "../middlewares/pagination.js"
import { questionUpload, handleUploadErrors } from "../middlewares/upload.js"

const router = Router()

// public routes
router.get("/", pagination(), getQuestions);


// admin routes
router.post("/", verifyToken, requireRole("admin"), questionUpload, handleUploadErrors, createQuestion);
router.patch("/:id", verifyToken, requireRole("admin"), updateQuestion);
router.delete("/all", verifyToken, requireRole("admin"), deleteAllQuestions);
router.delete("/:id", verifyToken, requireRole("admin"), deleteQuestion);


export default router
