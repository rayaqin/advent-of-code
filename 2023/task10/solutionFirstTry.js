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

const typeToDirectionsMap = {
  '|': ['north', 'south'],
  '-': ['west', 'east'],
  'L': ['north', 'east'],
  'J': ['north', 'west'],
  '7': ['south', 'west'],
  'F': ['south', 'east'],
  'S': [],
  '.': [],
};

const mapToOpposite = {
  'north': 'south',
  'south': 'north',
  'west': 'east',
  'east': 'west',
}


const getSolutionForPart1 = (source) => {
  let startingPos = [0, 0];
  const pipeMatrix = source.split('\r\n').map((line, ln) => line.split('').map((type, cn) => {
    if (type === 'S') {
      startingPos = { ln, cn }
      return [];
    };
    if (type === '.') {
      return [];
    }
    return typeToDirectionsMap[type];
  }))

  if (pipeMatrix[startingPos.ln + 1][startingPos.cn]?.includes('north')) {
    pipeMatrix[startingPos.ln][startingPos.cn].push('south');
  }
  if (pipeMatrix[startingPos.ln - 1][startingPos.cn]?.includes('south')) {
    pipeMatrix[startingPos.ln][startingPos.cn].push('north');
  }
  if (pipeMatrix[startingPos.ln][startingPos.cn + 1]?.includes('west')) {
    pipeMatrix[startingPos.ln][startingPos.cn].push('east');
  }
  if (pipeMatrix[startingPos.ln][startingPos.cn - 1]?.includes('east')) {
    pipeMatrix[startingPos.ln][startingPos.cn].push('west');
  }


  // First step from Start in two directions
  const startingDirectionA = pipeMatrix[startingPos.ln][startingPos.cn][0];
  const startingDirectionB = pipeMatrix[startingPos.ln][startingPos.cn][1];
  let posA = {
    ln: getNewLn(startingPos.ln, startingDirectionA),
    cn: getNewCn(startingPos.cn, startingDirectionA),
    cameFrom: mapToOpposite[startingDirectionA]
  };
  let posB = {
    ln: getNewLn(startingPos.ln, startingDirectionB),
    cn: getNewCn(startingPos.cn, startingDirectionB),
    cameFrom: mapToOpposite[startingDirectionB]
  };

  let stepsAlongLoop = 1;

  while (!(posA.ln === posB.ln && posA.cn === posB.cn)) {
    stepsAlongLoop++;
    const currentDirectionA = pipeMatrix[posA.ln][posA.cn].find(d => d !== posA.cameFrom);
    posA = {
      ln: getNewLn(posA.ln, currentDirectionA),
      cn: getNewCn(posA.cn, currentDirectionA),
      cameFrom: mapToOpposite[currentDirectionA]
    }
    if (posA.ln === posB.ln && posA.cn === posB.cn) break;

    const currentDirectionB = pipeMatrix[posB.ln][posB.cn].find(d => d !== posB.cameFrom);
    posB = {
      ln: getNewLn(posB.ln, currentDirectionB),
      cn: getNewCn(posB.cn, currentDirectionB),
      cameFrom: mapToOpposite[currentDirectionB]
    }
  }

  return stepsAlongLoop;
};


