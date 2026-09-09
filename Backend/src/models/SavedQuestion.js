import mongoose from "mongoose";

const savedQuestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "savedQuestions",
  }
);


// A user can save a question only once
savedQuestionSchema.index(
  { userId: 1, questionId: 1 },
  { unique: true }
);

const SavedQuestion = mongoose.model(
  "SavedQuestion",
  savedQuestionSchema
);

export default SavedQuestion;