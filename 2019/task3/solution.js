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
  const wires = source.split("\n");

  let shortestDistance = Number.MAX_SAFE_INTEGER;
  let wireOneSet = getSetOfDotsAsStringsFromCommands(wires[0].split(","));

  let currentPoint = { x: 0, y: 0 };
  wires[1].split(",").forEach((c) => {
    let length = parseInt(c.substring(1));
    let modifierX = 0;
    let modifierY = 0;
    if (c[0] === "R") modifierX = 1;
    if (c[0] === "L") modifierX = -1;
    if (c[0] === "U") modifierY = 1;
    if (c[0] === "D") modifierY = -1;

    for (let i = 0; i < length; i++) {
      currentPoint.x += modifierX;
      currentPoint.y += modifierY;
      if (wireOneSet.has(`x:${currentPoint.x},y:${currentPoint.y}`)) {
        shortestDistance = Math.min(getManhattanDistance(0, 0, currentPoint.x, currentPoint.y), shortestDistance);
      }
    }
  });
  return shortestDistance;
};

const getSolutionForPart2 = (source) => {
  return null;
};

const getSetOfDotsAsStringsFromCommands = (listOfCommands) => {
  let currentPoint = { x: 0, y: 0 };
  let pointArray = new Set();

  listOfCommands.forEach((c) => {
    let length = parseInt(c.substring(1));
    let modifierX = 0;
    let modifierY = 0;
    if (c[0] === "R") modifierX = 1;
    if (c[0] === "L") modifierX = -1;
    if (c[0] === "U") modifierY = 1;
    if (c[0] === "D") modifierY = -1;

    for (let i = 0; i < length; i++) {
      currentPoint.x += modifierX;
      currentPoint.y += modifierY;
      pointArray.add(`x:${currentPoint.x},y:${currentPoint.y}`);
    }
  });

  return pointArray;
};

const getManhattanDistance = (x1, x2, y1, y2) => {
  return Math.abs(x1 - y1) + Math.abs(x2 - y2);
};
