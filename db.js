const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.VITE_MONGOURL;
const connectToMongo = async () => {
  try {
    console.log(url);
    await mongoose.connect(url);
    console.log("mongoDb connected successfully!");
  } catch (error) {
    console.log(error);
    console.log("Error while connecting to mongoDb!");
  }
};

module.exports = connectToMongo;
