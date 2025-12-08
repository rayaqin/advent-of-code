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
  const tachyonGrid = source.split("\n").map((line) => line.split(""));

  const emptyChar = ".";
  const splitterChar = "^";
  const sourceChar = "S";
  const tachyonBeamChar = "|";

  // const rootNodeRow = 0;
  // const rootNodeCol = tachyonGrid[0].findIndex((c) => c === sourceChar);

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

  // const rootNode = {
  //   gridRow: rootNodeRow,
  //   gridCol: rootNodeCol,
  //   setKey: `${rootNodeRow}-${rootNodeCol}`,
  //   value: sourceChar,
  //   children: [],
  // };

  // const nodeMap = { [rootNode.setKey]: rootNode };

  // buildTree(
  //   rootNode,
  //   resultObject.tachyonGrid,
  //   nodeMap,
  //   tachyonBeamChar,
  //   splitterChar
  // );

  // console.log("nodeMap: ", nodeMap);
  // console.log("rootNode: ", rootNode);

  // debugger;
  // return depthFirstSearchForTotalPathCount(rootNode);
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
  for (let iRow = 1; iRow < resultGrid.length - 1; iRow++) {
    for (let iCol = 0; iCol < resultGrid[0].length; iCol++) {
      const currentChar = resultGrid[iRow][iCol];
      if (currentChar !== emptyChar) continue;

      const charAbove = resultGrid[iRow - 1][iCol];
      const charBelow = resultGrid[iRow + 1][iCol];
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

function depthFirstSearchForTotalPathCount(node) {
  if (node.children.length === 0) {
    return 1; // leaf
  }
  let totalPathCount = 0;
  for (const child of node.children) {
    totalPathCount += depthFirstSearchForTotalPathCount(child);
  }
  return totalPathCount;
}

const buildTree = (
  currentNode,
  tachyonGrid,
  nodeMap,
  tachyonBeamChar,
  splitterChar
) => {
  let currIRow = currentNode.gridRow + 1;
  if (currIRow >= tachyonGrid.length) return;

  let charBelow = tachyonGrid[currIRow][currentNode.gridCol];
  while (charBelow === tachyonBeamChar) {
    currIRow++;
    charBelow = tachyonGrid[currIRow][currentNode.gridCol];
  }

  if (charBelow === splitterChar) {
    const leftRow = currIRow;
    const leftCol = currentNode.gridCol - 1;
    const leftSetKey = `${currIRow}-${leftCol}`;

    const leftChild = nodeMap[leftSetKey] ?? {
      gridRow: leftRow,
      gridCol: leftCol,
      setKey: leftSetKey,
      value: tachyonBeamChar,
      children: [],
    };

    buildTree(leftChild, tachyonGrid, nodeMap, tachyonBeamChar, splitterChar);
    currentNode.children.push(leftChild);
    nodeMap[leftSetKey] = leftChild;

    const rightRow = currIRow;
    const rightCol = currentNode.gridCol + 1;
    const rightSetKey = `${currIRow}-${rightCol}`;

    const rightChild = nodeMap[rightSetKey] ?? {
      gridRow: rightRow,
      gridCol: rightCol,
      setKey: rightSetKey,
      value: tachyonBeamChar,
      children: [],
    };

    buildTree(rightChild, tachyonGrid, nodeMap, tachyonBeamChar, splitterChar);
    currentNode.children.push(rightChild);
    nodeMap[rightSetKey] = rightChild;

    return;
  }

  return;
};
