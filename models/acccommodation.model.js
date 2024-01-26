const mongoose = require("mongoose");

const AccommodationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for the accommodation"],
  },
  location: {
    type: String,
    required: [true, " please provide the location of your accommodation "],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    maxLength: 800,
  },
  extraInfo: { type: String, required: false, maxLength: 60 },
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
  hours: {
    checkIn: { type: String, required: [true, "provide check-in hour"] },
    checkOut: { type: String, required: [true, "provide check-out hour"] },
  },
  capacity: {
    type: Number,
    required: [true, "Please provide the capacity of the accommodation"],
  },
  pictures: [
    {
      imageName: { type: String, required: true },
      url: { type: String, required: false },
    },
  ],
});
AccommodationSchema.set("toObject", { useJSDate: true });
AccommodationSchema.set("toJSON", { useJSDate: true });
module.exports = mongoose.model("Accommodation", AccommodationSchema);
