const DATA_URL = "https://kriyescodes.github.io/hangman/hangman-data.json";

// general elements
const contentContainers = document.getElementsByClassName(
	"js-content-container"
);

// main menu elements
const mainMenuContentContainer = document.getElementById(
	"mainMenuContentContainer"
);
const normalModeButton = document.getElementById("normalModeButton");
const hardcoreModeButton = document.getElementById("hardcoreModeButton");

// category menu elements
const categoryMenuContentContainer = document.getElementById(
	"categoryMenuContentContainer"
);
const categoryButtons = document.getElementsByClassName("js-category-button");
const categoryBackButton = document.getElementById("categoryMenuBackButton");

//loading screen element
const loadingScreenContentContainer = document.getElementById(
	"loadingScreenContentContainer"
);

// main game elements
const mainGameContainer = document.getElementById("mainGameContainer");
const letterButtonsContainer = document.getElementById(
	"letterButtonsContainer"
);
const highScore = document.getElementById("highScore");
const score = document.getElementById("score");
const message = document.getElementById("message");
const word = document.getElementById("word");
const hangmanLimbs = document.getElementsByClassName("hangman-limb");
const mainGameHomeButton = document.getElementById("mainGameHomeButton");
let letterButtons;

// main game variables
let currentWord = "";
let revealedWord = "";
let strikes = 0;
const maxStrikes = 10;
let scoreValue = 0;
let highScoreValue = 0;

let wordList = ["one", "two", "three", "four", "five", "six", "seven"]; //these array values are just fallbacks in case fetch for data fails
const alphabet = "abcdefghijklmnopqrstuvwxyz";

let numberOfWordsInPlay;
let newGameSessionStarted = true;

// MAIN GAME INITIALIZATION:

async function initNormalMode(categoryName) {
	goToLoadingScreen();

	await fetch(DATA_URL)
		.then((response) => response.json())
		.then((json) => {
			wordList = json.categories[categoryName];
			capitalizeWordList();
		});

	setTimeout(() => {
		initGame();
		goToMainGame();
	}, 2000);
}

async function initHardcoreMode() {
	goToLoadingScreen();

	await fetch(DATA_URL)
		.then((response) => response.json())
		.then((json) => {
			wordList = json.hardcoreCategories["tenThousand"];
			capitalizeWordList();
		});

	setTimeout(() => {
		initGame();
		goToMainGame();
	}, 2000);
}

// MAIN GAME FUNCTIONS:

function createLetterButtons() {
	for (letterIndex in alphabet) {
		const newLetterButton = document.createElement("button");
		const newLetter = document.createElement("letter");
		newLetterButton.classList.add("letter-button");
		newLetterButton.setAttribute(
			"data-letter",
			alphabet[letterIndex].toUpperCase()
		);
		newLetter.classList.add("letter");
		newLetter.innerText = alphabet[letterIndex].toUpperCase();
		newLetterButton.append(newLetter);
		letterButtonsContainer.append(newLetterButton);
	}

	letterButtons = document.getElementsByClassName("letter-button");
}

function resetHangman() {
	for (let i = 0; i < hangmanLimbs.length; ++i) {
		hangmanLimbs[i].style.display = "none";
	}
}

function resetLetterButtons() {
	for (let i = 0; i < letterButtons.length; ++i) {
		letterButtons[i].classList.remove("letter-button--clicked");
		letterButtons[i].style.pointerEvents = "All";
	}
}

function initNewWord() {
	if (newGameSessionStarted) {
		newGameSessionStarted = false;
		numberOfWordsInPlay = wordList.length;
	}

	const randomNum = Math.floor(Math.random() * numberOfWordsInPlay);
	currentWord = wordList.splice(randomNum, 1)[0];
	wordList.push(currentWord);
	numberOfWordsInPlay--;

	revealedWord = "";

	for (let i = 0; i < currentWord.length; ++i) {
		if (currentWord[i] !== " ") {
			revealedWord += "_";
		} else {
			revealedWord += " ";
		}
	}
	word.innerText = revealedWord;
}

