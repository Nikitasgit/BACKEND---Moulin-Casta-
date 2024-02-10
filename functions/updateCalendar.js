const Accommodation = require("../models/acccommodation.model");

const deletePastDates = async (accommodationID) => {
  const accommodation = await Accommodation.findOne({ _id: accommodationID });
  if (!accommodation) {
    throw new NotFoundError(`No accommodation with the id ${accommodationID}`);
  }
  const currentDate = new Date();
  const yesterday = currentDate.setDate(currentDate.getDate() - 1);

  // Filter out dates in the past
  const datesToDelete = accommodation.dates.filter((dateObj) => {
    return new Date(dateObj.date) < yesterday;
  });

  if (datesToDelete.length > 0) {
    await Accommodation.updateOne(
      { _id: accommodationID },
      {
        $pull: {
          dates: { _id: { $in: datesToDelete.map((date) => date._id) } },
        },
      }
    );

    console.log("Past dates deleted successfully for:", accommodationID);
  } else {
    console.log("No past dates to delete for accommodation:", accommodationID);
  }
  addNextDates(accommodation);
};

const addNextDates = async (accommodation) => {
  const lastDate = accommodation.dates.reduce((maxDate, dateObj) => {
    return new Date(dateObj.date) > maxDate ? new Date(dateObj.date) : maxDate;
  }, new Date(0));

  // Calculate the next date
  let nextDate = new Date(lastDate);
  nextDate.setDate(lastDate.getDate() + 1);

  // Add dates until the total count reaches 365
  while (accommodation.dates.length < 366) {
    accommodation.dates.push({
      rate: accommodation.defaultRate,
      available: true,
      date: new Date(nextDate).toISOString(), // Create a new Date to avoid reference issues
    });
    // Move to the next day
    nextDate.setDate(nextDate.getDate() + 1);
  }
  // Save the updated accommodation document
  await accommodation.save();
  console.log("Dates added successfully");
};
module.exports = { deletePastDates, addNextDates };
