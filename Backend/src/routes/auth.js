import { Router } from 'express';
import User from "../models/User.js";

const authRouter = Router();

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if credentials were provided
        if(!email || !password) {
            return res.status(400).send({
                message: 'Email or password is required',
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        // Compare password
        if (user.password !== password) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        return res.status(200).json({
            message: 'Login successfull',
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "server error occured",
        })
    }
})

export default authRouter;