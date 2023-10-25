const lettersContainer = document.getElementById('lettersContainer');
const highScore = document.getElementById('highScore');
const score = document.getElementById('score');
const word = document.getElementById('word');
const hangmanLimbs = document.getElementsByClassName('hangman-limb');

const wordList = ["red", "blue", "orange", "yellow", "purple", "brown", "pink"];

let currentWord = "";
let revealedWord = "";
let strikes = 0;
const maxStrikes = 10;
let scoreValue = 0;
let highScoreValue = 0;

const alphabet = "abcdefghijklmnopqrstuvwxyz";
for (letterIndex in alphabet) {
  const newLetterButton = document.createElement('button');
  const newLetter = document.createElement('letter');
  newLetterButton.classList.add('letter-button');
  newLetterButton.setAttribute('data-letter', alphabet[letterIndex]);
  newLetter.classList.add('letter');
  newLetter.innerText = alphabet[letterIndex].toUpperCase();
  newLetterButton.append(newLetter);
  lettersContainer.append(newLetterButton);
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
  setTimeout(() => { initGame(); updateDisplay(); }, 400);
  ;
}

function wordNotFound() {
  if (highScoreValue < scoreValue) {
    highScoreValue = scoreValue;
  }

  scoreValue = 0;

  setTimeout(() => { alert('You didn\'t guess in time!'); }, 200);
  setTimeout(() => { initGame(); updateDisplay(); }, 400);
}

function updateDisplay() {
  word.innerText = revealedWord;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  score.innerText = `Score: ${scoreValue}`;
  highScore.innerText = `High Score: ${highScoreValue}`;
}

// helper functions

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

const letterButtons = document.getElementsByClassName('letter-button');

initGame();

for (let i = 0; i < letterButtons.length; ++i) {
  letterButtons[i].addEventListener('click', (event) => {
    guessLetter(event);
    event.target.style.display = 'none';
  });
}