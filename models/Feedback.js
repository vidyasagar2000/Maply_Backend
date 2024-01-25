const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    message: {
        type: String,
        required: true
    },
    imageUrl:{
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });

const Feedback = mongoose.model("feedback", feedbackSchema);
module.exports = Feedback;