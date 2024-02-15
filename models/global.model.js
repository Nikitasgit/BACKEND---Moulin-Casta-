const mongoose = require("mongoose");
const GlobalSchema = new mongoose.Schema({
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
  video: {
    videoName: { type: String, required: false, default: "" },
    url: { type: String, required: false, default: "" },
  },
  images: {
    profil: {
      imageName: { type: String, required: false, default: "" },
      url: { type: String, required: false, default: "" },
    },
    mainImg: {
      imageName: { type: String, required: false, default: "" },
      url: { type: String, required: false, default: "" },
    },
    miniature: {
      imageName: { type: String, required: false, default: "" },
      url: { type: String, required: false, default: "" },
    },
  },

  contact: {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
    },
    phone: { type: String, required: [true, "Please provide a phone number"] },
    email: { type: String, required: [true, "Please provide an email"] },
  },
});
module.exports = mongoose.model("global", GlobalSchema);
