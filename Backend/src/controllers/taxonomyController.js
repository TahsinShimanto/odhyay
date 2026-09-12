import mongoose from "mongoose";
import Question from "../models/Question.js";
import Module from "../models/Modules.js";
import University from "../models/university.js";
import Subject from "../models/Subject.js";
import Chapter from "../models/Chapters.js";
import Topic from "../models/Topics.js";
import { resolveSlug, handleDuplicateSlug } from "../utils/slugs.js"




// Fetches all the modules from the modules collection
export const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: modules,
    });

  } catch (error) {
    console.error("getAllModules error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch modules",
    });
  }
};


// Creates a module in the Modules collection

// requires a name for the module
// a slug is optional; if not provided, one is generated from the name
// creation fails if a module with the same slug already exists
export const createModule = async (req, res) => {
  try {
    const { name, slug: providedSlug } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Module name is required",
      });
    }

    const slug = resolveSlug(name, providedSlug);

    const module = await Module.create({ name, slug });

    return res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: { _id: module._id, name: module.name, slug: module.slug },
    });

  } catch (error) {
    console.error("createModule error:", error);
    return handleDuplicateSlug(error, res);
  }
};


// Deletes a module by its id after validating it

// deleting a module also deletes all the subjects under it
// and their associated chapters and topics
export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    const module = await Module.findByIdAndDelete(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const subjects = await Subject.find({ moduleId: id }).select("_id");
    const subjectIds = subjects.map((subject) => subject._id);

    const chapters = await Chapter.find({ subjectId: { $in: subjectIds } }).select("_id");
    const chapterIds = chapters.map((chapter) => chapter._id);

    await Topic.deleteMany({ chapterId: { $in: chapterIds } });
    await Chapter.deleteMany({ subjectId: { $in: subjectIds } });
    await Subject.deleteMany({ moduleId: id });

    return res.status(200).json({
      success: true,
      message: "Module and its subjects/chapters/topics deleted successfully",
    });
  } catch (error) {
    console.error("deleteModule error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete module",
    });
  }
};


// Fetches all the universities from the universities collection
export const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: universities,
    });

  } catch (error) {
    console.error("getAllUniversities error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch universities",
    });
  }
};


// Creates a university in the Universities collection

// requires a name and a slug, both given by the admin
// the slug is not auto-generated from the name
// and is always stored in uppercase
export const createUniversity = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "University name is required",
      });
    }

    if (!slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: "University slug is required",
      });
    }

    const university = await University.create({ name, slug });

    return res.status(201).json({
      success: true,
      message: "University created successfully",
      data: { _id: university._id, name: university.name, slug: university.slug },
    });

  } catch (error) {
    console.error("createUniversity error:", error);
    return handleDuplicateSlug(error, res);
  }
};


// Deletes a university by its id after validating it

// deleting a university also removes it from
// the appearances of every question
export const deleteUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid university ID",
      });
    }

    const university = await University.findByIdAndDelete(id);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    await Question.updateMany(
      { "appearances.university": id },
      { $pull: { appearances: { university: id } } }
    );

    return res.status(200).json({
      success: true,
      message: "University deleted successfully",
    });
  } catch (error) {
    console.error("deleteUniversity error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete university",
    });
  }
};


// Fetches all the distinct years from question appearances
export const getAllYears = async (req, res) => {
  try {
    const years = await Question.distinct("appearances.year");
    years.sort((a, b) => b - a);
    return res.status(200).json({
      success: true,
      data: years,
    });

  } catch (error) {
    console.error("getAllYears error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch years",
    });
  }
};


// Fetches all the subjects from the subjects collection
// optionally filtered by moduleId
export const getSubjects = async (req, res) => {
  try {
    const { moduleId } = req.query;

    if (moduleId && !mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    const filter = moduleId ? { moduleId } : {};
    const subjects = await Subject.find(filter).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error("getSubjects error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
    });
  }
};