function initGame() {
	newGameSessionStarted = true;
	scoreValue = 0;
	highScoreValue = localStorage.getItem("highScore");
	updateHighScore();
	updateScoreDisplay();
	startGame();
}

function startGame() {
	resetLetterButtons();
	resetHangman();
	initNewWord();
	strikes = 0;
	updateDisplay();
}

function initMainGameEventListeners() {
	for (let i = 0; i < letterButtons.length; ++i) {
		letterButtons[i].addEventListener("click", (event) => {
			event.target.classList.add("letter-button--clicked");
			event.target.style.pointerEvents = "None";
			message.innerText = "";
			letterButtonClicked(event);
		});
	}
}

function letterButtonClicked(event) {
	let letterFound = false;

	letterFound = findLetterInWord(event.target.dataset.letter);

	if (!letterFound) {
		scoreValue - 1 < 0 ? (scoreValue = 0) : scoreValue--;
		strikes++;

		if (strikes < maxStrikes) {
			hangmanLimbs[strikes - 1].style.display = "block";
		} else {
			revealedWord = currentWord;
			wordNotFound();
		}
	} else {
		scoreValue++;
		if (!revealedWord.includes("_")) {
			wordFound();
		}
	}

	updateHighScore();
	updateDisplay();
}

function findLetterInWord(letter) {
	let letterFound = false;

	for (let i = 0; i < currentWord.length; ++i) {
		if (currentWord[i] === letter) {
			letterFound = true;
			revealedWord = setCharAt(revealedWord, i, currentWord[i]);
		}
	}

	return letterFound;
}

function wordFound() {
	updateHighScore();

	message.innerText = `Congratutions! word was ${currentWord.toLowerCase()}`;
	startGame();
}

function wordNotFound() {
	updateHighScore();
	scoreValue = 0;

	message.innerText = `Ouch! word was ${currentWord.toLowerCase()}`;
	startGame();
}

function updateHighScore() {
	if (highScoreValue < scoreValue) {
		highScoreValue = scoreValue;
	}

	localStorage.setItem("highScore", highScoreValue);
}

function updateDisplay() {
	word.innerText = revealedWord;
	updateScoreDisplay();
}

function updateScoreDisplay() {
	score.innerText = scoreValue;
	highScore.innerText = highScoreValue;
}

// GAME NAVIGATION FUNTIONS:

function goToMainMenu() {
	hideAllScreens();
	mainMenuContentContainer.style.display = "flex";
}

function goToCategorySelectionMenu() {
	hideAllScreens();
	categoryMenuContentContainer.style.display = "flex";
}

function goToLoadingScreen() {
	hideAllScreens();
	loadingScreenContentContainer.style.display = "block";
}

function goToMainGame() {
	hideAllScreens();
	mainGameContainer.style.display = "block";
}

// helper functions

function setCharAt(str, index, chr) {
	if (index > str.length - 1) return str;
	return str.substring(0, index) + chr + str.substring(index + 1);
}

function hideAllScreens() {
	for (let i = 0; i < contentContainers.length; ++i) {
		contentContainers[i].style.display = "none";
	}
}

function capitalizeWordList() {
	for (let i = 0; i < wordList.length; ++i) {
		wordList[i] = wordList[i].toUpperCase();
	}
}

// navigation event listeners

normalModeButton.addEventListener("click", goToCategorySelectionMenu);
hardcoreModeButton.addEventListener("click", (event) => {
	initHardcoreMode();
});

for (let i = 0; i < categoryButtons.length; ++i) {
	categoryButtons[i].addEventListener("click", (event) => {
		initNormalMode(event.target.dataset.name);
	});
}

categoryBackButton.addEventListener("click", goToMainMenu);
mainGameHomeButton.addEventListener("click", goToMainMenu);

createLetterButtons();
initMainGameEventListeners();
goToMainMenu();

if (!localStorage.getItem("highScore")) {
	localStorage.setItem("highScore", highScoreValue);
}
