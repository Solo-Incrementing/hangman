const alphabet = "BCDEFGHIJKLMNOPQRSTUVWXYZ";
const lettersContainer = document.getElementById('lettersContainer');

for (letterIndex in alphabet) {
  const newLetterButton = document.createElement('button');
  const newLetter = document.createElement('letter');
  newLetterButton.classList.add('letter-button');
  newLetter.classList.add('letter');
  newLetter.innerText = alphabet[letterIndex];
  newLetterButton.append(newLetter);
  lettersContainer.append(newLetterButton);
}