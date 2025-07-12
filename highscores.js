const highScoresList = document.getElementById('highScoresList');

// ✅ Read scores from localStorage
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// ✅ Clear existing list (optional, for safety)
highScoresList.innerHTML = "";

// ✅ Loop and display top scores
highScores.forEach(score => {
  const li = document.createElement('li');
  li.classList.add('high-score');
  li.innerText = `${score.name} - ${score.score}`;
  highScoresList.appendChild(li);
});
