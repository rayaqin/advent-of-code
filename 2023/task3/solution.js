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
  const schematrix = source.split("\r\n").map(line => line.split(''));
  let sum = 0;

  for (let x = 0; x < schematrix.length; x++) {
    for (let y = 0; y < schematrix[0].length; y++) {
      if (/\d/.test((schematrix[x][y]))) {
        let numberString = getNumData(x, y, schematrix[x]).digits;
        const adjacentMatrix = getNumAdjacentMatrix(schematrix, x, y, numberString.length);
        if (doesMatrixContainSymbol(adjacentMatrix)) {
          sum += parseInt(numberString);
        };
        y += numberString.length - 1;
      }
    }
  }

  return sum;

};

const getSolutionForPart2 = (source) => {
  const schematrix = source.split("\r\n").map(line => line.split(''));
  const numDataMap = new Map();
  const starMap = new Map();

  for (let x = 0; x < schematrix.length; x++) {
    for (let y = 0; y < schematrix[0].length; y++) {

      // fill up numDataMap
      if (/\d/.test((schematrix[x][y]))) {
        const numData = getNumData(x, y, schematrix[x]);
        numDataMap.set(numData.indexKey, { ...numData });
        y += numData.digits.length - 1;
        continue;
      }

      // fill up starMap
      if (schematrix[x][y] === '*') {
        starMap.set(`${x};${y}`, { x: x, y: y, partNumbers: [] });
      }
    }
  }

  // set partNumbers for all stars
  for (let currentStar of starMap.values()) {
    for (let currentNum of numDataMap.values()) {
      if (isInVicinity(currentStar, currentNum)) {
        currentStar.partNumbers.push(parseInt(currentNum.digits));
      }
    }
  }

  // determine which stars are gears, then calculate gear ratios and their sum
  let gearRatioSum = 0;
  for (let currentStar of starMap.values()) {
    if (currentStar.partNumbers.length === 2) {
      gearRatioSum += currentStar.partNumbers[0] * currentStar.partNumbers[1];
    }
  }

  return gearRatioSum;

};

/*
  From the start index of the number, the line the number is in, and the index of the
  line in the matrix, this function searches for the end of the number within the line
  and then returns an object with all the information.
*/
const getNumData = (x, y, line) => {
  let currentIndex = y;
  let digits = '';
  while (/\d/.test(line[currentIndex]) && currentIndex < line.length) {
    digits += line[currentIndex];
    currentIndex++;
  }
  return {
    indexKey: `${x};${y}-${currentIndex - 1}`,
    x: x,
    yLow: y,
    yHigh: currentIndex - 1,
    digits: digits,
  };
}

/*
  Based on the number's length and position within the line, this
  function returns a submatrix of the fullmatrix, that contains
  the fields right next to the number in all directions.
*/
const getNumAdjacentMatrix = (fullMatrix, startIndexX, startIndexY, length) => {
  return fullMatrix
    .filter((line, lineIndex) => Math.abs(lineIndex - startIndexX) <= 1)
    .map(line => line.filter((ch, chIndex) => (chIndex >= startIndexY - 1) && (chIndex <= startIndexY + length)))
}

const doesMatrixContainSymbol = (matrix) => {
  return matrix
    .map(line => !!line.filter(ch => isSymbol(ch)).length)
    .reduce((acc, curr) => acc || curr, false)
}

const isSymbol = (char) => char !== '.' && !/\d/.test(char);

/*
Checks if the position of '*' is at most 1 distance
away from at least one of the fields in which currentNum
has a digit.
*/
const isInVicinity = (currentStar, currentNum) =>
  Math.abs(currentStar.x - currentNum.x) <= 1 &&
  (Math.abs(currentStar.y - currentNum.yLow) <= 1 ||
    Math.abs(currentStar.y - currentNum.yHigh) <= 1 ||
    (currentNum.yLow <= currentStar.y && currentStar.y <= currentNum.yHigh));

