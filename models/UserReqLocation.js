const mongoose = require("mongoose");
const userReqSchema = new mongoose.Schema({
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
    date: {
      type: Date,
      default: Date.now,
    },
  });

const UserReq = mongoose.model("userreqLocation", userReqSchema);
module.exports = UserReq;