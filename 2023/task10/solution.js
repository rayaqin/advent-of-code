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

const typeToDirectionsMap = {
  "|": ["north", "south"],
  "-": ["west", "east"],
  L: ["north", "east"],
  J: ["north", "west"],
  7: ["south", "west"],
  F: ["south", "east"],
  S: [],
  ".": [],
};

const mapToOpposite = {
  north: "south",
  south: "north",
  west: "east",
  east: "west",
};

const getSolutionForPart1 = (source) => {
  let startingPos = [0, 0];
  const pipeMatrix = source.split("\r\n").map((line, ln) =>
    line.split("").map((type, cn) => {
      if (type === "S") {
        startingPos = { ln, cn };
        return [];
      }
      if (type === ".") {
        return [];
      }
      return typeToDirectionsMap[type];
    }),
  );

  if (pipeMatrix[startingPos.ln + 1][startingPos.cn]?.includes("north")) {
    pipeMatrix[startingPos.ln][startingPos.cn].push("south");
  }
  if (pipeMatrix[startingPos.ln - 1][startingPos.cn]?.includes("south")) {
    pipeMatrix[startingPos.ln][startingPos.cn].push("north");
  }
  if (pipeMatrix[startingPos.ln][startingPos.cn + 1]?.includes("west")) {
    pipeMatrix[startingPos.ln][startingPos.cn].push("east");
  }
  if (pipeMatrix[startingPos.ln][startingPos.cn - 1]?.includes("east")) {
    pipeMatrix[startingPos.ln][startingPos.cn].push("west");
  }

  // First step from Start in two directions
  const startingDirectionA = pipeMatrix[startingPos.ln][startingPos.cn][0];
  const startingDirectionB = pipeMatrix[startingPos.ln][startingPos.cn][1];
  let posA = {
    ln: getNewLn(startingPos.ln, startingDirectionA),
    cn: getNewCn(startingPos.cn, startingDirectionA),
    cameFrom: mapToOpposite[startingDirectionA],
  };
  let posB = {
    ln: getNewLn(startingPos.ln, startingDirectionB),
    cn: getNewCn(startingPos.cn, startingDirectionB),
    cameFrom: mapToOpposite[startingDirectionB],
  };

  let stepsAlongLoop = 1;

  while (!(posA.ln === posB.ln && posA.cn === posB.cn)) {
    stepsAlongLoop++;
    const currentDirectionA = pipeMatrix[posA.ln][posA.cn].find(
      (d) => d !== posA.cameFrom,
    );
    posA = {
      ln: getNewLn(posA.ln, currentDirectionA),
      cn: getNewCn(posA.cn, currentDirectionA),
      cameFrom: mapToOpposite[currentDirectionA],
    };
    if (posA.ln === posB.ln && posA.cn === posB.cn) break;

    const currentDirectionB = pipeMatrix[posB.ln][posB.cn].find(
      (d) => d !== posB.cameFrom,
    );
    posB = {
      ln: getNewLn(posB.ln, currentDirectionB),
      cn: getNewCn(posB.cn, currentDirectionB),
      cameFrom: mapToOpposite[currentDirectionB],
    };
  }

  return stepsAlongLoop;
};

