import User from "../models/User.js"
import jwt from "jsonwebtoken"


// TODO: delete this later
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select(["-password", "-__v"]);
    return res.status(200).json(allUsers);
  }
  catch (err) {
    return res.status(400).json(err);
  }
};

// Gets the json web token from the cookies sent with the request
// Verifys the user by matching the token with the server's internal jwt secret key
// If the user is verified, then it fetches the user info
// It searches the user inside the database using user id
// -__v tells Mongoose to exclude the internal version (__v) field from your query results.
export const getProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    const user = jwt.verify(token, process.env.JWT_SECRET)

    const userInfo = await User.findById(user.id).select(["-__v"]);
    return res.status(200).json(userInfo);
  }
  catch(err) {
    return res.status(400).json(err);
  }
};


// Gets the user's name, email and password from request body
// Hashes the password and creates a new user object
// The new user object contains name, email and the hashed password
// Then it searches the database for the provided username to see if it already exists
// If the username is unique then saves the new user object in the server
export const createUser = async (req, res) => {
  const { username, displayName, email, password } = req.body;

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    username,
    displayName,
    email,
    password: hashedPassword,
  });

  try {
    const existingUsername = await User.findOne({ username }).select(["name"]);

    if(existingUsername) {
      return res.status(400).json({ error: "Username already in use" });
    }

    await newUser.save();
    return res.status(201).json({ messege: "New user added successfully" });
  }
  catch(err) {
    return res.status(400).json(err);
  }
};


// This API updates the user data with the data provided
// The data comes from two places
// req.body → information the user wants to change
// req.params(provided at the route /:id) → which user should be changed

// hashes the new password
// checks if the new username is unque
// then updates the user data with with the provided data
export const updateUser = async (req, res) => {
  const { displayName, username, email, password } = req.body;
  const { id } = req.params;

  const hashedPassword = await hashPassword(password);

  try {
    const existingUser = await User.findOne({ username }).select("_id").lean();

    if(existingUser && existingUser._id.toString() !== id) {
      return res.status(400).json({ error: "Username already in user" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { username, displayName, password: hashPassword },
      {
        new: true,
      },
    ).select("-__v");

    return res.status(200).json(updatedUser);
  }
  catch(err) {
    return res.status(400).json(err);
  }
};


// Searches an user by id(provided in the route /:id)
// deletes the user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.deleteOne({ _id: id });
    return res.status(200).json({ messege: "User deleted" });
  }
  catch(err) {
    return res.status(400).json(err);
  }
};