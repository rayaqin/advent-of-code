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

const typeToValueMap = {
  'fiveOfAKind': 7,
  'fourOfAKind': 6,
  'fullHouse': 5,
  'threeOfAKind': 4,
  'twoPairs': 3,
  'onePair': 2,
  'highCard': 1,
}

const getSolutionForPart1 = (source) => {


  const hands = source.split("\r\n")
    .map(line => /(?<cards>^[\w]+)(?: )(?<bid>\d+)/g.exec(line).groups)
    .map(hand => ({
      cards: hand.cards,
      bid: parseInt(hand.bid),
      typeValue: typeToValueMap[getTypeFromCards(hand.cards)]
    }))
    .sort((handA, handB) => isHandABetter(handA, handB))
    .map((hand, index) => ({ ...hand, rank: index + 1 }));

  return hands.reduce((totalWinnings, currentHand) => totalWinnings + (currentHand.bid * currentHand.rank), 0);
};

const getSolutionForPart2 = (source) => {
  const hands = source.split("\r\n")
    .map(line => /(?<cards>^[\w]+)(?: )(?<bid>\d+)/g.exec(line).groups)
    .map(hand => ({
      cards: hand.cards,
      bid: parseInt(hand.bid),
      typeValue: typeToValueMap[getTypeFromCards(hand.cards, true)]
    }))
    .sort((handA, handB) => isHandABetter(handA, handB, true))
    .map((hand, index) => ({ ...hand, rank: index + 1 }));

  return hands.reduce((totalWinnings, currentHand) => totalWinnings + (currentHand.bid * currentHand.rank), 0);
}

const getTypeFromCards = (cards, jokersExist) => {


  /*
  Gather frequency for each card into a map
  */
  const charToCountMap = new Map();
  let keyToHighestCount = null;
  for (let i = 0; i < cards.length; i++) {
    if (charToCountMap.has(cards[i])) {
      charToCountMap.set(cards[i], charToCountMap.get(cards[i]) + 1);
    } else {
      charToCountMap.set(cards[i], 1);
    }

    if (jokersExist) {
      /*
       Keep track of which non-Joker card occurs the most
      */
      if (cards[i] !== 'J' && (!keyToHighestCount || charToCountMap.get(cards[i]) > charToCountMap.get(keyToHighestCount))) {
        keyToHighestCount = cards[i];
      }
    }
  }

  if (jokersExist) {
    /*
      Add the number of Joker cards to the count of the most frequent card
    */
    if (charToCountMap.has('J')) {
      // If all five cards are Jokers, the key is still null
      if (!keyToHighestCount) return 'fiveOfAKind';

      charToCountMap.set(keyToHighestCount, charToCountMap.get(keyToHighestCount) + charToCountMap.get('J'));
      charToCountMap.set('J', 0);
    }
  }

  const countsArray = Array.from(charToCountMap.values());

  if (countsArray.includes(5)) return 'fiveOfAKind';
  if (countsArray.includes(4)) return 'fourOfAKind';
  if (countsArray.includes(3) && countsArray.includes(2)) return 'fullHouse';
  if (countsArray.includes(3)) return 'threeOfAKind';
  if (countsArray.filter(n => n === 2).length === 2) return 'twoPairs';
  if (countsArray.includes(2)) return 'onePair';
  return 'highCard';
}

const isHandABetter = (handA, handB, jokersExist) => {

  const cardToValueMap = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': jokersExist ? 1 : 11,
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
  }

  if (handA.typeValue > handB.typeValue) return 1;
  if (handA.typeValue < handB.typeValue) return -1;

  for (let i = 0; i < 5; i++) {
    if (cardToValueMap[handA.cards[i]] > cardToValueMap[handB.cards[i]]) return 1;
    if (cardToValueMap[handA.cards[i]] < cardToValueMap[handB.cards[i]]) return -1;
  }

  throw "something went wrong, same hands?"
}