// general elements
const contentContainers = document.getElementsByClassName('js-content-container');

// main menu elements
const mainMenuContentContainer = document.getElementById('mainMenuContentContainer');
const normalModeButton = document.getElementById('normalModeButton');
const hardcoreModeButton = document.getElementById('hardcoreModeButton');

// category menu elements
const categoryMenuContentContainer = document.getElementById('categoryMenuContentContainer');
const categoryButtons = document.getElementsByClassName('js-category-button');

//loading screen element
const loadingScreenContentContainer = document.getElementById('loadingScreenContentContainer');

// main game elements
const mainGameContainer = document.getElementById('mainGameContainer');
const letterButtonsContainer = document.getElementById('letterButtonsContainer');
const highScore = document.getElementById('highScore');
const score = document.getElementById('score');
const word = document.getElementById('word');
const hangmanLimbs = document.getElementsByClassName('hangman-limb');

// main game variables
let currentWord = "";
let revealedWord = "";
let strikes = 0;
const maxStrikes = 10;
let scoreValue = 0;
let highScoreValue = 0;

const wordList = ["red", "blue", "orange", "yellow", "purple", "brown", "pink"]; //these array values are just fallbacks in case fetch for data fails
const alphabet = "abcdefghijklmnopqrstuvwxyz";


// MAIN GAME FUNCTIONS:

function createLetterButtons() {
  for (letterIndex in alphabet) {
    const newLetterButton = document.createElement('button');
    const newLetter = document.createElement('letter');
    newLetterButton.classList.add('letter-button');
    newLetterButton.setAttribute('data-letter', alphabet[letterIndex]);
    newLetter.classList.add('letter');
    newLetter.innerText = alphabet[letterIndex].toUpperCase();
    newLetterButton.append(newLetter);
    letterButtonsContainer.append(newLetterButton);
  }
}

function resetHangman() {
  for (let i = 0; i < hangmanLimbs.length; ++i) {
    hangmanLimbs[i].style.display = 'none';
  }
}

function resetLetterButtons() {
  for (let i = 0; i < letterButtons.length; ++i) {
    letterButtons[i].style.display = 'block';
  }
}

function initNewWord() {
  const randomNum = Math.floor(Math.random() * wordList.length);
  currentWord = wordList[randomNum];
  revealedWord = "";
  for (let i = 0; i < currentWord.length; ++i) {
    revealedWord += "_";
  }
  word.innerText = revealedWord;
}

function initGame() {
  createLetterButtons();
  startGame();
}

function startGame() {
  resetLetterButtons();
  resetHangman();
  initNewWord();
  strikes = 0;
}

function guessLetter(event) {
  let letterFound = false;

  for (let i = 0; i < currentWord.length; ++i) {

    if (currentWord[i] === event.target.dataset.letter) {
      letterFound = true;
      revealedWord = setCharAt(revealedWord, i, currentWord[i]);
    }
  }

  updateDisplay();

  if (!letterFound) {
    strikes++;
    hangmanLimbs[strikes - 1].style.display = 'block';
  }
  else {
    if (!revealedWord.includes('_')) {
      wordFound()
    }
  }

  if (strikes >= maxStrikes) {
    revealedWord = currentWord;
    updateDisplay();
    wordNotFound();
  }
}

function wordFound() {
  scoreValue++;
  if (highScoreValue < scoreValue) {
    highScoreValue = scoreValue;
  }

  setTimeout(() => { alert('Congratulations! You found the word!'); }, 200);
  setTimeout(() => { startGame(); updateDisplay(); }, 400);
  ;
}

function wordNotFound() {
  if (highScoreValue < scoreValue) {
    highScoreValue = scoreValue;
  }

  scoreValue = 0;

  setTimeout(() => { alert('You didn\'t guess in time!'); }, 200);
  setTimeout(() => { startGame(); updateDisplay(); }, 400);
}

function updateDisplay() {
  word.innerText = revealedWord;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  score.innerText = `Score: ${scoreValue}`;
  highScore.innerText = `High Score: ${highScoreValue}`;
}

// GAME NAVIGATION FUNTIONS:

function goToMainMenu() {
  hideAllScreens();
  mainMenuContentContainer.style.visibility = 'visible';
}

function goToCategorySelectionMenu() {
  hideAllScreens();
  categoryMenuContentContainer.style.visibility = 'visible';
}

function goToLoadingScreen() {
  hideAllScreens();
  loadingScreenContentContainer.style.visibility = 'visible';
  console.log('loading screen on');
}

function goToMainGame() {
  hideAllScreens();
  mainGameContainer.style.visibility = 'visible';
}

// helper functions

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

function hideAllScreens() {
  for (let i = 0; i < contentContainers.length; ++i) {
    contentContainers[i].style.visibility = 'hidden';
  }
}

const letterButtons = document.getElementsByClassName('letter-button');

startGame();

// main game event listeners

for (let i = 0; i < letterButtons.length; ++i) {
  letterButtons[i].addEventListener('click', (event) => {
    guessLetter(event);
    event.target.style.display = 'none';
  });
}

// navigation event listeners

normalModeButton.addEventListener('click', goToCategorySelectionMenu);
hardcoreModeButton.addEventListener('click', (event) => {
  goToLoadingScreen();
  setTimeout(goToMainGame, 3000);
});

for (let i = 0; i < categoryButtons.length; ++i) {
  categoryButtons[i].addEventListener('click', (event) => {
    goToLoadingScreen();
    setTimeout(goToMainGame, 3000);
  });
}