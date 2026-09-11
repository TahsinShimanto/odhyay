import mongoose from "mongoose";
import ExamAttempt from "../models/ExamAttempt.js";
import Question from "../models/Question.js";

export const startExam = async (req, res) => {
  try {
    const {
      type,
      questionCount,
      minutes,
      secondTime,
      subjectId,
      chapterId,
      topicId,
    } = req.body;

    if(questionCount !== undefined){
      if (questionCount <= 0 || questionCount >= 100)
        return res.status(400).json({ error: "Invalid question count" });
    }

    if(minutes !== undefined){
      if (minutes <= 0 || minutes >= 100)
        return res.status(400).json({ error: "Invalid exam duration" });
    }

    if (subjectId && !mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ error: "Invalid subject ID" });
    }

    if (chapterId && !mongoose.Types.ObjectId.isValid(chapterId)) {
      return res.status(400).json({ error: "Invalid chapter ID" });
    }

    if (topicId && !mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ error: "Invalid topic ID" });
    }

    const endTime = new Date(Date.now() + (minutes || 10) * 60 * 1000);

    const attempt = await ExamAttempt.create({
      user: req.user.id,
      type,
      questionCount,
      minutes,
      secondTime,
      endTime,
      subjectId: subjectId || undefined,
      chapterId: chapterId || undefined,
      topicId: topicId || undefined,

      answers: {},
      flagged: [],
    });

    res.json({
      attemptId: attempt._id,
      endTime: attempt.endTime,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error occurred" });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { answers, flagged, currentIndex } = req.body;

    const attempt = await ExamAttempt.findById(req.params.attemptId);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });

    if (attempt.user.toString() !== req.user.id)
      return res.status(403).json({ error: "আপনার এই কাজটি করার অনুমতি নেই" });

    attempt.answers = answers;
    attempt.flagged = flagged;
    attempt.currentIndex = currentIndex;
    await attempt.save();

    res.json({ ok: true, endTime: attempt.endTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error occurred" });
  }
};

export const getAttempt = async (req, res) => {
  try {
    const attempt = await ExamAttempt.findById(req.params.attemptId);

    if (!attempt)
      return res
        .status(404)
        .json({ error: "পরীক্ষার তথ্য খুঁজে পাওয়া যায়নি" });

    if (attempt.user.toString() !== req.user.id)
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
      subjectId: attempt.subjectId,
      chapterId: attempt.chapterId,
      topicId: attempt.topicId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error occurred" });
  }
};

const CORRECT_MARK = 1;
const WRONG_MARK = -0.25;

export const getResult = async (req, res) => {
  try {
    const attempt = await ExamAttempt.findById(req.params.attemptId);
    if (!attempt)
      return res
        .status(404)
        .json({ error: "পরীক্ষার তথ্য খুঁজে পাওয়া যায়নি" });

    if (attempt.user.toString() !== req.user.id)
      return res.status(403).json({ error: "আপনার এই কাজটি করার অনুমতি নেই" });

    const answers = attempt.answers || {};
    const questionIds = Object.keys(answers); //keys of answer obj (ques : opt)

    const questions = await Question.find({ _id: { $in: questionIds } }).select(
      "questionText questionImage type options answerOrExplanationText answerOrExplanationImage",
    );

    const questionMap = {}; //questionid : question
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    let correctCount = 0;
    let wrongCount = 0;

    const details = [];

    for (const qId of questionIds) {
      const question = questionMap[qId];
      if (!question) continue;

      const selectedIndex = answers[qId];

      let isCorrect = false;

      if (question.options && question.options[selectedIndex]) {
        const selectedOption = question.options[selectedIndex];
        isCorrect = selectedOption.isCorrect === true;
      }

      if (isCorrect) correctCount += 1;
      else wrongCount += 1;

      details.push({
        questionId: qId,
        questionText: question.questionText,
        questionImage: question.questionImage,
        type: question.type,
        options: question.options,
        selectedIndex,
        isCorrect,
        answerOrExplanationText: question.answerOrExplanationText,
        answerOrExplanationImage: question.answerOrExplanationImage,
      });
    }

    const totalQuestions = attempt.questionCount || questionIds.length;
    const answeredCount = questionIds.length;
    const notAnsweredCount = totalQuestions - answeredCount;

    const obtainedMarks = correctCount * CORRECT_MARK + wrongCount * WRONG_MARK;
    const totalMarks = totalQuestions * CORRECT_MARK;

    const percentage =
      totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;

    attempt.obtainedMarks = Number(obtainedMarks.toFixed(2));
    attempt.percentage = percentage;
    await attempt.save();

    res.json({
      summary: {
        totalQuestions,
        answeredCount,
        correctCount,
        wrongCount,
        notAnsweredCount,
        obtainedMarks: Number(obtainedMarks.toFixed(2)),
        totalMarks,
        percentage,
      },
      details,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error occurred" });
  }
};

export const getExamQuestions = async (req, res) => {
  try {
    const attempt = await ExamAttempt.findById(req.params.attemptId);

    if (!attempt)
      return res
        .status(404)
        .json({ error: "পরীক্ষার তথ্য খুঁজে পাওয়া যায়নি" });

    if (attempt.user.toString() !== req.user.id)
      return res.status(403).json({ error: "আপনার এই কাজটি করার অনুমতি নেই" });

    const filter = { type: "mcq" };

    if (attempt.subjectId) filter.subjectId = attempt.subjectId;
    if (attempt.chapterId) filter.chapterId = attempt.chapterId;
    if (attempt.topicId) filter.topicId = attempt.topicId;

    const questionCount = attempt.questionCount || 10;

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: questionCount } },
      {
        $project: {
          "options.isCorrect": 0,
          answerOrExplanationText: 0,
          answerOrExplanationImage: 0,
        },
      },
    ]);

    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error occurred" });
  }
};

export const getMyStats = async (req, res) => {
  try {
    const { examType } = req.query;
    const query = { user: req.user.id, type: "ranked" };
    if (examType) 
      query.examType = examType;

    const allAttempts = await ExamAttempt.find(query)
      .select("obtainedMarks percentage");

    const scoredAttempts = allAttempts.filter(
      (attempt) =>
        attempt.percentage !== null && attempt.percentage !== undefined,
    );

    const completedCount = scoredAttempts.length;

    let bestScore = 0;
    scoredAttempts.forEach((attempt) => {
      if (attempt.obtainedMarks > bestScore) bestScore = attempt.obtainedMarks;
    });

    res.json({ bestScore, completedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error occurred" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { examType } = req.query;
    const matchStage = { type: "ranked", percentage: { $ne: null } };
    if (examType)
       matchStage.examType = examType;

    const leaderboard = await ExamAttempt.aggregate([
      { $match: matchStage },
      { $sort: { percentage: -1 } },
      {
        $group: {
          _id: "$user",
          bestPercentage: { $first: "$percentage" },
        },
      },
      { $sort: { bestPercentage: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          displayName: "$userInfo.displayName",
          percentage: "$bestPercentage",
        },
      },
    ]);

    res.json({ leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error occurred" });
  }
};
