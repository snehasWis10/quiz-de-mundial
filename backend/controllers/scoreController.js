const Score = require("../models/Score");

// Submit score
exports.submitScore = async (req, res) => {
  try {
    const { username, score, difficulty, timeTaken } = req.body;

    if (!username || score == null) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const newScore = await Score.create({
      username,
      score,
      difficulty,
      timeTaken
    });

    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .sort({ score: -1, timeTaken: 1 })
      .limit(10);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
