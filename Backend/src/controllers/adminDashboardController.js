import User from "../models/User.js";
import Question from "../models/Question.js";
import Module from "../models/Modules.js";
import Subject from "../models/Subject.js";
import Chapter from "../models/Chapters.js";
import Topic from "../models/Topics.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalQuestions,
      totalStudents,
      totalModules,
      totalSubjects,
      totalChapters,
      totalTopics,
    ] = await Promise.all([
      Question.countDocuments(),
      User.countDocuments({ role: "student" }),
      Module.countDocuments(),
      Subject.countDocuments(),
      Chapter.countDocuments(),
      Topic.countDocuments(),
    ]);

    return res.status(200).json({
      totalQuestions,
      totalStudents,
      totalModules,
      totalSubjects,
      totalChapters,
      totalTopics,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error occurred" });
  }
};

export const getModuleSubjectOverview = async (req, res) => {
  try {
    const overview = await Subject.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "subjectId",
          as: "questions",
        },
      },
      {
        $project: {
          name: 1,
          moduleId: 1,
          questionCount: { $size: "$questions" },
        },
      },
      {
        $group: {
          _id: "$moduleId",
          subjects: {
            $push: {
              subjectId: "$_id",
              name: "$name",
              questionCount: "$questionCount",
            },
          },
        },
      },
      {
        $lookup: {
          from: "modules",
          localField: "_id",
          foreignField: "_id",
          as: "module",
        },
      },
      { $unwind: "$module" },
      {
        $project: {
          _id: 0,
          moduleId: "$module._id",
          moduleName: "$module.name",
          subjects: 1,
        },
      },
      { $sort: { moduleName: 1 } },
    ]);

    return res.status(200).json(overview)
  } catch (err) {
    console.error("getDashboardStats failed:", err);
    return res.status(500).json({ error: "Server error occurred" });
  }
};

export const getStudentGrowth = async (req, res) => {
  try {
    const monthly = await User.aggregate([
      { $match: { role: "student" } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, },
          newStudents: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    let running = 0;
    const studentGrowth = monthly.map((entry) => {
      running += entry.newStudents;
      return {
        year: entry._id.year,
        month: entry._id.month,
        day: entry._id.day,
        newStudents: entry.newStudents,
        totalStudents: running,
      };
    });

    return res.status(200).json(studentGrowth);
  } catch (err) {
    return res.status(500).json({ error: "Server error occurred" });
  }
};