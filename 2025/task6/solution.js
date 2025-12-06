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
  const lines = source
    .split("\n")
    .map((line) => line.replaceAll(/\s+/g, " ").split(" ").filter(Boolean));

  let combinedResults = 0;

  for (let columnIndex = 0; columnIndex < lines[0].length; columnIndex++) {
    const operator = lines.at(-1)[columnIndex];
    let result = operator === "*" ? 1 : 0;
    for (let rowIndex = 0; rowIndex < lines.length - 1; rowIndex++) {
      if (operator === "*") {
        result = result * Number(lines[rowIndex][columnIndex]);
      } else {
        result = result + Number(lines[rowIndex][columnIndex]);
      }
    }
    combinedResults += result;
  }
  return combinedResults;
};
const getSolutionForPart2 = (source) => {
  const lines = source.split("\n");

  const operators = ["*", "+"];
  const operations = [];
  const recentOperationData = {
    operator: null,
    numbers: [],
  };

  for (let columnIndex = lines[0].length - 1; columnIndex >= 0; columnIndex--) {
    let currentColumn = "";
    let reachedOperator = false;
    for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
      const currentCharacter = lines[rowIndex][columnIndex];
      if (operators.includes(currentCharacter)) {
        reachedOperator = true;
        recentOperationData.operator = currentCharacter;
        recentOperationData.numbers.push(Number(currentColumn.trim()));
        operations.push({
          operator: recentOperationData.operator,
          numbers: recentOperationData.numbers.filter((n) => n !== 0),
        });
        recentOperationData.numbers = [];
      } else {
        currentColumn += currentCharacter;
      }
    }
    if (reachedOperator === false) {
      recentOperationData.numbers.push(Number(currentColumn.trim()));
    }
  }

  const combinedResults = operations.reduce((acc, curr) => {
    const { numbers, operator } = curr;
    let result = operator === "*" ? 1 : 0;
    for (let number of numbers) {
      if (operator === "*") {
        result = result * number;
      } else {
        result = result + number;
      }
    }
    return acc + result;
  }, 0);

  return combinedResults;
};
