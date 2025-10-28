const HttpError = require("../models/htttp-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PRIVATE_KEY = process.env.TOKEN_PRIVATE;

// 👥 Get all users (without passwords)
const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (e) {
    return next(new HttpError("There was an error fetching user details.", 500));
  }

  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

// 🧾 Signup (create user)
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }

  const { name, email, password } = req.body;

  // Check if user already exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signing up failed, please try again later.", 500));
  }

  if (existingUser) {
    return next(new HttpError("User exists already, please login instead.", 422));
  }

  // Hash password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (e) {
    return next(new HttpError("There was an error securing your password.", 500));
  }

  // Create user
  const createdUser = new User({
    name,
    email,
    image: req.file ? req.file.path : "uploads/images/default.jpg", // ✅ handle missing file gracefully
    password: hashedPassword,
    place: [], // ✅ consistent with your schema
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signing up failed, please try again later.", 500));
  }

  // Generate token
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      PRIVATE_KEY,
      { expiresIn: "1h" }
    );
  } catch (e) {
    return next(new HttpError("Token generation failed, please try again.", 500));
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });

};

// 🔐 Login user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Logging in failed, please try again later.", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Invalid credentials, please try again.", 401));
  }

  let isPasswordValid = false;
  try {
    isPasswordValid = await bcrypt.compare(password, existingUser.password);
  } catch (e) {
    return next(new HttpError("Could not verify your password.", 500));
  }

  if (!isPasswordValid) {
    return next(new HttpError("Invalid credentials, could not log you in.", 401));
  }

  // Generate token
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      PRIVATE_KEY,
      { expiresIn: "1h" }
    );
  } catch (e) {
    return next(new HttpError("Logging in failed, please try again.", 500));
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token: token });

};

// Export controllers
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
