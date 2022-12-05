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
  const wires = source.split("\n");

  let minimumSignalDelay = Number.MAX_SAFE_INTEGER;
  const wirePathSetOne = getSetOfDotsAsStringsFromCommands(wires[0].split(","));
  const wirePathSetTwo = getSetOfDotsAsStringsFromCommands(wires[1].split(","));
  const wirePathOne = getPathArrayOfDotsAsStringsFromCommands(wires[0].split(","));
  const wirePathTwo = getPathArrayOfDotsAsStringsFromCommands(wires[1].split(","));
  const intersections = getIntersections(wirePathSetOne, wirePathSetTwo);

  for (let i = 0; i < intersections.length; i++) {
    minimumSignalDelay = Math.min(
      getNumberOfStepsNeededUpToIntersection(intersections[i], wirePathOne, wirePathTwo),
      minimumSignalDelay
    );
  }
  return minimumSignalDelay;
};

const getIntersections = (setOne, setTwo) => {
  const intersections = [];
  setOne.forEach((point) => {
    if (setTwo.has(point)) {
      intersections.push(point);
    }
  });
  return intersections;
};

const getNumberOfStepsNeededUpToIntersection = (point, pathOne, pathTwo) => {
  let pointsVisitedMapOne = new Map();
  let pointsVisitedMapTwo = new Map();
  let stepsOfOne = 0;
  let stepsOfTwo = 0;
  for (let i = 0; i < pathOne.length; i++) {
    if (pathOne[i] === point) {
      stepsOfOne++;
      break;
    }
    if (!pointsVisitedMapOne.get(pathOne[i])) {
      stepsOfOne++;
      pointsVisitedMapOne.set(pathOne[i], stepsOfOne);
    } else {
      stepsOfOne = pointsVisitedMapOne.get(pathOne[i]);
    }
  }
  for (let i = 0; i < pathTwo.length; i++) {
    if (pathTwo[i] === point) {
      stepsOfTwo++;
      break;
    }
    if (!pointsVisitedMapTwo.get(pathTwo[i])) {
      pointsVisitedMapTwo.set(pathTwo[i], stepsOfTwo);
      stepsOfTwo++;
    } else {
      stepsOfTwo = pointsVisitedMapTwo.get(pathTwo[i]);
    }
  }
  console.log("steps to this intersection: ", stepsOfOne + stepsOfTwo);
  return stepsOfOne + stepsOfTwo;
};

const getSetOfDotsAsStringsFromCommands = (listOfCommands) => {
  let currentPoint = { x: 0, y: 0 };
  let pointSet = new Set();

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
      pointSet.add(`x:${currentPoint.x},y:${currentPoint.y}`);
    }
  });

  return pointSet;
};

const getPathArrayOfDotsAsStringsFromCommands = (listOfCommands) => {
  let currentPoint = { x: 0, y: 0 };
  let pathArray = [];

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
      pathArray.push(`x:${currentPoint.x},y:${currentPoint.y}`);
    }
  });

  return pathArray;
};

const getManhattanDistance = (x1, x2, y1, y2) => {
  return Math.abs(x1 - y1) + Math.abs(x2 - y2);
};
