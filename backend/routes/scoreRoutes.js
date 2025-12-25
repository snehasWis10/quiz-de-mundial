const express = require("express");
const router = express.Router();
const {
  submitScore,
  getLeaderboard
} = require("../controllers/scoreController");

router.post("/submit", submitScore);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
