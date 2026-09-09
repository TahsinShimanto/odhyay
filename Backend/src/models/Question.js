import mongoose from "mongoose";


const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);


const appearanceSchema = new mongoose.Schema(
  {
    university: {
      type: String,
      trim: true,
    },

    year: {
      type: Number,
    },
  },
  {
    _id: false,
  }
);


const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["mcq", "written"],
      default: "mcq",
      required: true,
    },

    examType: {
      type: String,
      trim: true,
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
      type: String,
      trim: true,
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
      type: String,
      trim: true,
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



// Main filtering index
questionSchema.index({
  subjectId: 1,
  chapterId: 1,
  topicId: 1,
});


// Useful for exam-based filtering
questionSchema.index({
  subjectId: 1,
  chapterId: 1,
  topicId: 1,
  examType: 1,
});

// Useful for question type filtering
questionSchema.index({
  subjectId: 1,
  chapterId: 1,
  topicId: 1,
  type: 1,
});

const Question = mongoose.model("Question", questionSchema);

export default Question;