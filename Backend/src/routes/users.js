import { Router } from "express";
import verifyToken, { optionalVerifyToken } from '../middlewares/verifyToken.js';
import {
    getProfile,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/userController.js"


const router = Router();


// get user profile information
router.get("/profile", verifyToken, getProfile);

// creates an user — public, but only an authenticated admin may assign a role
router.post("/", optionalVerifyToken, createUser);

// updates user information
router.put("/:id", verifyToken, updateUser);

// deletes user
router.delete("/:id", verifyToken, deleteUser);

export default router