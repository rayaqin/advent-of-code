if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log("File APIs are supported in your browser, you may proceed.");
} else {
  alert("The File APIs are not fully supported in this browser. The code won't work.");
}

const chooseFile = document.getElementById("choose-file");
const inputLabel = document.getElementById("input-label");
const partSelection = document.getElementById("part-selection");
const messageToUser = document.getElementById("message-to-user");
let fileContent;

const handleFileSelect = (event) => {
  const reader = new FileReader();
  reader.readAsText(event.target.files[0]);
  reader.onload = (e) => {
    fileContent = e.target.result;
    addPartSelectionButtons();
  };
};

chooseFile.addEventListener("change", handleFileSelect, false);

const writeMessageToUser = (message) => {
  messageToUser.classList.contains("invisible") || messageToUser.classList.add("invisible");
  messageToUser.innerHTML = message;
  setTimeout(() => {
    messageToUser.classList.remove("invisible");
  }, 2000);
};

const addPartSelectionButtons = () => {
  partSelection.style.visibility = "visible";
  writeMessageToUser("select which part's result you'd like to see");
};

const solveSelectedPart = (partId) => {
  writeMessageToUser("check the console");
  const solution = partId === 1 ? getSolutionForPart1(fileContent) : getSolutionForPart2(fileContent);
  console.log(`Solution for part ${partId}:`, solution);
};

const getSolutionForPart1 = (source) => {
  return source.split("\r\n")
    .map(card => ({
      winning: new Set(card.split('|')[0].split(':')[1].split(' ').filter(n => n !== '').map(Number)),
      drawn: card.split('|')[1].split(' ').filter(n => n !== '').map(Number)
    }))
    .map(card => card.drawn.reduce((powerOfTwo, number) => card.winning.has(number) ? powerOfTwo + 1 : powerOfTwo, -1))
    .filter(powerOfTwo => powerOfTwo >= 0)
    .map(powerOfTwo => Math.pow(2, powerOfTwo))
    .reduce((sumOfPoints, cardPoints) => sumOfPoints + cardPoints);

};

const getSolutionForPart2 = (source) => {
  const cards = source.split("\r\n")
    .map(card => ({
      cardNumber: parseInt(card.split(':')[0].split('').filter(ch => /\d/.test(ch)).join('')),
      winning: new Set(card.split('|')[0].split(':')[1].split(' ').filter(n => n !== '').map(Number)),
      drawn: card.split('|')[1].split(' ').filter(n => n !== '').map(Number),
      quantity: 1
    }))
    .map(card => ({
      ...card,
      cardsWon: card.drawn.reduce((cardsWon, num) => card.winning.has(num) ? cardsWon + 1 : cardsWon, 0),
    }));


  for (let i = 0; i < cards.length; i++) {
    getWonCardNumbers(cards[i].cardNumber, cards[i].cardsWon)
      .forEach(wonCardNumber => cards[wonCardNumber - 1].quantity += cards[i].quantity)
  }

  return cards.reduce((allCards, card) => allCards + card.quantity, 0)

}

function getWonCardNumbers(cardNumber, cardsWon) {
  let wonCardNumbers = [];
  for (let i = 1; i <= cardsWon; i++) {
    wonCardNumbers.push(cardNumber + i);
  }
  return wonCardNumbers;
}