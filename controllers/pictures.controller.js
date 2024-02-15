const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv").config();
const crypto = require("crypto");
const Accommodation = require("../models/acccommodation.model");

//S3  files storage (for images)
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { BadRequestError } = require("../errors");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const randomFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const addPictures = async (req, res) => {
  const images = [];
  for (const file of req.files) {
    const imageName = randomFileName();
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    images.push({ imageName });
  }
  const accommodationId = req.params.id;
  // Update the MongoDB document with the array of images names
  const updatedAccommodation = await Accommodation.findOneAndUpdate(
    { _id: accommodationId },
    { $push: { pictures: { $each: images } } },
    { new: true }
  );
  res.json({ updatedAccommodation });
};

const addVideo = async (req, res) => {
  try {
    const videoFile = req.file;

    const accommodationId = req.params.id;
    const accommodation = await Accommodation.findById(accommodationId);

    if (!accommodation) {
      throw new NotFoundError(
        `No accommodation with the id ${accommodationId}`
      );
    }

    const videoName = randomFileName();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: videoName,
      Body: videoFile.buffer,
      ContentType: videoFile.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const videoItem = { videoName: videoName, url: "" };

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      accommodationId,
      { $set: { video: videoItem } },
      { new: true }
    );

    res.json({ updatedAccommodation });
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Error adding video to accommodation");
  }
};

const deletePicture = async (req, res) => {
  const { accommodationId, pictureId } = req.params;
  const accommodation = await Accommodation.findOne({ _id: accommodationId });
  if (!accommodation) {
    throw new NotFoundError(`No accommodation with the id ${accommodationId}`);
  }
  const picture = accommodation.pictures.find(
    (picture) => picture._id.toString() === pictureId
  );
  if (!picture) {
    throw new NotFoundError(`No picture with the id ${pictureId}`);
  }
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: picture.imageName,
  };
  const command = new DeleteObjectCommand(params);
  await s3.send(command);
  const deletedPicture = await Accommodation.updateOne(
    { _id: accommodationId },
    { $pull: { pictures: { _id: picture._id } } }
  );
  res.send({});
};

module.exports = { addPictures, deletePicture, addVideo };
