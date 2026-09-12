import { Router } from "express";
import {
  createModule,
  createSubject,
  createChapter,
  createTopic,
  createUniversity,
  getSubjects,
  getChapters,
  getTopics,
  getAllModules,
  getAllUniversities,
  getAllYears,
  deleteModule,
  deleteSubject,
  deleteChapter,
  deleteTopic,
  deleteUniversity,
} from "../controllers/taxonomyController.js";

const router = Router();

router.get("/modules", getAllModules);
router.get("/universities", getAllUniversities);
router.get("/years", getAllYears);
router.get("/subjects", getSubjects);
router.get("/chapters", getChapters);
router.get("/topics", getTopics);

router.post("/modules", createModule);
router.post("/universities", createUniversity);
router.post("/subjects", createSubject);
router.post("/chapters", createChapter);
router.post("/topics", createTopic);

router.delete("/modules/:id", deleteModule);
router.delete("/universities/:id", deleteUniversity);
router.delete("/subjects/:id", deleteSubject);
router.delete("/chapters/:id", deleteChapter);
router.delete("/topics/:id", deleteTopic);


export default router;