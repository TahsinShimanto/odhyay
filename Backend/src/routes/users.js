import {Router} from "express";
import User from "../models/User.js"

const router = Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find().lean()
        res.json(users)
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch users" })
    }
})

export default router