import mongoose from "mongoose";
import { hashPassword } from '../utils/helpers.js'
import User from "../models/User.js"
import Question from "../models/Question.js"

const VALID_ROLES = ["student", "admin"];


// Fetches the user info from database
// It searches the user inside the database using user id
// -__v tells Mongoose to exclude the internal version (__v) field from your query results.
// savedQuestions is populated so the frontend knows which questions the user has saved
export const getProfile = async (req, res) => {
  try {
    const userInfo = await User.findById(req.user.id)
      .select(["-password", "-__v"])
      .populate("savedQuestions");
    return res.status(200).json(userInfo);
  }
  catch(err) {
    return res.status(500).json({ error: "Server error occurred" });
  }
};


// Gets the user's name, email and password from request body
// Hashes the password and creates a new user object
// The new user object contains name, email and the hashed password
// Then it searches the database for the provided username to see if it already exists
// If the username is unique then saves the new user object in the server
// The role is always "student" here — only an admin can grant the admin role (via updateUser)
export const createUser = async (req, res) => {
  const { username, displayName, email, password } = req.body;

  if (!username || !displayName || !email || !password) {
    return res.status(400).json({ error: "Username, display name, email and password are required" });
  }

  try {
    const existingUsername = await User.findOne({ username }).select("_id");
    if(existingUsername) {
      return res.status(400).json({ error: "Username already in use" });
    }

    const existingEmail = await User.findOne({ email }).select("_id");
    if(existingEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      username,
      displayName,
      email,
      password: hashedPassword,
      role: "student",
    });

    await newUser.save();
    return res.status(201).json({ message: "New user added successfully" });
  }
  catch(err) {
    return res.status(500).json({ error: "Server error occurred" });
  }
};


// This API updates the user data with the data provided
// The data comes from two places
// req.body → information the user wants to change
// req.params(provided at the route /:id) → which user should be changed

// Students can only update their own account
// Admins can update any account
// Only admins can change a role, and only to a valid one
// hashes the new password (only when one is provided)
// checks if the new username is unique
// then updates the user data with the provided data
export const updateUser = async (req, res) => {
  const { displayName, username, email, password, role } = req.body;
  const { id } = req.params;
  const isAdmin = req.user.role === "admin";

  if (id !== req.user.id && !isAdmin) {
    return res.status(403).json({ error: "You can only update your own account" });
  }

  if (role !== undefined && !isAdmin) {
    return res.status(403).json({ error: "Only admins can change user roles" });
  }

  if (role !== undefined && !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${VALID_ROLES.join(", ")}` });
  }

  try {
    const updates = {};
    if (username !== undefined) updates.username = username;
    if (displayName !== undefined) updates.displayName = displayName;
    if (email !== undefined) updates.email = email;
    if (password !== undefined) updates.password = await hashPassword(password);
    if (role !== undefined) updates.role = role;

    if (username !== undefined) {
      const existingUser = await User.findOne({ username }).select("_id").lean();

      if(existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ error: "Username already in use" });
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      updates,
      {
        new: true,
        runValidators: true,
      },
    ).select("-password -__v");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  }
  catch(err) {
    return res.status(500).json({ error: "Server error occurred" });
  }
};


// Searches an user by id(provided in the route /:id)
// deletes the user
// Students can only delete their own account, admins can delete any account
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.user.role === "admin";

  if (id !== req.user.id && !isAdmin) {
    return res.status(403).json({ error: "You can only delete your own account" });
  }

  try {
    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User deleted" });
  }
  catch(err) {
    return res.status(500).json({ error: "Server error occurred" });
  }
};


// Returns the authenticated user's saved questions, fully populated
// Stale ids (questions deleted by an admin) are filtered out
export const getSavedQuestions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("savedQuestions");
    const savedQuestions = await Question.find({
      _id: { $in: user.savedQuestions },
    });

    return res.status(200).json(savedQuestions);
  }
  catch(err) {
    return res.status(500).json({ error: "Server error occurred" });
  }
};


// Saves a question to the authenticated user's savedQuestions array
// $addToSet keeps the operation idempotent — saving twice is not an error
export const saveQuestion = async (req, res) => {
  const { questionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ error: "Invalid question ID" });
  }

  try {
    const questionExists = await Question.exists({ _id: questionId });
    if (!questionExists) {
      return res.status(404).json({ error: "Question not found" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { savedQuestions: questionId } },
      { new: true },
    ).select("savedQuestions");

    return res.status(201).json({
      message: "Question saved",
      savedQuestions: user.savedQuestions,
    });
  }
  catch(err) {
    return res.status(500).json({ error: "Server error occurred" });
  }
};


// Removes a question from the authenticated user's savedQuestions array
export const unsaveQuestion = async (req, res) => {
  const { questionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ error: "Invalid question ID" });
  }

  try {
    const user = await User.findById(req.user.id).select("savedQuestions");
    const isSaved = user.savedQuestions.some(
      (id) => id.toString() === questionId
    );

    if (!isSaved) {
      return res.status(404).json({ error: "Question is not saved" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedQuestions: questionId } },
      { new: true },
    ).select("savedQuestions");

    return res.status(200).json({
      message: "Question removed from saved",
      savedQuestions: updatedUser.savedQuestions,
    });
  }
  catch(err) {
    return res.status(500).json({ error: "Server error occurred" });
  }
};
