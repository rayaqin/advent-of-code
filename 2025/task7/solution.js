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
  const tachyonGrid = source.split("\n").map((line) => line.split(""));

  const emptyChar = ".";
  const splitterChar = "^";
  const sourceChar = "S";
  const tachyonBeamChar = "|";

  let resultObject = {
    tachyonGrid: [],
    splitCount: 0,
  };

  drawTachyonPaths(
    tachyonGrid,
    emptyChar,
    splitterChar,
    sourceChar,
    tachyonBeamChar,
    resultObject
  );

  console.log(resultObject.tachyonGrid);
  return resultObject.splitCount;
};
const getSolutionForPart2 = (source) => {
  const tachyonGridRaw = source.split("\n").map((line) => line.split(""));

  const emptyChar = ".";
  const splitterChar = "^";
  const sourceChar = "S";
  const tachyonBeamChar = "|";

  let resultObject = {
    tachyonGrid: [],
    splitCount: 0,
  };

  drawTachyonPaths(
    tachyonGridRaw,
    emptyChar,
    splitterChar,
    sourceChar,
    tachyonBeamChar,
    resultObject
  );

  const { tachyonGrid } = resultObject;

  tachyonGrid[tachyonGrid.length - 1] = tachyonGrid[tachyonGrid.length - 1].map(
    (c) => (c === tachyonBeamChar ? 1 : c)
  );

  for (let iRow = tachyonGrid.length - 1; iRow > 0; iRow--) {
    for (let iCol = 0; iCol < tachyonGrid[0].length; iCol++) {
      const currentItem = tachyonGrid[iRow][iCol];
      const currentItemIsNumeric = !isNaN(currentItem);

      const above = tachyonGrid[iRow - 1][iCol];

      if (currentItem === splitterChar) {
        continue;
      }

      if (currentItemIsNumeric && above === tachyonBeamChar) {
        tachyonGrid[iRow - 1][iCol] = currentItem;
        continue;
      }

      if (iRow + 1 >= tachyonGrid.length) continue;

      const bottomRight = tachyonGrid[iRow + 1][iCol + 1];
      const bottomLeft = tachyonGrid[iRow + 1][iCol - 1];
      const below = tachyonGrid[iRow + 1][iCol];

      if (currentItem === tachyonBeamChar && below === splitterChar) {
        const sum = bottomLeft + bottomRight;
        tachyonGrid[iRow][iCol] = sum;

        if (above === tachyonBeamChar) tachyonGrid[iRow - 1][iCol] = sum;
      }
    }
  }

  return tachyonGrid;
};

const drawTachyonPaths = (
  tachyonGrid,
  emptyChar,
  splitterChar,
  sourceChar,
  tachyonBeamChar,
  resultObject
) => {
  const resultGrid = tachyonGrid.map((line) => [...line]);
  for (let iRow = 1; iRow < resultGrid.length; iRow++) {
    for (let iCol = 0; iCol < resultGrid[0].length; iCol++) {
      const currentChar = resultGrid[iRow][iCol];
      if (currentChar !== emptyChar) continue;

      const charAbove = resultGrid[iRow - 1][iCol];
      const charBelow =
        iRow + 1 < resultGrid.length ? resultGrid[iRow + 1][iCol] : null;
      const charLeft = iCol - 1 <= 0 ? null : resultGrid[iRow][iCol - 1];
      const charRight = iCol + 1 <= 0 ? null : resultGrid[iRow][iCol + 1];
      const charTopLeft = iCol - 1 <= 0 ? null : resultGrid[iRow - 1][iCol - 1];
      const charTopRight =
        iCol + 1 <= 0 ? null : resultGrid[iRow - 1][iCol + 1];

      if (charAbove === sourceChar || charAbove === tachyonBeamChar) {
        resultGrid[iRow][iCol] = tachyonBeamChar;
        if (charBelow === splitterChar) {
          resultObject.splitCount++;
        }
        continue;
      }

      if (
        (charTopLeft === tachyonBeamChar && charLeft === splitterChar) ||
        (charTopRight === tachyonBeamChar && charRight === splitterChar)
      ) {
        resultGrid[iRow][iCol] = tachyonBeamChar;
        if (charBelow === splitterChar) resultObject.splitCount++;
        continue;
      }
    }
  }
  resultObject.tachyonGrid = resultGrid;
};
