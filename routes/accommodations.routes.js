const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const express = require("express");
const authenticateUser = require("../middleware/authentication");
const {
  getAccommodations,
  createAccommodation,
} = require("../controllers/accommodation.controller");
const {
  addPictures,
  deletePicture,
  addVideo,
} = require("../controllers/pictures.controller");
const {
  getDates,
  updateAvailabilityForDates,
  // deleteDate,
} = require("../controllers/dates.controller");
const {
  updateRatesForDates,
  updateDefaultRate,
} = require("../controllers/rates.controller");
const router = express.Router();
//-----------ROUTES------------//
router.get("/", getAccommodations);
router.get("/:id/dates", getDates);

//For dev only
router.post("/", authenticateUser, createAccommodation);
router.post("/:id/video", authenticateUser, upload.single("file"), addVideo);
module.exports = router;

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
