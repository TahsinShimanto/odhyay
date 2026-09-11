import mongoose from "mongoose";
import Subject from "../models/Subject.js";
import Chapter from "../models/Chapters.js";
import Topic from "../models/Topics.js";
import {slugify, resolveSlug, handleDuplicateSlug } from "../utils/slugs.js"


// Get Subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
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

// Get Chapters
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

// Get Topics
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

// Delete Subject
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

// Delete Chapter
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

// Delete Topic
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

// Create Subject
export const createSubject = async (req, res) => {
  try {
    const { name, slug: providedSlug } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    const slug = resolveSlug(name, providedSlug);

    const subject = await Subject.create({ name, slug });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: { _id: subject._id, name: subject.name, slug: subject.slug },
    });

  } catch (error) {
    console.error("createSubject error:", error);
    return handleDuplicateSlug(error, res);
  }
};

// Create Chapter
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

// Create Topic
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