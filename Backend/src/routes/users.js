import { Router } from "express";
import verifyToken from '../middlewares/verifyToken.js';
import {
    getProfile,
    createUser,
    updateUser,
    deleteUser,
    getSavedQuestions,
    saveQuestion,
    unsaveQuestion
} from "../controllers/userController.js"


const router = Router();


// get user profile information
router.get("/profile", verifyToken, getProfile);

// creates an user
router.post("/", createUser);

// get the authenticated user's saved questions
router.get("/saved-questions", verifyToken, getSavedQuestions);

// save a question
router.post("/saved-questions/:questionId", verifyToken, saveQuestion);

// unsave a question
router.delete("/saved-questions/:questionId", verifyToken, unsaveQuestion);

// updates user information
router.put("/:id", verifyToken, updateUser);

// deletes user
router.delete("/:id", verifyToken, deleteUser);

export default router