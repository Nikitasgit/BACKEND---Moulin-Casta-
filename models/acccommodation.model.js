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
  gps: { type: String, required: false },
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
  amenities: {
    bedrooms: {
      type: Number,
      required: [true, "Please provide the number of bedrooms"],
    },
    surface: {
      type: Number,
      required: [true, "please provide the surface of the accomodation"],
    },
    singleBed: { type: Number, required: false },
    doubleBed: { type: Number, required: false },
    bathRoom: { type: Number, default: 1 },
    toilet: { type: Number, default: 1 },
    garden: { type: Boolean, default: false },
    swimmingPool: { type: Boolean, default: false },
    river: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    barbecue: { type: Boolean, default: false },
    towels: { type: Boolean, default: false },
    mountainView: { type: Boolean, default: false },
    seaView: { type: Boolean, default: false },
    gardenLounge: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    dishwasher: { type: Boolean, default: false },
    oven: { type: Boolean, default: false },
    microwave: { type: Boolean, default: false },
    coffee: { type: Boolean, default: false },
    hairdryer: { type: Boolean, default: false },
    fireplace: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    babyBed: { type: Boolean, default: false },
    petFriendly: { type: Boolean, default: false },
    petanque: { type: Boolean, default: false },
    jacuzzi: { type: Boolean, default: false },
  },
});
AccommodationSchema.set("toObject", { useJSDate: true });
AccommodationSchema.set("toJSON", { useJSDate: true });
module.exports = mongoose.model("Accommodation", AccommodationSchema);
