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
  const { stacksMap, operations } = getParsedData(source);
  operations.forEach((operation) => performOperationOne(operation, stacksMap));
  return listTopCrates(stacksMap);
};

const getSolutionForPart2 = (source) => {
  const { stacksMap, operations } = getParsedData(source);
  operations.forEach((operation) => performOperationTwo(operation, stacksMap));
  console.log(stacksMap);
  return listTopCrates(stacksMap);
};

const isRelevantCharacter = (str) => {
  return !!(str.toString().length === 1 && str.toString().match(/[A-Z1-9]/i));
};

const getParsedData = (source) => {
  const initialInputParts = source.split("\r\n\r\n");
  const rawStacks = {};
  const stacksMap = {};

  // use the index of a character to put it in the rawStacks map with a key for the right column
  initialInputParts[0].split("\r\n").forEach((currentRow) => {
    for (let i = 0; i < currentRow.length; i++) {
      if (isRelevantCharacter(currentRow[i])) {
        if (rawStacks[i] && Array.isArray(rawStacks[i])) {
          rawStacks[i].unshift(currentRow[i]);
          continue;
        }
        rawStacks[i] = [currentRow[i]];
        continue;
      }
    }
  });

  // use the first item in each array of rawStacks as the key for the actual stacksMap
  Object.keys(rawStacks).forEach((key) => {
    stacksMap[rawStacks[key][0]] = rawStacks[key].slice(1);
  });

  const operations = initialInputParts[1]
    .split("\r\n")
    .map((line) => line.match(/\d+/g))
    .map((arrayOfNumbers) => ({
      amount: arrayOfNumbers[0],
      containingStack: arrayOfNumbers[1],
      destinationStack: arrayOfNumbers[2],
    }));
  return {
    stacksMap,
    operations,
  };
};

const performOperationOne = (operation, stacksMap) => {
  for (let i = 0; i < operation.amount; i++) {
    let from = stacksMap[operation.containingStack];
    let to = stacksMap[operation.destinationStack];
    const currentCrate = stacksMap[operation.containingStack][stacksMap[operation.containingStack].length - 1];
    from.pop();
    to.push(currentCrate);
  }
};

const performOperationTwo = (operation, stacksMap) => {
  const currentCrates = stacksMap[operation.containingStack].slice([
    stacksMap[operation.containingStack].length - operation.amount,
  ]);
  stacksMap[operation.containingStack] = stacksMap[operation.containingStack].slice(0, [
    stacksMap[operation.containingStack].length - operation.amount,
  ]);
  for (let i = 0; i < currentCrates.length; i++) {
    stacksMap[operation.destinationStack].push(currentCrates[i]);
  }
};

const listTopCrates = (stacksMap) => {
  let result = "";
  Object.keys(stacksMap).forEach((key) => {
    result += stacksMap[key][stacksMap[key].length - 1];
  });
  return result;
};
