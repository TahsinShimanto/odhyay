import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  startExam,
  updateProgress,
  getAttempt,
  getResult,
  getExamQuestions,
  getMyStats,
  getLeaderboard,
  getProfileStats
} from "../controllers/examAttemptController.js";

const router = express.Router();
router.use(verifyToken);

router.get("/leaderboard", getLeaderboard);
router.get("/my-stats", getMyStats);
router.get("/profile-stats", getProfileStats);

router.post("/start", startExam);
router.patch("/:attemptId/progress", updateProgress);
router.get("/:attemptId", getAttempt);
router.get("/:attemptId/result", getResult);
router.get("/:attemptId/questions", getExamQuestions);

export default router;