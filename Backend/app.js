const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/htttp-error");
const PlacesRoute = require("./Routes/places-routes");
const UserRoute = require("./Routes/users-routes");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const mongodb = process.env.MONGODB_CON;

app.use(bodyParser.json());

// Serve images statically
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// ✅ CORS setup — fixed version
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // or 'http://localhost:3000'
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, email'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

  // ✅ Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Routes
app.use("/api/places", PlacesRoute);
app.use("/api/users", UserRoute);

// 404 handler
app.use((req, res, next) => {
  const error = new HttpError("No Route defined", 404);
  throw error;
});

// Global error handler
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500).json({
    message: error.message || "An unexpected error occurred",
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(mongodb)
  .then(() => {
    console.log("✅ Database Connected");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => {
    console.log("❌ Database connection error:", err);
  });