// Fetches all the chapters from the chapters collection
// optionally filtered by subjectId
export const getChapters = async (req, res) => {
  try {
    const { subjectId } = req.query;

    if (subjectId && !mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    const filter = subjectId ? { subjectId } : {};
    const chapters = await Chapter.find(filter).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: chapters,
    });
  } catch (error) {
    console.error("getChapters error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chapters",
    });
  }
};

// Fetches all the topics from the topics collection
// optionally filtered by chapterId
export const getTopics = async (req, res) => {
  try {
    const { chapterId } = req.query;

    if (chapterId && !mongoose.Types.ObjectId.isValid(chapterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const filter = chapterId ? { chapterId } : {};
    const topics = await Topic.find(filter).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    console.error("getTopics error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch topics",
    });
  }
};



// Deletes a subject by its id after validating it

// deleting a subject also deletes all the chapters under it
// and their associated topics
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const chapters = await Chapter.find({ subjectId: id }).select("_id");
    const chapterIds = chapters.map((ch) => ch._id);
    await Topic.deleteMany({ chapterId: { $in: chapterIds } });
    await Chapter.deleteMany({ subjectId: id });

    return res.status(200).json({
      success: true,
      message: "Subject and its chapters/topics deleted successfully",
    });
  } catch (error) {
    console.error("deleteSubject error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete subject",
    });
  }
};



// Deletes a chapter by its id after validating it

// deleting a chapter also deletes all the topics under it
export const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const chapter = await Chapter.findByIdAndDelete(id);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    await Topic.deleteMany({ chapterId: id });

    return res.status(200).json({
      success: true,
      message: "Chapter and its topics deleted successfully",
    });
  } catch (error) {
    console.error("deleteChapter error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete chapter",
    });
  }
};



// Deletes a topic by its id after validating it
export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID",
      });
    }

    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    console.error("deleteTopic error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete topic",
    });
  }
};



// Creates a subject in the Subjects collection

// requires the moduleId of the module it belongs to and a name
// the module must exist in the Modules collection
// a slug is optional; if not provided, one is generated from the name
// creation fails if a subject with the same slug already exists
export const createSubject = async (req, res) => {
  try {
    const { moduleId, name, slug: providedSlug } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    const module = await Module.exists({ _id: moduleId });
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const slug = resolveSlug(name, providedSlug);

    const subject = await Subject.create({ moduleId, name, slug });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: { _id: subject._id, moduleId: subject.moduleId, name: subject.name, slug: subject.slug },
    });

  } catch (error) {
    console.error("createSubject error:", error);
    return handleDuplicateSlug(error, res);
  }
};



// Creates a chapter in the Chapters collection

// requires the subjectId of the subject it belongs to and a name
// the subject must exist in the Subjects collection
// a slug is optional; if not provided, one is generated from the name
// creation fails if the chapter's slug already exists under the same subject
export const createChapter = async (req, res) => {
  try {
    const { subjectId, name, slug: providedSlug } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Chapter name is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    const subject = await Subject.exists({ _id: subjectId });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const slug = resolveSlug(name, providedSlug);

    const chapter = await Chapter.create({
      subjectId,
      name,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      data: {
        _id: chapter._id,
        subjectId: chapter.subjectId,
        name: chapter.name,
        slug: chapter.slug,
      },
    });

  } catch (error) {
    console.error("createChapter error:", error);
    return handleDuplicateSlug(error, res);
  }
};



// Creates a topic in the Topics collection

// requires the chapterId of the chapter it belongs to and a name
// the chapter must exist in the Chapters collection
// a slug is optional; if not provided, one is generated from the name
// creation fails if the topic's slug already exists under the same chapter
export const createTopic = async (req, res) => {
  try {
    const { chapterId, name, slug: providedSlug } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic name is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(chapterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const chapter = await Chapter.exists({ _id: chapterId });
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    const slug = resolveSlug(name, providedSlug);

    const topic = await Topic.create({
      chapterId,
      name,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: "Topic created successfully",
      data: {
        _id: topic._id,
        chapterId: topic.chapterId,
        name: topic.name,
        slug: topic.slug,
      },
    });

  } catch (error) {
    console.error("createTopic error:", error);
    return handleDuplicateSlug(error, res);
  }
};


