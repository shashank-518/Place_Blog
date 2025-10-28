const express = require("express");
const { check } = require("express-validator");
const placesControllers = require("../controllers/places-controllers");
const FileUpload = require("../middlewares/File-upload");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

// Public routes
router.get("/:pid", placesControllers.getPlacebyId);
router.get("/user/:uid", placesControllers.getPlacesbyUserId);

// Protected routes (require JWT)
router.use(checkAuth);

router.post(
  "/",
  FileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlaces
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  placesControllers.updatePlace
);

router.delete("/:pid", checkAuth, placesControllers.deletePlace);


module.exports = router;
