const Accommodation = require("../models/acccommodation.model");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { createDates } = require("../functions/createDates");

const getAccommodations = async (req, res) => {
  const accommodations = await Accommodation.find({});
  res.status(StatusCodes.OK).json({ accommodations });
};

const getSingleAccommodation = async (req, res) => {
  const { id: accommodationID } = req.params;
  const accommodation = await Accommodation.findOne({ _id: accommodationID });
  if (!accommodation) {
    throw new NotFoundError(`No accommodation with the id ${accommodationID}`);
  }
  res.status(StatusCodes.OK).json({ accommodation });
};

const createAccommodation = async (req, res) => {
  const { name, defaultRate } = req.body;
  if (!name || !defaultRate || name === "" || defaultRate === "") {
    throw new BadRequestError("Please provide a name and a default rate");
  }
  req.body.dates = createDates(req.body.defaultRate);
  const accommodation = await Accommodation.create(req.body);
  res.status(StatusCodes.CREATED).json({ accommodation });
};

module.exports = {
  getAccommodations,
  getSingleAccommodation,
  createAccommodation,
};
