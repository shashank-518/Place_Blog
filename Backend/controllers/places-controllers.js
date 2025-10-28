const HttpError = require("../models/htttp-error");
const { validationResult } = require("express-validator");
const getgeolocation = require("../utils/geolocation");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");
const fs = require("fs");

// 📍 Get Place by Place ID
const getPlacebyId = async (req, res, next) => {
  const id = req.params.pid;

  let place;
  try {
    place = await Place.findById(id);
  } catch (err) {
    console.log(err);
    return next(new HttpError("There was an error fetching the place.", 500));
  }

  if (!place) {
    return next(new HttpError("Could not find the place with this placeId.", 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

// 👤 Get All Places by User ID
const getPlacesbyUserId = async (req, res, next) => {
  const uid = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: uid });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Fetching places failed, please try again later.", 500));
  }

  if (!places || places.length === 0) {
    return next(new HttpError("Could not find any places for the provided user id.", 404));
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

// 🏠 Create a New Place
const createPlaces = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data.", 422));
  }

  const { title, address, description } = req.body;

  let coordinate;
  try {
    coordinate = await getgeolocation(address);
  } catch (error) {
    return next(new HttpError("Could not fetch location for the given address.", 500));
  }


  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinate,
    image: req.file.path,
    creator: req.userData.userId, // ✅ this is correct
  });



  let user;
  try {
    user = await User.findById(req.userData.userId); // ✅ fixed this line
  } catch (e) {
    console.log(e);
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for the provided creator id.", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (e) {
    console.log(e);
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  res.status(201).json({ place: createdPlace });
};


// ✏️ Update a Place
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data.", 422));
  }

  const { title, description } = req.body;
  console.log(req.body)
  const placeId = req.params.pid; // ✅ fixed param name

  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the place.", 500));
  }

  if (!updatedPlace) {
    return next(new HttpError("Could not find a place for the provided id.", 404));
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (err) {
    return next(new HttpError("Something went wrong while updating the place.", 500));
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

// 🗑️ Delete a Place
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(new HttpError("Fetching place failed", 500));
  }

  if (!place) {
    return next(new HttpError("Could not find place for this id", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Deleting place failed", 500));
  }

  res.status(200).json({ message: "Deleted place." });
};


exports.getPlacebyId = getPlacebyId;
exports.getPlacesbyUserId = getPlacesbyUserId;
exports.createPlaces = createPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
