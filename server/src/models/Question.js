import mongoose from "mongoose"

const optionSchema = new mongoose.Schema({
  id: String,
  text: String,
  image: String,
}, { _id: false })

const appearanceSchema = new mongoose.Schema({
  university: String,
  year: String,
}, { _id: false })

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ["mcq", "written"] },
  exam: String,
  subject: String,
  chapter: String,
  topic: String,
  importance: String,
  questionText: String,
  questionImage: String,
  options: [optionSchema],
  correctOption: String,
  explanationText: String,
  explanationImage: String,
  answerText: String,
  answerImage: String,
  appearances: [appearanceSchema],
  saved: Boolean,
}, { collection: "questions" })

const Question = mongoose.model("Question", questionSchema)

export default Question
