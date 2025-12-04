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
  const instructions = source.split("\r\n\r\n")[0];
  const nodesRaw = source
    .split("\r\n\r\n")[1]
    .split("\r\n")
    .map(
      (line) =>
        /(?<nodeName>[A-Z0-9]+)(?: = \()(?<left>[A-Z0-9]+)(?:, )(?<right>[A-Z0-9]+)/.exec(
          line,
        ).groups,
    );

  const nodeMap = {};

  for (nodeData of nodesRaw) {
    nodeMap[nodeData.nodeName] = nodeData;
  }

  let currNodeName = "AAA";
  let destNodeName = "ZZZ";
  let steps = 0;
  while (currNodeName !== destNodeName) {
    console.log(currNodeName);
    for (instr of instructions) {
      steps++;
      if (instr === "L") {
        currNodeName = nodeMap[currNodeName].left;
      } else if (instr === "R") {
        currNodeName = nodeMap[currNodeName].right;
      }
      if (currNodeName === destNodeName) {
        break;
      }
    }
  }

  return steps;
};

const getSolutionForPart2 = (source) => {
  const instructions = source.split("\r\n\r\n")[0];
  let currentNodeNames = [];
  const nodeMap = {};
  source
    .split("\r\n\r\n")[1]
    .split("\r\n")
    .map(
      (line) =>
        /(?<nodeName>[A-Z0-9]+)(?: = \()(?<left>[A-Z0-9]+)(?:, )(?<right>[A-Z0-9]+)/.exec(
          line,
        ).groups,
    )
    .map((line) => {
      // get initial start nodes
      if (line.nodeName[line.nodeName.length - 1] === "A") {
        currentNodeNames.push(line.nodeName);
      }
      nodeMap[line.nodeName] = line;
      return line;
    });

  let steps = 0;
  let instructionIndex = 0;
  let currentInstruction;
  let firstStepsMap = {};

  while (Object.keys(firstStepsMap).some((key) => !firstStepsMap[key])) {
    currentInstruction = instructions[instructionIndex];
    steps++;

    for (let i = 0; i < currentNodeNames.length; i++) {
      if (currentInstruction === "L") {
        currentNodeNames[i] = nodeMap[currentNodeNames[i]].left;
      } else if (currentInstruction === "R") {
        currentNodeNames[i] = nodeMap[currentNodeNames[i]].right;
      }

      /*
        When we first get to a Z ending with each name, we
        take not of how many steps it took to get there
      */
      if (currentNodeNames[i][currentNodeNames[i].length - 1] === "Z") {
        if (!firstStepsMap[i]) {
          firstStepsMap[i] = steps;
        }
      }
    }

    // looping around when reaching the end of instructions
    if (instructionIndex === instructions.length - 1) {
      instructionIndex = 0;
      continue;
    }
    instructionIndex++;
  }

  return findlcm(Object.values(firstStepsMap));
};

// get Greatest Common Denominator
const getGCD = (a, b) => {
  return b === 0 ? a : getGCD(b, a % b);
};

// get Lowest Common Multiple
const getLCM = (numbers) => {
  let LCM = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    LCM = (numbers[i] * LCM) / getGCD(numbers[i], LCM);
  }

  return LCM;
};
