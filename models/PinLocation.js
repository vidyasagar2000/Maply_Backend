const mongoose = require("mongoose");
const pinLocationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    name: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
      unique: true,
    },
    longitude: {
      type: String,
      required: true,
      unique: true,
    },
    type:{
      type: String,
      required: true,
    },
    message:{
       type: String,
       required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });

const PinLocation = mongoose.model("pinlocation", pinLocationSchema);
module.exports = PinLocation;