if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log("File APIs are supported in your browser, you may proceed.");
} else {
  alert(
    "The File APIs are not fully supported in this browser. The code won't work.",
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
  const { numberOfRows, numberOfColumns, treeObjectGrid } =
    getRelevantDataFromSource(source);

  let visibilityCounter = 0;

  treeObjectGrid.forEach((row) => {
    row.forEach((tree) => {
      setTreeVisibility(tree, treeObjectGrid, numberOfRows, numberOfColumns);
      visibilityCounter += tree.isVisible ? 1 : 0;
    });
  });

  return visibilityCounter;
};

const getSolutionForPart2 = (source) => {
  const { numberOfRows, numberOfColumns, treeObjectGrid } =
    getRelevantDataFromSource(source);

  let highestScenicScore = 0;

  treeObjectGrid.forEach((row) => {
    row.forEach((tree) => {
      setTreeScenicScore(tree, treeObjectGrid, numberOfRows, numberOfColumns);
      highestScenicScore = Math.max(highestScenicScore, tree.scenicScore);
    });
  });

  return highestScenicScore;
};

const setTreeVisibility = (
  tree,
  treeObjectGrid,
  numberOfRows,
  numberOfColumns,
) => {
  if (tree.isOnTheEdge) {
    tree.isVisible = true;
    return tree;
  }

  let up = 1;
  let right = 1;
  let down = 1;
  let left = 1;

  let topCheckDone = false;
  let rightCheckDone = false;
  let bottomCheckDone = false;
  let leftCheckDone = false;

  const currentTreeHeight = treeObjectGrid[tree.y][tree.x].value;

  while (
    !topCheckDone ||
    !rightCheckDone ||
    !bottomCheckDone ||
    !leftCheckDone
  ) {
    if (!topCheckDone) {
      if (treeObjectGrid[tree.y - up][tree.x].value >= currentTreeHeight) {
        topCheckDone = true;
      }
      if (!topCheckDone && tree.y - up === 0) {
        tree.isVisible = true;
        break;
      }
      up++;
    }
    if (!rightCheckDone) {
      if (treeObjectGrid[tree.y][tree.x + right].value >= currentTreeHeight) {
        rightCheckDone = true;
      }
      if (!rightCheckDone && tree.x + right === numberOfColumns - 1) {
        tree.isVisible = true;
        break;
      }
      right++;
    }
    if (!bottomCheckDone) {
      if (treeObjectGrid[tree.y + down][tree.x].value >= currentTreeHeight) {
        bottomCheckDone = true;
      }
      if (!bottomCheckDone && tree.y + down === numberOfRows - 1) {
        tree.isVisible = true;
        break;
      }
      down++;
    }
    if (!leftCheckDone) {
      if (treeObjectGrid[tree.y][tree.x - left].value >= currentTreeHeight) {
        leftCheckDone = true;
      }
      if (!leftCheckDone && tree.x - left === 0) {
        tree.isVisible = true;
        break;
      }
      left++;
    }
  }

  return tree;
};

const setTreeScenicScore = (
  tree,
  treeObjectGrid,
  numberOfRows,
  numberOfColumns,
) => {
  if (tree.isOnTheEdge) {
    tree.scenicScore = 0;
    return tree;
  }

  let up = 1;
  let right = 1;
  let down = 1;
  let left = 1;

  let topCheckDone = false;
  let rightCheckDone = false;
  let bottomCheckDone = false;
  let leftCheckDone = false;

  const currentTreeHeight = treeObjectGrid[tree.y][tree.x].value;

  while (
    !topCheckDone ||
    !rightCheckDone ||
    !bottomCheckDone ||
    !leftCheckDone
  ) {
    if (!topCheckDone) {
      if (
        treeObjectGrid[tree.y - up][tree.x].value >= currentTreeHeight ||
        tree.y - up === 0
      ) {
        debugger;
        topCheckDone = true;
      } else {
        up++;
      }
    }
    if (!rightCheckDone) {
      if (
        treeObjectGrid[tree.y][tree.x + right].value >= currentTreeHeight ||
        tree.x + right === numberOfColumns - 1
      ) {
        rightCheckDone = true;
      } else {
        right++;
      }
    }
    if (!bottomCheckDone) {
      if (
        treeObjectGrid[tree.y + down][tree.x].value >= currentTreeHeight ||
        tree.y + down === numberOfRows - 1
      ) {
        bottomCheckDone = true;
      } else {
        down++;
      }
    }
    if (!leftCheckDone) {
      if (
        treeObjectGrid[tree.y][tree.x - left].value >= currentTreeHeight ||
        tree.x - left === 0
      ) {
        leftCheckDone = true;
      } else {
        left++;
      }
    }
  }

  tree.scenicScore = up * right * down * left;

  return tree;
};

const getRelevantDataFromSource = (source) => {
  const numberOfRows = source.split("\r\n").length;
  const numberOfColumns = source.split("\r\n")[0].split("").length;

  const treeObjectGrid = source.split("\r\n").map((row, rowIndex) =>
    row.split("").map((a, columnIndex) => ({
      value: parseInt(a),
      x: columnIndex,
      y: rowIndex,
      isOnTheEdge:
        columnIndex === 0 ||
        rowIndex === 0 ||
        columnIndex === numberOfColumns - 1 ||
        rowIndex === numberOfRows - 1,
      isVisible: undefined,
      scenicScore: undefined,
    })),
  );

  return {
    numberOfRows,
    numberOfColumns,
    treeObjectGrid,
  };
};
