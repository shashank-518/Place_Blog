const express = require("express");
const { check } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");
const FileUpload = require("../middlewares/File-upload");

const router = express.Router();

// Get all users
router.get("/", usersControllers.getUsers);

// Signup
router.post(
  "/signup",
  FileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

// Login
router.post("/login", usersControllers.login);

module.exports = router;
