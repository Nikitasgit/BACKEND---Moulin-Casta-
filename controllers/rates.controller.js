const { StatusCodes } = require("http-status-codes");
const Accommodation = require("../models/acccommodation.model.js");
const { NotFoundError } = require("../errors");

const updateDefaultRate = async (req, res) => {
  try {
    const { id: accommodationID } = req.params;
    const { defaultRate } = req.body;
    const accommodation = await Accommodation.findOne({ _id: accommodationID });

    if (!accommodation) {
      throw new NotFoundError(
        `No accommodation with the id ${accommodationID}`
      );
    }

    const datesToUpdate = accommodation.dates.filter(
      (dateObj) => dateObj.rate < defaultRate
    );

    accommodation.defaultRate = defaultRate;

    datesToUpdate.forEach((dateObj) => {
      dateObj.rate = defaultRate;
    });

    await accommodation.save();

    res.status(StatusCodes.OK).json({ success: true, data: accommodation });
  } catch (error) {
    console.error("Error updating default rate:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Error updating default rate.",
    });
  }
};

const updateRatesForDates = async (req, res) => {
  const { id: accommodationID } = req.params;
  const { dates, rate } = req.body;
  const accommodation = await Accommodation.findOne({ _id: accommodationID });
  if (!accommodation) {
    throw new NotFoundError(`No accommodation with the id ${accommodationID}`);
  }
  accommodation.dates.forEach((dateObj) => {
    const frontendDateString = dates.find(
      (frontendDate) => frontendDate === dateObj.date.toISOString()
    );
    if (frontendDateString) {
      dateObj.rate = rate;
    }
  });
  await accommodation.save();
  res.status(StatusCodes.OK).json({ success: true, data: accommodation });
};

module.exports = {
  updateDefaultRate,
  updateRatesForDates,
};
