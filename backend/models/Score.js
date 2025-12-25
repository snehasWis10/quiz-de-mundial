const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"]
  },
  timeTaken: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Score", scoreSchema);
