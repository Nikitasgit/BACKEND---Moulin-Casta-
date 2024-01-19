const Accommodation = require("../models/acccommodation.model");

const deletePastDates = async (accommodationID) => {
  const accommodation = await Accommodation.findOne({ _id: accommodationID });
  if (!accommodation) {
    throw new NotFoundError(`No accommodation with the id ${accommodationID}`);
  }

  const currentDate = new Date();
  // Filter out dates in the past
  const datesToDelete = accommodation.dates.filter(
    (dateObj) => dateObj.date < currentDate
  );

  if (datesToDelete.length > 0) {
    // Dates are in the past, delete them
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
    // No past dates to delete
    console.log("No past dates to delete for accommodation:", accommodationID);
  }
  addNextDates(accommodation);
};

const addNextDates = async (accommodation) => {
  const currentDate = new Date();
  const lastDate = accommodation.dates.reduce((maxDate, dateObj) => {
    return dateObj.date > maxDate ? dateObj.date : maxDate;
  }, new Date(0));

  // Calculate the next date
  let nextDate = new Date(lastDate);
  nextDate.setDate(lastDate.getDate() + 1);

  // Add dates until the total count reaches 365
  while (accommodation.dates.length < 365) {
    accommodation.dates.push({
      rate: accommodation.defaultRate,
      available: true,
      date: new Date(nextDate), // Create a new Date to avoid reference issues
    });
    // Move to the next day
    nextDate.setDate(nextDate.getDate() + 1);
  }
  // Save the updated accommodation document
  await accommodation.save();
  console.log("Dates added successfully");
};
module.exports = { deletePastDates, addNextDates };
