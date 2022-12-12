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
  const monkeyMap = {};

  fillMonkeyMap(source, monkeyMap);

  return executeRoundsGetMonkeyBusiness(monkeyMap, 20, true);
};

const getSolutionForPart2 = (source) => {
  const monkeyMap = {};

  fillMonkeyMap(source, monkeyMap);

  return executeRoundsGetMonkeyBusiness(monkeyMap, 10000, false);
};

const fillMonkeyMap = (source, monkeyMap) => {
  let primeProduct = 1;

  source.split("\r\n\r\n").map((monkeyDataBlock) => {
    const lines = monkeyDataBlock.split("\r\n");
    primeProduct = primeProduct * parseInt(lines[3].match(/\d+/g)[0]);
  });

  source.split("\r\n\r\n").map((monkeyDataBlock) => {
    const lines = monkeyDataBlock.split("\r\n");
    const monkey = {
      id: parseInt(lines[0].match(/\d+/g)[0]),
      startingItems: lines[1].match(/\d+/g).map((n) => parseInt(n)),
      inspectionEffect: (old) => {
        const rightSide = lines[2].match(/(?<=\s[\+\*]\s)(old|\d+)/g)[0];
        const currentRightValue = rightSide === "old" ? old : parseInt(rightSide);
        const multiplication = !!(lines[2].indexOf("*") >= 0);

        const newWorryLevelRaw = multiplication ? old * currentRightValue : old + currentRightValue;

        return newWorryLevelRaw % primeProduct;
      },
      test: (worryLevel) => {
        const divisor = parseInt(lines[3].match(/\d+/g)[0]);
        return worryLevel % divisor === 0;
      },
      trueDestinationMonkey: parseInt(lines[4].match(/\d+/g)[0]),
      falseDestinationMonkey: parseInt(lines[5].match(/\d+/g)[0]),
      inspectionCount: 0,
    };
    monkeyMap[monkey.id] = monkey;
    return monkey;
  });

  Object.keys(monkeyMap).forEach((monkey) => {
    monkeyMap[monkey].trueDestinationMonkey = monkeyMap[monkeyMap[monkey].trueDestinationMonkey];
    monkeyMap[monkey].falseDestinationMonkey = monkeyMap[monkeyMap[monkey].falseDestinationMonkey];
  });
};

const relief = (worryLevel) => Math.floor(worryLevel / 3);

const executeRoundsGetMonkeyBusiness = (monkeyMap, numberOfRounds, reliefUponInspection) => {
  for (let i = 0; i < numberOfRounds; i++) {
    for (key of Object.keys(monkeyMap)) {
      const currentMonkey = monkeyMap[key];
      const numberOfStartingItems = currentMonkey.startingItems.length;

      for (let j = 0; j < numberOfStartingItems; j++) {
        const worryLevelAfterInspection = currentMonkey.inspectionEffect(currentMonkey.startingItems.shift());

        const newWorryLevel = reliefUponInspection ? relief(worryLevelAfterInspection) : worryLevelAfterInspection;

        currentMonkey.inspectionCount++;

        const destinationMonkey = currentMonkey.test(newWorryLevel)
          ? currentMonkey.trueDestinationMonkey
          : currentMonkey.falseDestinationMonkey;
        destinationMonkey.startingItems.push(newWorryLevel);
      }
    }
  }

  const monkeyActivityArray = [];
  for (key of Object.keys(monkeyMap)) {
    monkeyActivityArray.push(monkeyMap[key].inspectionCount);
  }

  monkeyActivityArray.sort((a, b) => b - a);

  return monkeyActivityArray[0] * monkeyActivityArray[1];
};
