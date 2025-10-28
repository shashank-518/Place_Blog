const HttpError = require("../models/htttp-error");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PRIVATE_KEY = process.env.TOKEN_PRIVATE;

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // ✅ Properly split the token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authentication Failed");
    }

    const token = authHeader.split(" ")[1]; // e.g. "Bearer <token>"
    if (!token) {
      throw new Error("Authentication Failed");
    }

    // ✅ Verify token
    const decodedToken = jwt.verify(token, PRIVATE_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication Failed", 401);
    return next(error);
  }
};