const getSolutionForPart2 = (source) => {
  /*
    This solution after parsing the data and finding the right pipePath
    just steps through each line tile by tile, and when it encounters
    the right walltype on a tile that is inside the loop it toggles the isInsideLoop variable.
    The right wallType is either '|' or when going slightly below the vertical halfpoint we pass
    below the pipe, while going parallel with it horizontally, like in case of
    '7' and 'F', so we ignore 'L' and 'J'. In case of 'J' and 'L' we would be going over the pipe instead
    of under, that approach would also work, but then we would ignore '7' and 'F'.
  */

  let startingPos = [0, 0];
  const pipeMatrix = source.split("\r\n").map((line, ln) =>
    line.split("").map((type, cn) => {
      if (type === "S") {
        startingPos = { ln, cn };
        return { content: [], isPartOfLoop: true, wallType: "S" };
      }
      if (type === ".") {
        return { content: ["."], isPartOfLoop: false };
      }
      return {
        content: typeToDirectionsMap[type],
        isPartOfLoop: false,
        wallType: type,
      };
    }),
  );

  const startTile = pipeMatrix[startingPos.ln][startingPos.cn];

  if (
    pipeMatrix[startingPos.ln + 1]?.[startingPos.cn]?.content.includes("north")
  ) {
    startTile.content.push("south");
  }
  if (
    pipeMatrix[startingPos.ln - 1]?.[startingPos.cn]?.content.includes("south")
  ) {
    startTile.content.push("north");
  }
  if (
    pipeMatrix[startingPos.ln]?.[startingPos.cn + 1]?.content.includes("west")
  ) {
    startTile.content.push("east");
  }
  if (
    pipeMatrix[startingPos.ln]?.[startingPos.cn - 1]?.content.includes("east")
  ) {
    startTile.content.push("west");
  }

  const displayMap = {
    ".": ".",
    "north-south": "|",
    "south-north": "|",
    "north-east": "L",
    "east-north": "L",
    "north-west": "J",
    "west-north": "J",
    "east-west": "-",
    "west-east": "-",
    "south-east": "F",
    "east-south": "F",
    "south-west": "7",
    "west-south": "7",
    "#": "#",
  };

  startTile.wallType =
    displayMap[startTile.content[0] + "-" + startTile.content[1]];

  // First step from Start in two directions
  const startingDirectionA =
    pipeMatrix[startingPos.ln][startingPos.cn].content[0];
  const startingDirectionB =
    pipeMatrix[startingPos.ln][startingPos.cn].content[1];
  let posA = {
    ln: getNewLn(startingPos.ln, startingDirectionA),
    cn: getNewCn(startingPos.cn, startingDirectionA),
    cameFrom: mapToOpposite[startingDirectionA],
  };
  let posB = {
    ln: getNewLn(startingPos.ln, startingDirectionB),
    cn: getNewCn(startingPos.cn, startingDirectionB),
    cameFrom: mapToOpposite[startingDirectionB],
  };
  pipeMatrix[posA.ln][posA.cn].isPartOfLoop = true;
  pipeMatrix[posB.ln][posB.cn].isPartOfLoop = true;

  let stepsAlongLoop = 1;

  while (!(posA.ln === posB.ln && posA.cn === posB.cn)) {
    stepsAlongLoop++;
    const currentDirectionA = pipeMatrix[posA.ln][posA.cn].content.find(
      (d) => d !== posA.cameFrom,
    );
    posA = {
      ln: getNewLn(posA.ln, currentDirectionA),
      cn: getNewCn(posA.cn, currentDirectionA),
      cameFrom: mapToOpposite[currentDirectionA],
    };
    pipeMatrix[posA.ln][posA.cn].isPartOfLoop = true;

    if (posA.ln === posB.ln && posA.cn === posB.cn) break;

    const currentDirectionB = pipeMatrix[posB.ln][posB.cn].content.find(
      (d) => d !== posB.cameFrom,
    );
    posB = {
      ln: getNewLn(posB.ln, currentDirectionB),
      cn: getNewCn(posB.cn, currentDirectionB),
      cameFrom: mapToOpposite[currentDirectionB],
    };
    pipeMatrix[posB.ln][posB.cn].isPartOfLoop = true;
  }

  // marking inside tiles
  let insideCount = 0;
  pipeMatrix.forEach((line) => {
    let isInsideLoop = false;

    line.forEach((tile) => {
      if (tile.isPartOfLoop) {
        if (["|", "L", "J"].includes(tile.wallType)) {
          isInsideLoop = !isInsideLoop;
        }
      } else if (isInsideLoop) {
        insideCount++;
        tile.content = "#";
      }
    });
  });

  displayTwoDimensionalArray(pipeMatrix, displayMap);

  return insideCount;
};

const getNewCn = (currentCn, direction) => {
  if (direction === "east") return currentCn + 1;
  if (direction === "west") return currentCn - 1;
  return currentCn;
};
const getNewLn = (currentLn, direction) => {
  if (direction === "north") return currentLn - 1;
  if (direction === "south") return currentLn + 1;
  return currentLn;
};

function displayTwoDimensionalArray(arr, displayMap) {
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j].content.length === 1) {
        result += arr[i][j].content[0];
      } else {
        result += displayMap[arr[i][j].content[0] + "-" + arr[i][j].content[1]];
      }
      result += " ";
    }
    result += "\n";
  }
  console.log(result);
}
