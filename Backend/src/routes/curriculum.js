import express from "express";
import { getCurriculum } from "../controllers/curriculumController.js";

const router = express.Router();

router.get("/", getCurriculum);

export default router;