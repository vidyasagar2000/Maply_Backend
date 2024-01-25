const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl:{
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
