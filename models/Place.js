const mongoose = require("mongoose");
const placeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
      unique: true
    },
    longitude: {
      type: String,
      required: true,
      unique: true
    },
    type:{
      type: String,
      required: true,
    },
    imageUrl:[{
      type: String
    }],
    importantData:[{
      type: String
    }],
    date: {
      type: Date,
      default: Date.now,
    },
  });

const Place = mongoose.model("places", placeSchema);
module.exports = Place;