const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const levelDisplay = document.getElementById("levelDisplay");
const flipCard = document.querySelector(".flip-card-inner");
const skipBtn = document.getElementById("skipBtn");
const timeDisplay = document.getElementById("timeLeft"); // ✅ NEW: timer display

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

let timer; // ✅ NEW
let timeLeft = 15; // ✅ NEW

const queryParams = new URLSearchParams(window.location.search);
const level = queryParams.get("level") || "easy";
const readableLevel =
  level === "hard" ? "PRO" : level === "medium" ? "Semi-Pro" : "Amateur";
if (levelDisplay) levelDisplay.innerText = readableLevel;

fetch(`questions-${level}.json`)
  .then((res) => res.json())
  .then((loadedQuestions) => {
    questions = loadedQuestions;
    startGame();
  })
  .catch((err) => {
    console.error("Failed to load questions:", err);
    question.innerText = "Error loading questions.";
  });

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  game.classList.remove("hidden");
  loader.classList.add("hidden");
  getNewQuestion();
}

function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    localStorage.setItem("lastLevel", level);
    return window.location.assign("end.html");
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
    choice.parentElement.classList.remove("correct", "incorrect");
  });

  availableQuestions.splice(questionIndex, 1);

  resetTimer(); // ✅ NEW: start countdown
  acceptingAnswers = true;
}

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    clearInterval(timer); // ✅ NEW: stop countdown

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);

      if (flipCard) {
        flipCard.classList.add("flip");
        setTimeout(() => {
          flipCard.classList.remove("flip");
          getNewQuestion();
        }, 600);
      } else {
        getNewQuestion();
      }
    }, 1000);
  });
});

if (skipBtn) {
  skipBtn.addEventListener("click", () => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    clearInterval(timer); // ✅ NEW: stop countdown

    if (flipCard) {
      flipCard.classList.add("flip");
      setTimeout(() => {
        flipCard.classList.remove("flip");
        getNewQuestion();
      }, 600);
    } else {
      getNewQuestion();
    }
  });
}

function incrementScore(num) {
  score += num;
  scoreText.innerText = score;
}

// ✅ NEW: Timer function
function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  if (timeDisplay) timeDisplay.innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    if (timeDisplay) timeDisplay.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      acceptingAnswers = false;

      if (flipCard) {
        flipCard.classList.add("flip");
        setTimeout(() => {
          flipCard.classList.remove("flip");
          getNewQuestion();
        }, 600);
      } else {
        getNewQuestion();
      }
    }
  }, 1000);
}
