const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const authenticateUser = require("../middleware/authentication");
const {
  createGlobal,
  getGlobal,
  addGlobalImages,
  addGlobalVideo,
} = require("../controllers/global.controllers");
router.post("/global", authenticateUser, createGlobal);
router.post(
  "/global/:id/media",
  authenticateUser,
  upload.fields([
    { name: "profil", maxCount: 1 },
    { name: "mainImg", maxCount: 1 },
    { name: "miniature", maxCount: 1 },
  ]),
  addGlobalImages
);
router.get("/global", upload.single("file"), getGlobal);
router.post(
  "/global/:id/video",
  authenticateUser,
  upload.single("file"),
  addGlobalVideo
);

module.exports = router;
