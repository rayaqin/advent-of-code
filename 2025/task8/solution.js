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
  const connectionsToMake = 10;
  const relevantTopSetsCount = 3;
  const boxSets = {};
  const boxes = source.split("\n").map((b) => {
    let [x, y, z] = b.split(",");
    const keyInSet = `${x},${y},${z}`;
    const newSetId = crypto.randomUUID();
    boxSets[newSetId] = new Set([keyInSet]);
    return {
      x: Number(x),
      y: Number(y),
      z: Number(z),
      keyInSet: keyInSet,
      containingSetId: newSetId,
    };
  });

  const boxPairsMap = {};

  for (let box of boxes) {
    for (let otherBox of boxes) {
      if (box !== otherBox) {
        const setKeyOptionOne = `${box.keyInSet}-${otherBox.keyInSet}`;
        const setKeyOptionTwo = `${otherBox.keyInSet}-${box.keyInSet}`;
        if (boxPairsMap[setKeyOptionOne] || boxPairsMap[setKeyOptionTwo]) {
          continue;
        }
        const distance = euclideanDistanceOfTwo3DPoints(box, otherBox);
        const pairKey = `${box.keyInSet}-${otherBox.keyInSet}`;
        boxPairsMap[pairKey] = {
          boxA: box,
          boxB: otherBox,
          distance: distance,
          setPairKey: pairKey,
          connected: false,
        };
      }
    }
  }

  const sortedBoxPairsByDistance = Object.values(boxPairsMap).toSorted(
    (a, b) => a.distance - b.distance
  );

  let connectionsMade = 0;

  for (let boxPair of sortedBoxPairsByDistance) {
    const { boxA, boxB } = boxPair;
    if (boxPair.connected) continue;
    if (boxSets[boxA.containingSetId].has(boxB.keyInSet)) {
      boxPair.connected = true;
      connectionsMade++;
      if (connectionsMade === connectionsToMake) {
        break;
      }
      continue;
    }

    const mergedSet = new Set([
      ...boxSets[boxA.containingSetId],
      ...boxSets[boxB.containingSetId],
    ]);

    boxSets[boxA.containingSetId] = mergedSet;
    delete boxSets[boxB.containingSetId];

    const boxesWithSameSetIdAsB = boxes.filter(
      (b) => b.containingSetId === boxB.containingSetId
    );
    for (let box of boxesWithSameSetIdAsB) {
      box.containingSetId = boxA.containingSetId;
    }

    boxPair.connected = true;
    connectionsMade++;
    if (connectionsMade === connectionsToMake) {
      break;
    }
  }

  const relevantSets = Object.values(boxSets)
    .toSorted((setA, setB) => setB.size - setA.size)
    .slice(0, relevantTopSetsCount);
  console.log(relevantSets);
  return relevantSets.reduce((acc, curr) => acc * curr.size, 1);
};

const getSolutionForPart2 = (source) => {
  const boxSetsMap = {};
  const boxes = source.split("\n").map((b) => {
    let [x, y, z] = b.split(",");
    const keyInSet = `${x},${y},${z}`;
    const newSetId = crypto.randomUUID();
    boxSetsMap[newSetId] = new Set([keyInSet]);
    return {
      x: Number(x),
      y: Number(y),
      z: Number(z),
      keyInSet: keyInSet,
      containingSetId: newSetId,
    };
  });

  const boxPairsMap = {};

  for (let box of boxes) {
    for (let otherBox of boxes) {
      if (box !== otherBox) {
        const setKeyOptionOne = `${box.keyInSet}-${otherBox.keyInSet}`;
        const setKeyOptionTwo = `${otherBox.keyInSet}-${box.keyInSet}`;
        if (boxPairsMap[setKeyOptionOne] || boxPairsMap[setKeyOptionTwo]) {
          continue;
        }
        const distance = euclideanDistanceOfTwo3DPoints(box, otherBox);
        const pairKey = `${box.keyInSet}-${otherBox.keyInSet}`;
        boxPairsMap[pairKey] = {
          boxA: box,
          boxB: otherBox,
          distance: distance,
          setPairKey: pairKey,
        };
      }
    }
  }

  const sortedBoxPairsByDistance = Object.values(boxPairsMap).toSorted(
    (a, b) => a.distance - b.distance
  );

  let lastPair = {};

  for (let boxPair of sortedBoxPairsByDistance) {
    const { boxA, boxB } = boxPair;
    if (boxSetsMap[boxA.containingSetId].has(boxB.keyInSet)) {
      continue;
    }

    const mergedSet = new Set([
      ...boxSetsMap[boxA.containingSetId],
      ...boxSetsMap[boxB.containingSetId],
    ]);

    boxSetsMap[boxA.containingSetId] = mergedSet;
    delete boxSetsMap[boxB.containingSetId];

    const boxesWithSameSetIdAsB = boxes.filter(
      (b) => b.containingSetId === boxB.containingSetId
    );
    for (let box of boxesWithSameSetIdAsB) {
      box.containingSetId = boxA.containingSetId;
    }

    if (Object.keys(boxSetsMap).length === 1) {
      lastPair = boxPair;
    }
  }

  return lastPair.boxA.x * lastPair.boxB.x;
};

const euclideanDistanceOfTwo3DPoints = (pointA, pointB) => {
  return Math.sqrt(
    Math.pow(pointB.x - pointA.x, 2) +
      Math.pow(pointB.y - pointA.y, 2) +
      Math.pow(pointB.z - pointA.z, 2)
  );
};
