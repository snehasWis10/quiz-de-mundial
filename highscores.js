const API_BASE_URL = "https://quiz-backend-0xno.onrender.com/api";
const highScoresList = document.getElementById("highScoresList");

// Clear list first (safety)
highScoresList.innerHTML = "";

// 🔹 Render scores helper
function renderScores(scores) {
  highScoresList.innerHTML = "";

  scores.forEach((score, index) => {
    const li = document.createElement("li");
    li.classList.add("high-score");

    li.innerText = `${index + 1}. ${score.username || score.name} - ${score.score}`;
    highScoresList.appendChild(li);
  });
}

// 🔹 1. Try fetching from backend (MongoDB)
fetch(`${API_BASE_URL}/scores/leaderboard`)
  .then(res => {
    if (!res.ok) throw new Error("Backend failed");
    return res.json();
  })
  .then(data => {
    if (data.length === 0) {
      throw new Error("No backend data");
    }
    renderScores(data);
  })
  .catch(() => {
    // 🔹 2. Fallback to localStorage
    const localScores = JSON.parse(localStorage.getItem("highScores")) || [];

    // Ensure consistent format
    const formattedScores = localScores.map(score => ({
      username: score.name,
      score: score.score
    }));

    renderScores(formattedScores);
  });