const getSolutionForPart2 = (source) => {
  /*
    This solution assumes that if you count the left and right turns
    of a pipe path, then if you substract the left turns from the right
    turns you can use the result to determine which side of the pipe
    is the inside of the loop (excalidraw file with drawings).
    Using that information it traverses the path again, marking every tile
    on that chosen side, then calling the spread function on it, which turns
    every touching suitable tile into an "inside tile" recursively, and counts
    them in the process.
    The downside of this approach is that in a very special edge case
    where an inside tile is surrounded by only corner tiles of the loop path,
    and the direction of the loop traversal is pointing away from it, it will
    not get marked as inside tile, and ruin our lives.
    Example (the inside tile is marked with #) :
    | | | F -
    I L J | F
    L 7 # L J
    F J F - -
    L 7 I F 7
  */

  let startingPos = [0, 0];
  const pipeMatrix = source.split('\r\n').map((line, ln) => line.split('').map((type, cn) => {
    if (type === 'S') {
      startingPos = { ln, cn }
      return { content: [], shouldNotCheck: true };
    };
    if (type === '.') {
      return { content: ['ground'], shouldNotCheck: false };
    }
    return { content: typeToDirectionsMap[type], shouldNotCheck: false };
  }))


  if (pipeMatrix[startingPos.ln + 1]?.[startingPos.cn]?.content.includes('north')) {
    pipeMatrix[startingPos.ln][startingPos.cn].content.push('south');
  }
  if (pipeMatrix[startingPos.ln - 1]?.[startingPos.cn]?.content.includes('south')) {
    pipeMatrix[startingPos.ln][startingPos.cn].content.push('north');
  }
  if (pipeMatrix[startingPos.ln]?.[startingPos.cn + 1]?.content.includes('west')) {
    pipeMatrix[startingPos.ln][startingPos.cn].content.push('east');
  }
  if (pipeMatrix[startingPos.ln]?.[startingPos.cn - 1]?.content.includes('east')) {
    pipeMatrix[startingPos.ln][startingPos.cn].content.push('west');
  }


  // First step from Start in two directions
  const startingDirectionA = pipeMatrix[startingPos.ln][startingPos.cn].content[0];
  const startingDirectionB = pipeMatrix[startingPos.ln][startingPos.cn].content[1];
  let posA = {
    ln: getNewLn(startingPos.ln, startingDirectionA),
    cn: getNewCn(startingPos.cn, startingDirectionA),
    cameFrom: mapToOpposite[startingDirectionA],
    turnMod: 0,
  };
  let posB = {
    ln: getNewLn(startingPos.ln, startingDirectionB),
    cn: getNewCn(startingPos.cn, startingDirectionB),
    cameFrom: mapToOpposite[startingDirectionB],
    turnMod: 0,
  };
  pipeMatrix[posA.ln][posA.cn].shouldNotCheck = true;
  pipeMatrix[posB.ln][posB.cn].shouldNotCheck = true;


  let stepsAlongLoop = 1;

  while (!(posA.ln === posB.ln && posA.cn === posB.cn)) {
    stepsAlongLoop++;
    const currentDirectionA = pipeMatrix[posA.ln][posA.cn].content.find(d => d !== posA.cameFrom);
    posA = {
      ln: getNewLn(posA.ln, currentDirectionA),
      cn: getNewCn(posA.cn, currentDirectionA),
      cameFrom: mapToOpposite[currentDirectionA],
      turnMod: posA.turnMod + getTurnMod(posA.cameFrom, currentDirectionA),
    }
    pipeMatrix[posA.ln][posA.cn].shouldNotCheck = true;

    if (posA.ln === posB.ln && posA.cn === posB.cn) break;

    const currentDirectionB = pipeMatrix[posB.ln][posB.cn].content.find(d => d !== posB.cameFrom);
    posB = {
      ln: getNewLn(posB.ln, currentDirectionB),
      cn: getNewCn(posB.cn, currentDirectionB),
      cameFrom: mapToOpposite[currentDirectionB],
      turnMod: posB.turnMod + getTurnMod(posB.cameFrom, currentDirectionB),
    }
    pipeMatrix[posB.ln][posB.cn].shouldNotCheck = true;
  }

  const loopSide = (posA.turnMod - posB.turnMod) > 0 ? 'right' : 'left';
  let pos = {
    ln: getNewLn(startingPos.ln, startingDirectionA),
    cn: getNewCn(startingPos.cn, startingDirectionA),
    cameFrom: mapToOpposite[startingDirectionA],
  };


  let inside = { count: 0 };

  while (!(pos.ln === startingPos.ln && pos.cn === startingPos.cn)) {
    const currentDirection = pipeMatrix[pos.ln][pos.cn].content.find(d => d !== pos.cameFrom);

    const inLoopPoint = {
      ln: getAdjLn(pos.ln, currentDirection, loopSide),
      cn: getAdjCn(pos.cn, currentDirection, loopSide),
    }

    const inLoopTile = pipeMatrix[inLoopPoint.ln]?.[inLoopPoint.cn];

    if (inLoopTile?.shouldNotCheck === false) {
      inLoopTile.content = ['#'];
      inLoopTile.shouldNotCheck = true;
      inside.count++;
      spreadI({ ...inLoopPoint }, pipeMatrix, inside);
    }

    pos = {
      ln: getNewLn(pos.ln, currentDirection),
      cn: getNewCn(pos.cn, currentDirection),
      cameFrom: mapToOpposite[currentDirection],
    }

  }


  displayTwoDimensionalArray(pipeMatrix);
  console.log(loopSide)



  return inside.count;
};

