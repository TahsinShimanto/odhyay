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
import User from "../models/User.js";


const plimit = pLimit(10);

const QUESTION_TYPES = ["mcq", "written"];
const IMPORTANCE_LEVELS = ["low", "medium", "high"];

// Fields an admin may change — anything else in the body is ignored
const UPDATABLE_FIELDS = [
  "type",
  "moduleId",
  "subjectId",
  "chapterId",
  "topicId",
  "importance",
  "questionText",
  "questionImage",
  "options",
  "answerOrExplanationText",
  "answerOrExplanationImage",
  "appearances",
];

// [query param, filter field, error message] for the ObjectId filters in getQuestions
const OBJECT_ID_FILTERS = [
  ["moduleId", "moduleId", "Invalid module ID"],
  ["subject", "subjectId", "Invalid subject ID"],
  ["chapter", "chapterId", "Invalid chapter ID"],
  ["topic", "topicId", "Invalid topic ID"],
  ["university", "appearances.university", "Invalid university ID"],
];


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

const processOptions = async (options, optionFiles = []) => {
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


// Multipart forms send arrays as JSON strings
const parseJsonField = (value, name) => {
  if (typeof value !== "string") return { value };
  try {
    return { value: JSON.parse(value) };
  } catch {
    return { error: `Invalid ${name} format` };
  }
};


// Shared validation for create and update
// Returns an error message string when the payload is invalid, otherwise null
const validateQuestionPayload = async (data, { partial = false } = {}) => {
  const { type, importance, questionText, options, appearances } = data;

  if (!partial || questionText !== undefined) {
    if (typeof questionText !== "string" || !questionText.trim()) {
      return "Question text is required";
    }
  }

  if (type !== undefined && type !== null && !QUESTION_TYPES.includes(type)) {
    return "Invalid question type";
  }

  if (importance !== undefined && importance !== null && !IMPORTANCE_LEVELS.includes(importance)) {
    return "Invalid importance level";
  }

  if (options !== undefined && !Array.isArray(options)) {
    return "Options must be an array";
  }

  const referenceErrors = await Promise.all(
    [
      ["moduleId", "Module", Module],
      ["subjectId", "Subject", Subject],
      ["chapterId", "Chapter", Chapter],
      ["topicId", "Topic", Topic],
    ].map(async ([field, label, Model]) => {
      const value = data[field];
      if (partial && value === undefined) return null;
      if (!value) return `${label} is required`;
      if (!mongoose.Types.ObjectId.isValid(value)) return `Invalid ${label} ID`;
      return (await Model.exists({ _id: value })) ? null : `${label} not found`;
    })
  );

  const referenceError = referenceErrors.find(Boolean);
  if (referenceError) return referenceError;

  if (appearances !== undefined) {
    if (!Array.isArray(appearances)) {
      return "Appearances must be an array";
    }

    const universityIds = appearances.map((appearance) => appearance?.university).filter(Boolean);

    for (const universityId of universityIds) {
      if (!mongoose.Types.ObjectId.isValid(universityId)) {
        return "Invalid university ID in appearances";
      }
    }

    for (const appearance of appearances) {
      if (
        appearance?.year !== undefined &&
        appearance.year !== null &&
        !Number.isInteger(Number(appearance.year))
      ) {
        return "Invalid year in appearances";
      }
    }

    if (universityIds.length > 0) {
      const foundUniversities = await University.find({
        _id: { $in: universityIds },
      })
        .select("_id")
        .lean();

      if (foundUniversities.length !== new Set(universityIds.map(String)).size) {
        return "One or more universities not found";
      }
    }
  }

  return null;
};


// Create Questions (admin)
export const createQuestion = async (req, res) => {
  try {
    const body = { ...req.body };

    // Multipart forms send arrays as JSON strings
    for (const field of ["options", "appearances"]) {
      const parsed = parseJsonField(body[field], field);
      if (parsed.error) {
        return res.status(400).json({ success: false, message: parsed.error });
      }
      body[field] = parsed.value;
    }

    const validationError = await validateQuestionPayload(body, { partial: false });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const optionFiles = req.files?.optionsImage || [];

    const [questionImage, options, answerOrExplanationImage] = await Promise.all([
      uploadImageSource(body.questionImage, req.files?.questionImage?.[0]),
      processOptions(body.options, optionFiles),
      uploadImageSource(body.answerOrExplanationImage, req.files?.answerOrExplanationImage?.[0]),
    ]);

    const question = await Question.create({
      ...body,
      questionImage,
      options,
      answerOrExplanationImage,
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



// Update a question (admin) — only UPDATABLE_FIELDS from the body are applied
// Runs the same validation as create, skipping fields that are not provided
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID",
      });
    }

    const updates = Object.fromEntries(
      UPDATABLE_FIELDS
        .filter((field) => field in req.body)
        .map((field) => [field, req.body[field]])
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updatable fields provided",
      });
    }

    for (const field of ["options", "appearances"]) {
      if (!(field in updates)) continue;
      const parsed = parseJsonField(updates[field], field);
      if (parsed.error) {
        return res.status(400).json({ success: false, message: parsed.error });
      }
      updates[field] = parsed.value;
    }

    const validationError = await validateQuestionPayload(updates, { partial: true });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // pass image fields through the same upload helper as create
    if (updates.questionImage !== undefined) {
      updates.questionImage = (await uploadImageSource(updates.questionImage)) || null;
    }
    if (updates.answerOrExplanationImage !== undefined) {
      updates.answerOrExplanationImage = (await uploadImageSource(updates.answerOrExplanationImage)) || null;
    }
    if (updates.options !== undefined) {
      updates.options = await processOptions(updates.options);
    }

    const question = await Question.findByIdAndUpdate(
      id,
      updates,
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



// Delete question (admin) — also cleans the question out of every user's saved list
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

    await destroyImages(collectImagePublicIds(question));
    await User.updateMany(
      { savedQuestions: id },
      { $pull: { savedQuestions: id } }
    );

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


// delete all questions (admin)
export const deleteAllQuestions = async (req, res) => {
  try {
    const result = await Question.deleteMany({});
    await User.updateMany({}, { $set: { savedQuestions: [] } });

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
// One endpoint serves both the full question bank and, with ?saved=true,
// a signed-in user's saved questions — same filters, same pagination
// Signed-in users always get a `saved` flag on every question
export const getQuestions = async (req, res) => {
  try {
    const { type, year } = req.query;

    const filter = {};

    for (const [param, field, message] of OBJECT_ID_FILTERS) {
      const value = req.query[param];
      if (!value) continue;

      if (!mongoose.Types.ObjectId.isValid(value)) {
        return res.status(400).json({
          success: false,
          message,
        });
      }

      filter[field] = value;
    }

    if (type) {
      filter.type = type;
    }

    if (year) {
      const numericYear = Number(year);
      if (!Number.isInteger(numericYear)) {
        return res.status(400).json({
          success: false,
          message: "Invalid year",
        });
      }

      filter["appearances.year"] = numericYear;
    }

    // Resolve the user's saved ids once — used both for the saved-only
    // mode and for the `saved` flag on each returned question
    let savedIds = new Set();
    if (req.user) {
      const user = await User.findById(req.user.id).select("savedQuestions");
      if (user) savedIds = new Set(user.savedQuestions.map(String));
    }

    if (req.query.saved) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required for saved questions",
        });
      }

      filter._id = { $in: [...savedIds] };
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
      success: true,
      data: {
        questions: questions.map((question) => ({
          ...question,
          saved: savedIds.has(String(question._id)),
        })),

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
    console.error("Couldn't fetch questions: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
};



// Save a question to the authenticated user's saved list
export const saveQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid question ID" });
    }

    if (!(await Question.exists({ _id: id }))) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    // $addToSet keeps saving idempotent
    await User.updateOne({ _id: req.user.id }, { $addToSet: { savedQuestions: id } });

    return res.status(200).json({ success: true, message: "Question saved" });
  } catch (error) {
    console.error("saveQuestion error:", error);

    return res.status(500).json({ success: false, message: "Failed to save question" });
  }
};


// Remove a question from the authenticated user's saved list
export const unsaveQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid question ID" });
    }

    // matchedCount 0 means the id wasn't in the user's saved list
    const result = await User.updateOne(
      { _id: req.user.id, savedQuestions: id },
      { $pull: { savedQuestions: id } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Question is not saved" });
    }

    return res.status(200).json({ success: true, message: "Question removed from saved" });
  } catch (error) {
    console.error("unsaveQuestion error:", error);

    return res.status(500).json({ success: false, message: "Failed to unsave question" });
  }
};
