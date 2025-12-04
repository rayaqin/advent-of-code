if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log("File APIs are supported in your browser, you may proceed.");
} else {
  alert(
    "The File APIs are not fully supported in this browser. The code won't work."
  );
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
  messageToUser.classList.contains("invisible") ||
    messageToUser.classList.add("invisible");
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
  const solution =
    partId === 1
      ? getSolutionForPart1(fileContent)
      : getSolutionForPart2(fileContent);
  console.log(`Solution for part ${partId}:`, solution);
};

const getSolutionForPart1 = (source) => {
  const paperRollGrid = source
    .split("\n")
    .map((paperRollRow) => paperRollRow.split(""));
  const paperRollMark = "@";
  const possible2DGridSteps = [...getCartesianProductForGridSteps(2, [])];

  let accessiblePaperRollsCount = 0;

  for (let iRow = 0; iRow < paperRollGrid.length; iRow++) {
    for (let iColumn = 0; iColumn < paperRollGrid[iRow].length; iColumn++) {
      let adjacentPaperRollCount = 0;
      if (paperRollGrid[iRow][iColumn] !== paperRollMark) {
        continue;
      }
      for (let gridStep of possible2DGridSteps) {
        const [stepX, stepY] = gridStep;
        if (stepX === 0 && stepY === 0) continue;
        const targetX = iColumn + stepX;
        const targetY = iRow + stepY;
        if (
          targetY >= 0 &&
          targetY < paperRollGrid[iRow].length &&
          targetX >= 0 &&
          targetX < paperRollGrid.length
        ) {
          const adjacentSpotValue = paperRollGrid[targetY][targetX];
          if (adjacentSpotValue === paperRollMark) {
            adjacentPaperRollCount++;
          }
        }
      }
      if (adjacentPaperRollCount < 4) {
        accessiblePaperRollsCount++;
      }
    }
  }

  return accessiblePaperRollsCount;
};
const getSolutionForPart2 = (source) => {
  const paperRollGrid = source
    .split("\n")
    .map((paperRollRow) => paperRollRow.split(""));
  const paperRollMark = "@";
  const pickedUpPaperRollMark = "x";
  const possible2DGridSteps = [...getCartesianProductForGridSteps(2, [])];

  let accessiblePaperRolls = [];
  let accessiblePaperRollsThisRound = 0;

  do {
    accessiblePaperRollsThisRound = 0;
    for (let iRow = 0; iRow < paperRollGrid.length; iRow++) {
      for (let iColumn = 0; iColumn < paperRollGrid[iRow].length; iColumn++) {
        let adjacentPaperRollCount = 0;
        if (paperRollGrid[iRow][iColumn] !== paperRollMark) {
          continue;
        }
        for (let gridStep of possible2DGridSteps) {
          const [stepX, stepY] = gridStep;
          if (stepX === 0 && stepY === 0) continue;
          const targetX = iColumn + stepX;
          const targetY = iRow + stepY;
          if (
            targetY >= 0 &&
            targetY < paperRollGrid[iRow].length &&
            targetX >= 0 &&
            targetX < paperRollGrid.length
          ) {
            const adjacentSpotValue = paperRollGrid[targetY][targetX];
            if (adjacentSpotValue === paperRollMark) {
              adjacentPaperRollCount++;
            }
          }
        }
        if (adjacentPaperRollCount < 4) {
          accessiblePaperRollsThisRound++;
          accessiblePaperRolls.push([iRow, iColumn]);
        }
      }
    }
    for (let accessiblePaperRoll of accessiblePaperRolls) {
      const [y, x] = accessiblePaperRoll;
      paperRollGrid[y][x] = pickedUpPaperRollMark;
    }
  } while (accessiblePaperRollsThisRound !== 0);

  return accessiblePaperRolls.length;
};

function* getCartesianProductForGridSteps(n, current = []) {
  if (current.length === n) {
    yield current;
    return;
  }
  for (const item of [0, 1, -1]) {
    yield* getCartesianProductForGridSteps(n, [...current, item]);
  }
}
