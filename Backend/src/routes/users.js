import { Router } from "express";
import verifyToken from '../middlewares/verifyToken.js';
import {
    getAllUsers,
    getProfile,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/userController.js"


const router = Router();


// get all users
router.get("/", verifyToken, getAllUsers);      // TODO: remove this later

// get user profile information
router.get("/profile", verifyToken, getProfile);

// creates an user
router.post("/", createUser);

// updates user information
router.put("/:id", verifyToken, updateUser);

// deletes user
router.delete("/:id", verifyToken, deleteUser);

export default router