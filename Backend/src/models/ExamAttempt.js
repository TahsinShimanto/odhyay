import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema({
    type: String,  //ranked or unranked
    questionCount: Number,
    minutes: Number,
    secondTime: Boolean,
    endTime: Date,
    currentIndex: { type: Number, default: 0 },
    answers: Object,
    flagged: [String],
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const examAttempt = mongoose.model("ExamAttempt", examAttemptSchema);
export default examAttempt