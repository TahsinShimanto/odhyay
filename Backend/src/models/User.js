import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },
    savedQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const User = mongoose.model("User", userSchema);
export default User