import mongoose from "mongoose";
import pLimit from "p-limit";
import fs from "fs";

import cloudinary from "../config/cloudinary.js";
import Question from "../models/Question.js";
import Module from "../models/Modules.js";
import Subject from "../models/Subject.js";
import Chapter from "../models/Chapters.js";
import Topic from "../models/Topics.js";
import University from "../models/university.js";
import SavedQuestion from "../models/SavedQuestion.js";


const plimit = pLimit(10);


const uploadImageSource = (value, file, folder = "questions") => {
  if (file) {
    return plimit(async () => {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, uploadResult) => {
              if (error) return reject(error);
              resolve(uploadResult);
            }
          );
          stream.on("error", reject);
          fs.createReadStream(file.path).on("error", reject).pipe(stream);
        });
        return { url: result.secure_url, publicId: result.public_id };
      } finally {
        fs.unlink(file.path, () => {});
      }
    });
  }
  if (typeof value === "string" && value.trim()) {
    return plimit(async () => {
      const result = await cloudinary.uploader.upload(value.trim(), { folder });
      return { url: result.secure_url, publicId: result.public_id };
    });
  }
  return value;
};

const processOptions = (options, optionFiles = []) => {
  if (!Array.isArray(options)) return [];
  return Promise.all(
    options.map((option, index) =>
      uploadImageSource(option?.image, optionFiles[index]).then((image) => ({
        ...option,
        image,
      }))
    )
  );
};

const destroyImages = async (publicIds) => {
  if (publicIds.length === 0) return;
  await Promise.all(
    publicIds.map((publicId) =>
      plimit(() =>
        cloudinary.uploader.destroy(publicId).catch((error) => {
          console.error(`Failed to delete image from Cloudinary: ${publicId}`, error);
        })
      )
    )
  );
};

const collectImagePublicIds = (question) => {
  const publicIds = [];
  if (question.questionImage?.publicId) {
    publicIds.push(question.questionImage.publicId);
  }
  if (question.answerOrExplanationImage?.publicId) {
    publicIds.push(question.answerOrExplanationImage.publicId);
  }
  for (const option of question.options || []) {
    if (option.image?.publicId) {
      publicIds.push(option.image.publicId);
    }
  }
  return publicIds;
};


// Create Questions
export const createQuestion = async (req, res) => {
  try {
    const {
      type,
      moduleId,
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

    if (!moduleId || !subjectId || !chapterId || !topicId) {
      return res.status(400).json({
        success: false,
        message: "Module, Subject, chapter and topic are required",
      });
    }

    let parsedOptions = options;
    if (typeof options === "string") {
      try {
        parsedOptions = JSON.parse(options);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid options format",
        });
      }
    }

    let parsedAppearances = appearances;
    if (typeof appearances === "string") {
      try {
        parsedAppearances = JSON.parse(appearances);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid appearances format",
        });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(subjectId) ||
        !mongoose.Types.ObjectId.isValid(moduleId) ||
        !mongoose.Types.ObjectId.isValid(chapterId) ||
        !mongoose.Types.ObjectId.isValid(topicId)
      ) {

      return res.status(400).json({
        success: false,
        message: "Invalid module, subject, chapter or topic ID",
      });
    }

    if (type !== undefined && type !== null && !["mcq", "written"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question type",
      });
    }

    if (
      importance !== undefined &&
      importance !== null &&
      !["low", "medium", "high"].includes(importance)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid importance level",
      });
    }

    const [existingModule, existingSubject, existingChapter, existingTopic] =
      await Promise.all([
        Module.exists({ _id: moduleId }),
        Subject.exists({ _id: subjectId }),
        Chapter.exists({ _id: chapterId }),
        Topic.exists({ _id: topicId }),
      ]);

    if (!existingModule) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    if (!existingChapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    if (!existingTopic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    if (parsedAppearances !== undefined) {
      if (!Array.isArray(parsedAppearances)) {
        return res.status(400).json({
          success: false,
          message: "Appearances must be an array",
        });
      }

      const universityIds = parsedAppearances
        .map((appearance) => appearance?.university)
        .filter((id) => id);

      for (const universityId of universityIds) {
        if (!mongoose.Types.ObjectId.isValid(universityId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid university ID in appearances",
          });
        }
      }

      for (const appearance of parsedAppearances) {
        if (
          appearance?.year !== undefined &&
          appearance.year !== null &&
          !Number.isInteger(Number(appearance.year))
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid year in appearances",
          });
        }
      }

      if (universityIds.length > 0) {
        const foundUniversities = await University.find({
          _id: { $in: universityIds },
        })
          .select("_id")
          .lean();

        if (
          foundUniversities.length !==
          new Set(universityIds.map(String)).size
        ) {
          return res.status(404).json({
            success: false,
            message: "One or more universities not found",
          });
        }
      }
    }


    const optionFiles = req.files?.optionsImage || [];

    const [uploadedQuestionImage, uploadedOptions, uploadedAnswerImage] =
      await Promise.all([
        uploadImageSource(questionImage, req.files?.questionImage?.[0]),
        processOptions(parsedOptions, optionFiles),
        uploadImageSource(answerOrExplanationImage, req.files?.answerOrExplanationImage?.[0]),
      ]);

    const question = await Question.create({
      type,
      moduleId,
      subjectId,
      chapterId,
      topicId,
      importance,
      questionText,
      questionImage: uploadedQuestionImage,
      options: uploadedOptions,
      answerOrExplanationText,
      answerOrExplanationImage: uploadedAnswerImage,
      appearances: parsedAppearances,
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

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await destroyImages(collectImagePublicIds(question));

    await Question.findByIdAndDelete(id);
    await SavedQuestion.deleteMany({ questionId: id });

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


// delete all questions
export const deleteAllQuestions = async (req, res) => {
  try {
    const result = await Question.deleteMany({});
    await SavedQuestion.deleteMany({});

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} question(s) deleted successfully`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error("deleteAllQuestions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete questions",
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
      moduleId,
      university,
      year,
    } = req.query;

    const filter = {};

    if(moduleId) {
      if(!mongoose.Types.ObjectId.isValid(moduleId)) {
        return res.status(400).json({
          message: "Invalid module ID"
        });
      }

      filter.moduleId = moduleId;
    }

    if(subject) {
      if(!mongoose.Types.ObjectId.isValid(subject)) {
        return res.status(400).json({
          message: "Invalid subject ID"
        });
      }

      filter.subjectId = subject;
    }

    if(chapter) {
      if(!mongoose.Types.ObjectId.isValid(chapter)) {
        return res.status(400).json({
          message: "Invalid chapter ID"
        });
      }

      filter.chapterId = chapter;
    }

    if(topic) {
      if(!mongoose.Types.ObjectId.isValid(topic)) {
        return res.status(400).json({
          message: "Invalid topic ID"
        });
      }

      filter.topicId = topic;
    }

    if(type) {
      filter.type = type;
    }

    if(university) {
      if(!mongoose.Types.ObjectId.isValid(university)) {
        return res.status(400).json({
          message: "Invalid university ID"
        });
      }

      filter["appearances.university"] = university;
    }

    if(year) {
      const numericYear = Number(year);
      if(!Number.isInteger(numericYear)) {
        return res.status(400).json({
          message: "Invalid year"
        });
      }

      filter["appearances.year"] = numericYear;
    }

    // Pagination
    const { page, limit, skip } = req.pagination;

    // Query
    const [questions, total] = await Promise.all([
      Question.find(filter)
        .populate("appearances.university", "name slug")
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
      message: "Failed to fetch questions",
    });
  }
};