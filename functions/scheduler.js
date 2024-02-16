const cron = require("node-cron");
const { deletePastDates, addNextDates } = require("./updateCalendar");
const Accommodation = require("../models/acccommodation.model");

const init = () => {
  // Schedule the task to run every day at midnight
  cron.schedule("14 * * * *", async () => {
    console.log("Scheduler started at", new Date());
    try {
      // Fetch all accommodations from the database
      const accommodations = await Accommodation.find();
      // Iterate over each accommodation
      for (const accommodation of accommodations) {
        const id = accommodation._id;
        await deletePastDates(id);
        // If needed, you can also call addNextDates here
      }
      console.log("Scheduler completed at", new Date());
    } catch (error) {
      console.error("Scheduler error:", error);
    }
  });
};

module.exports = {
  init,
};
