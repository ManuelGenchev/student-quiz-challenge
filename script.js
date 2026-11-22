
// Get the elements from our HTML page
const loginSection = document.getElementById("login-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");

const usernameInput = document.getElementById("username");
const loginButton = document.getElementById("login-btn");
const welcomeMessage = document.getElementById("welcome-message");

const questionImage = document.getElementById("question-image");
const answerInput = document.getElementById("answer-input");
const submitAnswer = document.getElementById("submit-answer");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");

const finalScore = document.getElementById("final-score");
const restartButton = document.getElementById("restart-btn");

// Game variables
let correctAnswer = null;
let score = 0;
let questionCount = 0;

const MAX_QUESTIONS = 10;

// Start the quiz when the login button is clicked
loginButton.addEventListener("click", function () {

    const username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter your username!");
        return;
    }

    // Save the username for this browser session
    sessionStorage.setItem("username", username);

    // Display welcome message
    welcomeMessage.textContent = "Welcome, " + username + "!";

    // Reset game values
    score = 0;
    questionCount = 0;
    scoreDisplay.textContent = "Score: 0";

    // Show quiz and hide login
    loginSection.hidden = true;
    resultSection.hidden = true;
    quizSection.hidden = false;

    // Load the first question
    loadQuestion();
});


// Check the answer when Submit Answer is clicked
submitAnswer.addEventListener("click", function () {

    if (answerInput.value.trim() === "") {
        feedback.textContent = "Please enter an answer!";
        return;
    }

    const userAnswer = Number(answerInput.value);

    if (userAnswer === correctAnswer) {
        feedback.textContent = "Correct! Well done!";
        score++;
    } else {
        feedback.textContent =
            "Incorrect! The correct answer was " + correctAnswer;
    }

    scoreDisplay.textContent = "Score: " + score;

    // Prevent another answer while waiting
    submitAnswer.disabled = true;

    setTimeout(function () {

        // Check whether all 10 questions are finished
        if (questionCount >= MAX_QUESTIONS) {
            showResults();
        } else {
            loadQuestion();
        }

    }, 2000);
});


// Load a question from the Banana API
async function loadQuestion() {

    feedback.textContent = "Loading question...";
    answerInput.value = "";
    submitAnswer.disabled = true;

    try {

        const response = await fetch(
            "https://marcconrad.com/uob/banana/api.php"
        );

        if (!response.ok) {
            throw new Error("Could not connect to the Banana API");
        }

        const data = await response.json();

        if (!data.question || data.solution === undefined) {
            throw new Error("Invalid question data received");
        }

        // Display the question and save its answer
        questionImage.src = data.question;
        correctAnswer = Number(data.solution);

        questionCount++;

        document.getElementById("question-number").textContent =
            "Question " + questionCount + " of " + MAX_QUESTIONS;

        feedback.textContent = "";

        submitAnswer.disabled = false;

    } catch (error) {

        feedback.textContent =
            "Could not load the question. Please try again.";

        console.error("API error:", error);

    }
}


// Display the final results
function showResults() {

    quizSection.hidden = true;
    resultSection.hidden = false;

    const username = sessionStorage.getItem("username");

    finalScore.textContent =
        username + ", you scored " + score + " out of " + MAX_QUESTIONS + "!";

}


// Restart the quiz
restartButton.addEventListener("click", function () {

    // Reset the game
    score = 0;
    questionCount = 0;
    correctAnswer = null;

    // Clear the username field
    usernameInput.value = "";

    // Show login screen again
    resultSection.hidden = true;
    quizSection.hidden = true;
    loginSection.hidden = false;

    feedback.textContent = "";
    answerInput.value = "";

});
