import express from "express";
import ExamAttempt from "../models/ExamAttempt.js";
import verifyToken from "../middlewares/verifyToken.js"

const router = express.Router();
router.use(verifyToken)

router.post("/start", async (req, res) => {
    const { type, questionCount, minutes, secondTime } = req.body;

    const endTime = new Date(Date.now() + (minutes || 10) * 60 * 1000);

    const attempt = await ExamAttempt.create({
        user: req.user.id,
        type, 
        questionCount,
        minutes,
        secondTime,
        endTime,

        answers: {},
        flagged: [],
    });

    res.json({
        attemptId: attempt._id,
        endTime: attempt.endTime,
    });
});

router.patch("/:attemptId/progress", async (req, res) => {
    const { answers, flagged, currentIndex  } = req.body;

    const attempt = await ExamAttempt.findById(req.params.attemptId);
    if (!attempt) 
        return res.status(404).json({ error: "Attempt not found" });

    if(attempt.user.toString() !== req.user.id)
        return res.status(403).json({ error: "আপনার এই কাজটি করার অনুমতি নেই" });

    attempt.answers = answers;
    attempt.flagged = flagged;
    attempt.currentIndex = currentIndex;
    await attempt.save();

    res.json({ ok: true, endTime: attempt.endTime });
});

router.get("/:attemptId", async (req, res) => {
    const attempt = await ExamAttempt.findById(req.params.attemptId);
    
    if (!attempt) 
        return res.status(404).json({ error: "পরীক্ষার তথ্য খুঁজে পাওয়া যায়নি" });

    if(attempt.user.toString() !== req.user.id)
        return res.status(403).json({ error: "আপনার এই কাজটি করার অনুমতি নেই" });

    res.json({
        type: attempt.type,
        questionCount: attempt.questionCount,
        minutes: attempt.minutes,
        secondTime: attempt.secondTime,
        answers: attempt.answers,
        flagged: attempt.flagged,
        currentIndex: attempt.currentIndex,
        endTime: attempt.endTime,
    })
});

export default router