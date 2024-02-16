const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");
const Accommodation = require("../models/acccommodation.model");

const getDates = async (req, res) => {
  const { id: accommodationID } = req.params;
  const accommodation = await Accommodation.findOne({ _id: accommodationID });
  if (!accommodation) {
    throw new NotFoundError(`No accommodation with the id ${accommodationID}`);
  }
  res.status(StatusCodes.OK).json(accommodation.dates);
};

const updateAvailabilityForDates = async (req, res) => {
  const { id: accommodationID } = req.params;
  const { dates, availability } = req.body;

  if (!dates || typeof availability === "undefined") {
    throw new BadRequestError(
      "Please provide both dates and availability in the request body."
    );
  }
  console.log("Availability:", availability);
  const accommodation = await Accommodation.findOne({ _id: accommodationID });

  if (!accommodation) {
    throw new NotFoundError(`No accommodation with the id ${accommodationID}`);
  }

  accommodation.dates.forEach((dateObj) => {
    // Check if the date is present in the frontend dates array
    const frontendDateString = dates.find(
      (frontendDate) => frontendDate === dateObj.date.toISOString()
    );
    if (frontendDateString) {
      dateObj.available = availability;
    }
  });

  await accommodation.save();
  res.status(StatusCodes.OK).json({ accommodation });
};
module.exports = {
  getDates,
  updateAvailabilityForDates,
};
