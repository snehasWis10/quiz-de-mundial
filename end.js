const usernameInput = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");

/* =========================
   🔹 CONFIG (IMPORTANT)
   ========================= */

// 🔴 LOCAL (development)
// const API_BASE_URL = "http://localhost:5000/api";

// 🟢 PRODUCTION (Render)
const API_BASE_URL = "https://quiz-backend.onrender.com/api";

/* ========================= */

const mostRecentScore = localStorage.getItem("mostRecentScore");
const level = localStorage.getItem("lastLevel") || "easy";
const timeTaken = localStorage.getItem("timeTaken") || 0;

// 👉 Add class to <body> for level-based styling
document.body.classList.add(level);

// Local fallback (keep for safety)
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_HIGH_SCORES = 5;

// 📝 Custom message based on level
let customMessage = "";

switch (level) {
  case "hard":
    customMessage = `You got ${mostRecentScore} points in PRO mode! You’re a football genius!`;
    break;
  case "medium":
    customMessage = `Well done! Semi-Pro mode completed with ${mostRecentScore} points!`;
    break;
  default:
    customMessage = `You scored ${mostRecentScore} points in Amateur mode! Keep practicing!`;
}

finalScore.innerText = customMessage;

// Enable button only if name entered
usernameInput.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !usernameInput.value.trim();
});

// ✅ Save score (LOCAL + BACKEND)
saveScoreBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const scoreValue = parseInt(mostRecentScore);

  if (!username) return;

  /* 🔹 1. Save locally (fallback) */
  const localScore = {
    name: username,
    score: scoreValue
  };

  highScores.push(localScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));

  /* 🔹 2. Save to backend (MongoDB) */
  try {
    await fetch(`${API_BASE_URL}/scores/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        score: scoreValue,
        difficulty: level,
        timeTaken
      })
    });
  } catch (error) {
    console.error("Backend save failed, local score preserved", error);
  }

  /* 🔹 3. Redirect safely */
  window.location.href = "./index.html";
});
