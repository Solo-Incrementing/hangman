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
let letterButtons;

// main game variables
let currentWord = "";
let revealedWord = "";
let strikes = 0;
const maxStrikes = 10;
let scoreValue = 0;
let highScoreValue = 0;

let wordList = ["red", "blue", "orange", "yellow", "purple", "brown", "pink"]; //these array values are just fallbacks in case fetch for data fails
const alphabet = "abcdefghijklmnopqrstuvwxyz";


// MAIN GAME INITIALIZATION:

async function initNormalMode(categoryName) {
  console.log('loading screen active');
  goToLoadingScreen();
  await fetch('../hangman-data.json')
    .then((response) => response.json())
    .then((json) => {
      wordList = json.categories[categoryName];
      capitalizeWordList();
    });
  console.log('category list loaded, initiliazing game');
  initGame();
  console.log('main game screen active');
  goToMainGame();
}

// MAIN GAME FUNCTIONS:

function createLetterButtons() {
  for (letterIndex in alphabet) {
    const newLetterButton = document.createElement('button');
    const newLetter = document.createElement('letter');
    newLetterButton.classList.add('letter-button');
    newLetterButton.setAttribute('data-letter', alphabet[letterIndex].toUpperCase());
    newLetter.classList.add('letter');
    newLetter.innerText = alphabet[letterIndex].toUpperCase();
    newLetterButton.append(newLetter);
    letterButtonsContainer.append(newLetterButton);
  }

  letterButtons = document.getElementsByClassName('letter-button');
}

function resetHangman() {
  for (let i = 0; i < hangmanLimbs.length; ++i) {
    hangmanLimbs[i].style.display = 'none';
  }
}

function resetLetterButtons() {
  for (let i = 0; i < letterButtons.length; ++i) {
    letterButtons[i].style.display = 'flex';
  }
}

function initNewWord() {
  const randomNum = Math.floor(Math.random() * wordList.length);
  currentWord = wordList[randomNum];
  revealedWord = "";
  for (let i = 0; i < currentWord.length; ++i) {
    if (currentWord[i] !== " ") {
      revealedWord += "_";
    }
    else {
      revealedWord += " ";
    }
  }
  word.innerText = revealedWord;
}

function initGame() {
  createLetterButtons();
  initMainGameEventListeners();
  startGame();
}

function startGame() {
  resetLetterButtons();
  resetHangman();
  initNewWord();
  strikes = 0;
}

function initMainGameEventListeners() {
  for (let i = 0; i < letterButtons.length; ++i) {
    letterButtons[i].addEventListener('click', (event) => {
      console.log('letter button clicked');
      letterButtonClicked(event);
      event.target.style.display = 'none';
    });
  }
}

function letterButtonClicked(event) {
  let letterFound = false;

  letterFound = findLetterInWord(event.target.dataset.letter);

  if (!letterFound) {
    strikes++;
    hangmanLimbs[strikes - 1].style.display = 'block';

    if (strikes >= maxStrikes) {
      revealedWord = currentWord;
      updateDisplay();
      wordNotFound();
    }
  }
  else {
    if (!revealedWord.includes('_')) {
      wordFound()
    }
  }
}

function findLetterInWord(letter) {
  let letterFound = false;

  for (let i = 0; i < currentWord.length; ++i) {

    if (currentWord[i] === event.target.dataset.letter) {
      letterFound = true;
      revealedWord = setCharAt(revealedWord, i, currentWord[i]);
    }
  }

  return letterFound;
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
  mainMenuContentContainer.style.display = 'block';
}

function goToCategorySelectionMenu() {
  hideAllScreens();
  categoryMenuContentContainer.style.display = 'block';
}

function goToLoadingScreen() {
  hideAllScreens();
  loadingScreenContentContainer.style.display = 'block';
}

function goToMainGame() {
  hideAllScreens();
  mainGameContainer.style.display = 'block';
}

// helper functions

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

function hideAllScreens() {
  for (let i = 0; i < contentContainers.length; ++i) {
    contentContainers[i].style.display = 'none';
  }
}

function capitalizeWordList() {
  for (let i = 0; i < wordList.length; ++i) {
    wordList[i] = wordList[i].toUpperCase();
  }
}

// navigation event listeners

normalModeButton.addEventListener('click', goToCategorySelectionMenu);
hardcoreModeButton.addEventListener('click', (event) => {
  goToLoadingScreen();
  setTimeout(goToMainGame, 3000);
});

for (let i = 0; i < categoryButtons.length; ++i) {
  categoryButtons[i].addEventListener('click', (event) => {
    initNormalMode(event.target.dataset.name);
  });
}