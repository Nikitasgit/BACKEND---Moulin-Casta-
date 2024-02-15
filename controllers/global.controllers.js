const { StatusCodes } = require("http-status-codes");
const Global = require("../models/global.model");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});
const randomFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const createGlobal = async (req, res) => {
  try {
    const global = await Global.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ global });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getGlobal = async (req, res) => {
  try {
    const globals = await Global.find({});
    const globalsWithUrls = await Promise.all(
      globals.map(async (global) => {
        const imagesWithUrls = {};
        for (const imageType of Object.keys(global.images)) {
          const imageName = global.images[imageType].imageName;
          const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: imageName,
          };
          const command = new GetObjectCommand(getObjectParams);
          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
          imagesWithUrls[imageType] = {
            ...global.images[imageType].toObject(),
            url,
          };
        }

        const video = global.video;
        if (video.videoName) {
          const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: video.videoName,
          };
          const command = new GetObjectCommand(getObjectParams);
          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
          const videoWithUrl = { ...video.toObject(), url };
          return {
            ...global.toObject(),
            video: videoWithUrl,
            images: imagesWithUrls,
          };
        } else {
          return { ...global.toObject(), images: imagesWithUrls, video: null };
        }
      })
    );

    res.status(StatusCodes.OK).json({ globals: globalsWithUrls });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const addGlobalVideo = async (req, res) => {
  try {
    const videoFile = req.file;

    const globalId = req.params.id;
    const global = await Global.findById(globalId);

    if (!global) {
      throw new NotFoundError(`No data found with the id ${globalId}`);
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

    const updatedGlobal = await Global.findByIdAndUpdate(
      globalId,
      { $set: { video: videoItem } }, // Use $set instead of $push
      { new: true }
    );

    res.json({ updatedGlobal });
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Error adding video to accommodation");
  }
};

const addGlobalImages = async (req, res) => {
  try {
    const globalId = req.params.id;
    const images = {};

    for (const type of ["profil", "mainImg", "miniature"]) {
      const filesOfType = req.files[type];

      if (filesOfType && filesOfType.length > 0) {
        const file = filesOfType[0];
        const imageName = randomFileName();
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: imageName,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        images[type] = { imageName, url: "" };
      }
    }

    const global = await Global.findByIdAndUpdate(
      globalId,
      { images: images },
      { new: true }
    );

    res.status(StatusCodes.OK).json({ global });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
module.exports = { createGlobal, getGlobal, addGlobalImages, addGlobalVideo };
