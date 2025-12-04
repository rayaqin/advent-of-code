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
  let startCoordinates = "";
  let destinationCoordinates = "";
  const topologyMap = new Map();
  let topologyHeight = source.split("\r\n").length;
  let topologyWidth = source.split("\r\n")[0].length;

  source.split("\r\n").map((line, y) =>
    line.split("").map((square, x) => {
      let currentSquare = square;
      if (square === "S") {
        currentSquare = "a";
        startCoordinates = `${x},${y}`;
      }
      if (square === "E") {
        currentSquare = "z";
        destinationCoordinates = `${x},${y}`;
      }
      topologyMap.set(`${x},${y}`, {
        value: currentSquare,
        neighbours: [],
        distanceFromStart: Infinity,
        visited: false,
      });
    }),
  );

  // set neighbours that can be stepped to
  for (let y = 0; y < topologyHeight; y++) {
    for (let x = 0; x < topologyWidth; x++) {
      const currentNode = topologyMap.get(`${x},${y}`);
      const currentNodeCharcode = currentNode.value.charCodeAt(0);
      if (
        y !== 0 &&
        topologyMap.get(`${x},${y - 1}`).value.charCodeAt(0) <=
          currentNodeCharcode + 1
      ) {
        currentNode.neighbours.push(`${x},${y - 1}`);
      }
      if (
        y !== topologyHeight - 1 &&
        topologyMap.get(`${x},${y + 1}`).value.charCodeAt(0) <=
          currentNodeCharcode + 1
      ) {
        currentNode.neighbours.push(`${x},${y + 1}`);
      }
      if (
        x !== 0 &&
        topologyMap.get(`${x - 1},${y}`).value.charCodeAt(0) <=
          currentNodeCharcode + 1
      ) {
        currentNode.neighbours.push(`${x - 1},${y}`);
      }
      if (
        x !== topologyWidth - 1 &&
        topologyMap.get(`${x + 1},${y}`).value.charCodeAt(0) <=
          currentNodeCharcode + 1
      ) {
        currentNode.neighbours.push(`${x + 1},${y}`);
      }
    }
  }
  return getShortestPath(topologyMap, startCoordinates, destinationCoordinates);
};

const getSolutionForPart2 = (source) => {
  let startCoordinates = "";
  let destinationCoordinates = "";
  const topologyMap = new Map();
  let topologyHeight = source.split("\r\n").length;
  let topologyWidth = source.split("\r\n")[0].length;

  source.split("\r\n").map((line, y) =>
    line.split("").map((square, x) => {
      let currentSquare = square;
      if (square === "S") {
        currentSquare = "a";
        destinationCoordinates = `${x},${y}`;
      }
      if (square === "E") {
        currentSquare = "z";
        startCoordinates = `${x},${y}`;
      }
      topologyMap.set(`${x},${y}`, {
        value: currentSquare,
        neighbours: [],
        distanceFromStart: Infinity,
        visited: false,
      });
    }),
  );

  // set neighbours that can be stepped to
  for (let y = 0; y < topologyHeight; y++) {
    for (let x = 0; x < topologyWidth; x++) {
      const currentNode = topologyMap.get(`${x},${y}`);
      const currentNodeCharcode = currentNode.value.charCodeAt(0);
      if (
        y !== 0 &&
        topologyMap.get(`${x},${y - 1}`).value.charCodeAt(0) >=
          currentNodeCharcode - 1
      ) {
        currentNode.neighbours.push(`${x},${y - 1}`);
      }
      if (
        y !== topologyHeight - 1 &&
        topologyMap.get(`${x},${y + 1}`).value.charCodeAt(0) >=
          currentNodeCharcode - 1
      ) {
        currentNode.neighbours.push(`${x},${y + 1}`);
      }
      if (
        x !== 0 &&
        topologyMap.get(`${x - 1},${y}`).value.charCodeAt(0) >=
          currentNodeCharcode - 1
      ) {
        currentNode.neighbours.push(`${x - 1},${y}`);
      }
      if (
        x !== topologyWidth - 1 &&
        topologyMap.get(`${x + 1},${y}`).value.charCodeAt(0) >=
          currentNodeCharcode - 1
      ) {
        currentNode.neighbours.push(`${x + 1},${y}`);
      }
    }
  }
  return getShortestPath(
    topologyMap,
    startCoordinates,
    destinationCoordinates,
    true,
  );
};

//Dijkstra
const getShortestPath = (
  nodeMap,
  startCoordinates,
  destinationCoordinates,
  findShortestA,
) => {
  let unvisitedNodeKeys = new Set(nodeMap.keys());
  nodeMap.get(startCoordinates).distanceFromStart = 0;
  let minimalStepsToA = Infinity;
  let currentNodeKey = returnSmallestDistanceNodeKey(
    unvisitedNodeKeys,
    nodeMap,
  );
  while (
    destinationCoordinates !== currentNodeKey &&
    nodeMap.get(destinationCoordinates).visited === false
  ) {
    nodeMap.get(currentNodeKey).neighbours.forEach((neighbour) => {
      if (unvisitedNodeKeys.has(neighbour)) {
        let currentDistance = nodeMap.get(currentNodeKey).distanceFromStart;
        let purposedNewDistance = currentDistance + 1;
        let oldNeighbourDistance = nodeMap.get(neighbour).distanceFromStart;
        nodeMap.get(neighbour).distanceFromStart = Math.min(
          oldNeighbourDistance,
          purposedNewDistance,
        );
      }
    });
    nodeMap.get(currentNodeKey).visited = true;
    unvisitedNodeKeys.delete(currentNodeKey);
    currentNodeKey = returnSmallestDistanceNodeKey(unvisitedNodeKeys, nodeMap);

    if (findShortestA && nodeMap.get(currentNodeKey).value === "a") {
      minimalStepsToA = Math.min(
        minimalStepsToA,
        nodeMap.get(currentNodeKey).distanceFromStart,
      );
    }
  }

  if (findShortestA) {
    return minimalStepsToA;
  }

  return nodeMap.get(destinationCoordinates).distanceFromStart;
};

const returnSmallestDistanceNodeKey = (univisitedKeys, nodeMap) => {
  let smallestDistanceNodeKey = null;
  univisitedKeys.forEach((coordinate) => {
    if (
      !nodeMap.get(smallestDistanceNodeKey) ||
      nodeMap.get(smallestDistanceNodeKey).distanceFromStart >
        nodeMap.get(coordinate).distanceFromStart
    ) {
      smallestDistanceNodeKey = coordinate;
    }
  });
  return smallestDistanceNodeKey;
};