const getNewCn = (currentCn, direction) => {
  if (direction === 'east') return currentCn + 1;
  if (direction === 'west') return currentCn - 1;
  return currentCn;
}
const getNewLn = (currentLn, direction) => {
  if (direction === 'north') return currentLn - 1;
  if (direction === 'south') return currentLn + 1;
  return currentLn;
}

const getAdjLn = (currentLn, outDir, side) => {
  if (outDir === 'north' || outDir === 'south') {
    return currentLn;
  }
  if (outDir === 'east') {
    return side === 'left' ? currentLn - 1 : currentLn + 1;
  }
  if (outDir === 'west') {
    return side === 'left' ? currentLn + 1 : currentLn - 1;
  }
}


const getAdjCn = (currentCn, outDir, side) => {
  if (outDir === 'east' || outDir === 'west') {
    return currentCn;
  }
  if (outDir === 'north') {
    return side === 'left' ? currentCn - 1 : currentCn + 1;
  }
  if (outDir === 'south') {
    return side === 'left' ? currentCn + 1 : currentCn - 1;
  }
}

const getTurnMod = (inDir, outDir) => {
  switch (inDir) {
    case 'north':
      return outDir === 'west' ? 1 : (outDir === 'east' ? -1 : 0);
    case 'south':
      return outDir === 'east' ? 1 : (outDir === 'west' ? -1 : 0);
    case 'east':
      return outDir === 'north' ? 1 : (outDir === 'south' ? -1 : 0);
    case 'west':
      return outDir === 'south' ? 1 : (outDir === 'north' ? -1 : 0);
    default:
      return 0;
  }
}

const displayMap = {
  'ground': '.',
  'north-south': '|',
  'south-north': '|',
  'north-east': 'L',
  'east-north': 'L',
  'north-west': 'J',
  'west-north': 'J',
  'east-west': '-',
  'west-east': '-',
  'south-east': 'F',
  'east-south': 'F',
  'south-west': '7',
  'west-south': '7',
  '#': '#'
}

function displayTwoDimensionalArray(arr) {
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j].content.length === 1) {
        result += displayMap[arr[i][j].content];
      }
      else {
        result += displayMap[arr[i][j].content[0] + '-' + arr[i][j].content[1]];
      }
      result += " ";
    }
    result += "\n";
  }
  console.log(result);
}

const spreadI = (iPos, pipeMatrix, inside) => {
  const below = pipeMatrix[iPos.ln + 1]?.[iPos.cn];
  if (below?.content[0] === 'ground' || below?.shouldNotCheck === false) {
    below.content = ['#'];
    below.shouldNotCheck = true
    inside.count++;
    spreadI({ ln: iPos.ln + 1, cn: iPos.cn }, pipeMatrix, inside);
  }

  const above = pipeMatrix[iPos.ln - 1]?.[iPos.cn];
  if (above?.content[0] === 'ground' || above?.shouldNotCheck === false) {
    above.content = ['#'];
    above.shouldNotCheck = true
    inside.count++;
    spreadI({ ln: iPos.ln - 1, cn: iPos.cn }, pipeMatrix, inside);
  }

  const leftSide = pipeMatrix[iPos.ln]?.[iPos.cn - 1];
  if (leftSide?.content[0] === 'ground' || leftSide?.shouldNotCheck === false) {
    leftSide.content = ['#'];
    leftSide.shouldNotCheck = true
    inside.count++;
    spreadI({ ln: iPos.ln, cn: iPos.cn - 1 }, pipeMatrix, inside);
  }

  const rightSide = pipeMatrix[iPos.ln]?.[iPos.cn + 1];
  if (rightSide?.content[0] === 'ground' || rightSide?.shouldNotCheck === false) {
    rightSide.content = ['#'];
    rightSide.shouldNotCheck = true
    inside.count++;
    spreadI({ ln: iPos.ln, cn: iPos.cn + 1 }, pipeMatrix, inside);
  }

  return;
}




