import { Router } from "express"
import {
  createQuestion,
  deleteAllQuestions,
  deleteQuestion,
  getQuestions,
  saveQuestion,
  unsaveQuestion,
  updateQuestion
} from "../controllers/questionController.js"
import verifyToken, { optionalVerifyToken } from "../middlewares/verifyToken.js"
import requireRole from "../middlewares/requireRole.js"
import pagination from "../middlewares/pagination.js"
import { questionUpload, handleUploadErrors } from "../middlewares/upload.js"

const router = Router()

// public — optional auth so signed-in users get a `saved` flag on each question
router.get("/", pagination(), optionalVerifyToken, getQuestions);

// save / unsave (signed-in users)
router.post("/:id/save", verifyToken, saveQuestion);
router.delete("/:id/save", verifyToken, unsaveQuestion);

// admin routes
router.post("/", verifyToken, requireRole("admin"), questionUpload, handleUploadErrors, createQuestion);
router.patch("/:id", verifyToken, requireRole("admin"), updateQuestion);
router.delete("/all", verifyToken, requireRole("admin"), deleteAllQuestions);
router.delete("/:id", verifyToken, requireRole("admin"), deleteQuestion);


export default router
