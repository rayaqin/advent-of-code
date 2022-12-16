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
  partId === 2 && console.log("Zoom out in console to see the levels of the cave properly");
};

const getSolutionForPart1 = (source) => {
  const caveMap = new Map();
  parseLinesIntoMap(source, caveMap);

  caveMap.set("depth", getMapDepthMax(caveMap));
  caveMap.set("width", getMapWidthMax(caveMap));
  caveMap.set("startWidth", getMapWidthMin(caveMap));
  caveMap.set("source", { x: 500, y: 0 });
  caveMap.set(`${500},${0}`, "+");

  let lastSandRestingPlace = findSandRestingPlace(caveMap, true);

  while (lastSandRestingPlace === "rest") {
    lastSandRestingPlace = findSandRestingPlace(caveMap, true);
  }

  drawMap(caveMap);
  return Array.from(caveMap.keys()).reduce((resting, currentKey) => {
    return caveMap.get(currentKey) === "o" ? resting + 1 : resting;
  }, 0);
};

const getSolutionForPart2 = (source) => {
  const caveMap = new Map();
  parseLinesIntoMap(source, caveMap);

  caveMap.set("depth", getMapDepthMax(caveMap));
  caveMap.set("source", { x: 500, y: 0 });
  caveMap.set(`${500},${0}`, "+");

  let lastSandRestingPlace = findSandRestingPlace(caveMap);

  while (lastSandRestingPlace === "rest") {
    lastSandRestingPlace = findSandRestingPlace(caveMap);
  }

  caveMap.set("width", getMapWidthMax(caveMap));
  caveMap.set("startWidth", getMapWidthMin(caveMap));

  drawMap(caveMap);
  return Array.from(caveMap.keys()).reduce((resting, currentKey) => {
    return caveMap.get(currentKey) === "o" ? resting + 1 : resting;
  }, 0);
};

const findSandRestingPlace = (caveMap, abyss) => {
  let oldPosition = caveMap.get("source");
  let newPosition = null;
  while (true) {
    if (abyss && newPosition && newPosition.y >= caveMap.get("depth")) {
      return "abyss";
    }

    if (newPosition && newPosition.y === caveMap.get("depth") + 1) {
      caveMap.set(`${newPosition.x},${newPosition.y}`, "o");
      return "rest";
    }
    // check falling down directly by 1 unit
    if (!caveMap.get(`${oldPosition.x},${oldPosition.y + 1}`)) {
      newPosition = {
        x: oldPosition.x,
        y: oldPosition.y + 1,
      };
      oldPosition = newPosition;
      continue;
    }
    // check falling down diagonally to the left by 1 unit
    if (!caveMap.get(`${oldPosition.x - 1},${oldPosition.y + 1}`)) {
      newPosition = {
        x: oldPosition.x - 1,
        y: oldPosition.y + 1,
      };
      oldPosition = newPosition;
      continue;
    }
    // check falling down diagonally to the right by 1 unit
    if (!caveMap.get(`${oldPosition.x + 1},${oldPosition.y + 1}`)) {
      newPosition = {
        x: oldPosition.x + 1,
        y: oldPosition.y + 1,
      };
      oldPosition = newPosition;
      continue;
    }
    if (newPosition === null) {
      caveMap.set(`${caveMap.get("source").x},${caveMap.get("source").y}`, "o");
      return "full";
    }
    caveMap.set(`${newPosition.x},${newPosition.y}`, "o");
    return "rest";
  }
};

const parseLinesIntoMap = (source, caveMap) => {
  source.split("\r\n").map((line) => {
    const points = line.split(" -> ").map((coordinateString) => ({
      x: parseInt(coordinateString.split(",")[0]),
      y: parseInt(coordinateString.split(",")[1]),
    }));

    for (let i = 0; i < points.length - 1; i++) {
      if (points[i].x <= points[i + 1].x) {
        // draw line from current point's x to the next point's x (to the right)
        for (let currentX = points[i].x; currentX <= points[i + 1].x; currentX++) {
          caveMap.set(`${currentX},${points[i].y}`, "#");
        }
      }
      if (points[i].x >= points[i + 1].x) {
        // draw line from current point's x to the next point's x (to the left)
        for (let currentX = points[i].x; currentX >= points[i + 1].x; currentX--) {
          caveMap.set(`${currentX},${points[i].y}`, "#");
        }
      }
      if (points[i].y <= points[i + 1].y) {
        // draw line from current point's y to the next point's y (downwards)
        for (let currentY = points[i].y; currentY <= points[i + 1].y; currentY++) {
          caveMap.set(`${points[i].x},${currentY}`, "#");
        }
      }
      if (points[i].y >= points[i + 1].y) {
        // draw line from current point's y to the next point's y (upwards)
        for (let currentY = points[i].y; currentY >= points[i + 1].y; currentY--) {
          caveMap.set(`${points[i].x},${currentY}`, "#");
        }
      }
    }
  });
};

const drawMap = (caveMap) => {
  console.clear();
  const maxIndexWidth = caveMap.get("depth").toString().length;
  for (let depth = 0; depth <= caveMap.get("depth"); depth++) {
    let neededZeroes = Array(maxIndexWidth - depth.toString().length)
      .fill(0)
      .reduce((acc, curr) => acc + curr, "");

    let line = `${neededZeroes}${depth}: `;

    for (let width = caveMap.get("startWidth"); width <= caveMap.get("width"); width++) {
      line = line + (caveMap.get(`${width},${depth}`) || ".");
    }
    console.log(line + "\r\n");
  }
};

const getMapDepthMax = (caveMap) =>
  Array.from(caveMap.keys()).reduce((max, currentKeyCoordinate) => {
    let currentDepth = parseInt(currentKeyCoordinate.split(",")[1]);
    return currentDepth > max ? currentDepth : max;
  }, 0);

const getMapWidthMax = (caveMap) =>
  Array.from(caveMap.keys()).reduce((max, currentKeyCoordinate) => {
    let currentWidth = parseInt(currentKeyCoordinate.split(",")[0]);
    return currentWidth > max ? currentWidth : max;
  }, 0);

const getMapWidthMin = (caveMap) =>
  Array.from(caveMap.keys()).reduce((min, currentKeyCoordinate) => {
    let currentWidth = parseInt(currentKeyCoordinate.split(",")[0]);
    return currentWidth < min ? currentWidth : min;
  }, 500);
