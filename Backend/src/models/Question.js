import mongoose from "mongoose";



const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  {
    _id: false
  }
)

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
    },

    image: {
      type: imageSchema
    },

    isCorrect: {
      type: Boolean,
      default: false,
      required: true
    },
  },
  {
    _id: false,
  }
);


const appearanceSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
    },

    year: {
      type: Number,
    },
  },
);


const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["mcq", "written"],
      default: "mcq",
      required: true,
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },

    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    importance: {
      type: String,
      enum: ["low", "medium", "high"],
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    questionImage: {
      type: imageSchema
    },

    options: {
      type: [optionSchema],
      default: [],
    },

    answerOrExplanationText: {
      type: String,
      trim: true,
    },

    answerOrExplanationImage: {
      type: imageSchema
    },

    appearances: {
      type: [appearanceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "questions",
  }
);


const Question = mongoose.model("Question", questionSchema);

export default Question;