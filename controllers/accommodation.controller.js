const Accommodation = require("../models/acccommodation.model");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { createDates } = require("../functions/createDates");
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});
const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({});

    const accommodationsWithUrls = await Promise.all(
      accommodations.map(async (accommodation) => {
        if (accommodation.pictures.length > 0) {
          const picturesWithUrls = await Promise.all(
            accommodation.pictures.map(async (picture) => {
              const getObjectParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: picture.imageName,
              };
              const command = new GetObjectCommand(getObjectParams);
              const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
              return { ...picture.toObject(), url };
            })
          );
          accommodation = {
            ...accommodation.toObject(),
            pictures: picturesWithUrls,
          };
        }

        if (accommodation.video.videoName !== "") {
          const video = accommodation.video;
          const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: video.videoName,
          };
          const command = new GetObjectCommand(getObjectParams);
          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

          accommodation.video.url = url;
        }

        return accommodation;
      })
    );

    res.status(StatusCodes.OK).json({ accommodations: accommodationsWithUrls });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const createAccommodation = async (req, res) => {
  req.body.dates = createDates(req.body.defaultRate);
  const accommodation = await Accommodation.create(req.body);
  res.status(StatusCodes.CREATED).json({ accommodation });
};

module.exports = {
  getAccommodations,
  createAccommodation,
};
