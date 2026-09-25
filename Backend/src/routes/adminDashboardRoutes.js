import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import requireRole from "../middlewares/requireRole.js";
import {
  getDashboardStats,
  getModuleSubjectOverview,
  getStudentGrowth,
} from "../controllers/adminDashboardController.js";

const router = Router();

router.get("/stats", verifyToken, requireRole("admin"), getDashboardStats);
router.get("/module-subjects", verifyToken, requireRole("admin"), getModuleSubjectOverview);
router.get("/student-growth", verifyToken, requireRole("admin"), getStudentGrowth);

export default router;