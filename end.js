const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const level = localStorage.getItem('lastLevel') || 'easy'; // get level

// 👉 Add class to <body> for level-based color styling
document.body.classList.add(level);

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const MAX_HIGH_SCORES = 5;

// 📝 Generate custom message based on level
let customMessage = '';

switch (level) {
  case 'hard':
    customMessage = `You got ${mostRecentScore} points in PRO mode! You’re a football genius!`;
    break;
  case 'medium':
    customMessage = `Well done! Semi-Pro mode completed with ${mostRecentScore} points!`;
    break;
  case 'easy':
  default:
    customMessage = `You scored ${mostRecentScore} points in Amateur mode! Keep practicing!`;
    break;
}

// Show custom message on screen
finalScore.innerText = customMessage;

// Enable save button when name is typed
username.addEventListener('keyup', () => {
  saveScoreBtn.disabled = !username.value.trim();
});

// ✅ Save high score on click
saveScoreBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const score = {
    score: parseInt(mostRecentScore),
    name: username.value.trim(),
  };

  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MAX_HIGH_SCORES); // Keep only top 5

  localStorage.setItem('highScores', JSON.stringify(highScores));
  window.location.assign('/quiz-de-mundial/'); // Redirect to homepage
});
