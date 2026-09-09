import mongoose from "mongoose";
import Question from "../models/Question.js";

// Create Questions
export const createQuestion = async (req, res) => {
  try {
    const {
      type,
      examType,
      subjectId,
      chapterId,
      topicId,
      importance,
      questionText,
      questionImage,
      options,
      answerOrExplanationText,
      answerOrExplanationImage,
      appearances,
    } = req.body;


    if (!questionText?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question text is required",
      });
    }

    if (!subjectId || !chapterId || !topicId) {
      return res.status(400).json({
        success: false,
        message: "Subject, chapter and topic are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subjectId) ||
        !mongoose.Types.ObjectId.isValid(chapterId) ||
        !mongoose.Types.ObjectId.isValid(topicId)
      ) {

      return res.status(400).json({
        success: false,
        message: "Invalid subject, chapter or topic ID",
      });
    }


    const question = await Question.create({
      type,
      examType,
      subjectId,
      chapterId,
      topicId,
      importance,
      questionText,
      questionImage,
      options,
      answerOrExplanationText,
      answerOrExplanationImage,
      appearances,
    });

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question,
    });

  } catch (error) {
    console.error("createQuestion error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create question",
    });
  }
};



// patch question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID",
      });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: question,
    });

  } catch (error) {
    console.error("updateQuestion error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update question",
    });
  }
};



// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID",
      });
    }

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("deleteQuestion error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete question",
    });
  }
};

// get questions
export const getQuestions = async (req, res) => {
  try {
    const {
      subject,
      chapter,
      topic,
      type,
      examType,
      importance,
    } = req.query;

    const filter = {};

    if(subject) {
      if(!mongoose.Types.ObjectId.isValid(subject)) {
        return res.status(400).json({
          messege: "Invalid subject ID"
        });
      }

      filter.subjectId = subject;
    }

    if(chapter) {
      if(!mongoose.Types.ObjectId.isValid(chapter)) {
        return res.status(400).json({
          messege: "Invalid chapter ID"
        });
      }

      filter.chapterId = chapter;
    }

    if(topic) {
      if(!mongoose.Types.ObjectId.isValid(topic)) {
        return res.status(400).json({
          messege: "Invalid topic ID"
        });
      }

      filter.topicId = topic;
    }

    if(type) {
      filter.type = type;
    }

    if(examType) {
      filter.examType = examType;
    }

    if(importance) {
      filter.importance = importance;
    }

    // Pagination
    const { page, limit, skip } = req.pagination;

    // Query
    const [questions, total] = await Promise.all([
      Question.find(filter)
        .select("-options.isCorrect -answerOrExplanationText -answerOrExplanationImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Question.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      data: {
        questions,

        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });

  }
  catch(error) {
    console.error("Couldn't fetch Quesitons: ", error);

    return res.status(500).json({
      messege: "Failed to fetch questions",
    });
  }
};