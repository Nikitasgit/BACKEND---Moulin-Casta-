const mongoose = require("mongoose");

const AccommodationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for the accommodation"],
  },
  dates: [
    {
      rate: { type: Number, required: true },
      available: { type: Boolean, default: true },
      date: { type: Date, required: true },
    },
  ],
  defaultRate: {
    type: Number,
    min: [10, "minimum rate is 10"],
    trim: true,
    required: true,
  },
  pictures: [
    {
      imageName: { type: String, required: true },
      url: { type: String, required: false },
    },
  ],
});

module.exports = mongoose.model("Accommodation", AccommodationSchema);
