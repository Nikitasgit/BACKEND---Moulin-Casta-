const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const express = require("express");
const authenticateUser = require("../middleware/authentication");
const {
  getAccommodations,
  getSingleAccommodation,
  createAccommodation,
} = require("../controllers/accommodation.controller");
const {
  getPictures,
  addPictures,
  deletePicture,
} = require("../controllers/pictures.controller");
const {
  getDates,
  updateAvailabilityForDates,
  // deleteDate,
} = require("../controllers/dates.controller");
const {
  // getDefaultRate,
  updateRatesForDates,
  updateDefaultRate,
} = require("../controllers/rates.controller");
const router = express.Router();
//-----------ROUTES------------//
router.get("/", getAccommodations);
router.get("/:id/dates", getDates);

//For dev only
router.post("/", authenticateUser, createAccommodation);

// router.delete("/:id/dates/:id", deleteDate);

//JWT
router.post(
  "/:id/pictures",
  upload.array("images", 20),
  authenticateUser,
  addPictures
);
router.patch(
  "/:id/dates/availability",
  authenticateUser,
  updateAvailabilityForDates
);
router.patch("/:id/dates/rates", authenticateUser, updateRatesForDates);
router.patch("/:id/defaultRate", authenticateUser, updateDefaultRate);
router.delete(
  "/:accommodationId/pictures/:pictureId",
  authenticateUser,
  deletePicture
);

module.exports = router;
