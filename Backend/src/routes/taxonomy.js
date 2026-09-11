import { Router } from "express";
import {
  createSubject,
  createChapter,
  createTopic,
  getSubjects,
  getChapters,
  getTopics,
  deleteSubject,
  deleteChapter,
  deleteTopic,
} from "../controllers/taxonomyController.js";

const router = Router();

router.get("/subjects", getSubjects);
router.get("/chapters", getChapters);
router.get("/topics", getTopics);

router.post("/subjects", createSubject);
router.post("/chapters", createChapter);
router.post("/topics", createTopic);

router.delete("/subjects/:id", deleteSubject);
router.delete("/chapters/:id", deleteChapter);
router.delete("/topics/:id", deleteTopic);

export default router;