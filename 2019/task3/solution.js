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
  const wires = source.split("\r\n");
  const wireOneDotsMap = getMapOfDotsFromCommands(wires[0].split(","));
  const wireTwoDotsMap = getMapOfDotsFromCommands(wires[1].split(","));

  const intersections = getIntersections(wireOneDotsMap, wireTwoDotsMap);

  const closestIntersectionDistance = Object.keys(intersections).reduce(
    (acc, currentKey) => Math.min(getManhattanDistance(0, 0, intersections[currentKey].x, intersections[currentKey].y), acc),
    Number.MAX_SAFE_INTEGER
  );

  return closestIntersectionDistance;
};

const getSolutionForPart2 = (source) => {
  const wires = source.split("\r\n");
  const wireCommandsOne = wires[0].split(",");
  const wireCommandsTwo = wires[1].split(",");
  const wireOneDotsMap = getMapOfDotsFromCommands(wireCommandsOne);
  const wireTwoDotsMap = getMapOfDotsFromCommands(wireCommandsTwo);

  const intersections = getIntersections(wireOneDotsMap, wireTwoDotsMap);

  const closestIntersectionStepsDistance = Object.keys(intersections).reduce((acc, currentKey) => {
    let combinedStepsNeeded =
      getStepsToIntersection(wireCommandsOne, intersections[currentKey]) +
      getStepsToIntersection(wireCommandsTwo, intersections[currentKey]);

    return combinedStepsNeeded < acc ? combinedStepsNeeded : acc;
  }, Number.MAX_SAFE_INTEGER);

  return closestIntersectionStepsDistance;
};

const getStepsToIntersection = (listOfCommands, intersection) => {
  let currentPoint = { x: 0, y: 0 };

  let steps = 0;

  for (let i = 0; i < listOfCommands.length; i++) {
    let length = parseInt(listOfCommands[i].substring(1));
    let modifierX = 0;
    let modifierY = 0;
    if (listOfCommands[i][0] === "R") modifierX = 1;
    if (listOfCommands[i][0] === "L") modifierX = -1;
    if (listOfCommands[i][0] === "U") modifierY = 1;
    if (listOfCommands[i][0] === "D") modifierY = -1;

    for (let i = 0; i < length; i++) {
      currentPoint.x += modifierX;
      currentPoint.y += modifierY;
      steps++;
      if (currentPoint.x === intersection.x && currentPoint.y === intersection.y) {
        return steps;
      }
    }
  }
};

const getMapOfDotsFromCommands = (listOfCommands) => {
  let currentPoint = { x: 0, y: 0 };
  let pointMap = {};

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
      pointMap[`x:${currentPoint.x},y:${currentPoint.y}`] = {
        x: currentPoint.x,
        y: currentPoint.y,
      };
    }
  });

  return pointMap;
};

const getIntersections = (mapOne, mapTwo) => {
  const intersections = {};
  Object.keys(mapOne).forEach((key) => (mapTwo[key] ? (intersections[key] = mapOne[key]) : null));
  return intersections;
};

const getManhattanDistance = (x1, x2, y1, y2) => {
  return Math.abs(x1 - y1) + Math.abs(x2 - y2);
};
