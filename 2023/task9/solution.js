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
  return source
    .split("\r\n")
    .map((line) => line.match(/-?\d+/g).map(Number))
    .map((numArray) => getNextNumber(numArray, []))
    .reduce((acc, currNextNum) => acc + currNextNum);
};

const getSolutionForPart2 = (source) => {
  return source
    .split("\r\n")
    .map((line) => line.match(/-?\d+/g).map(Number))
    .map((numArray) => getPreviousNumber(numArray, []))
    .reduce((acc, currPrevNum) => acc + currPrevNum);
};

const getNextNumber = (numArray, ends) => {
  if (numArray.length === 0 || numArray.every((a) => a === 0)) {
    return ends.reduce((newNum, currEnd) => currEnd + newNum, 0);
  }
  let diffs = [];
  for (let i = 0; i < numArray.length - 1; i++) {
    diffs.push(numArray[i + 1] - numArray[i]);
  }
  ends.push(numArray[numArray.length - 1]);
  return getNextNumber(diffs, ends);
};

const getPreviousNumber = (numArray, starts) => {
  if (numArray.length === 0 || numArray.every((a) => a === 0)) {
    return starts.reverse().reduce((acc, currStart) => currStart - acc, 0);
  }
  let diffs = [];
  for (let i = 0; i < numArray.length - 1; i++) {
    diffs.push(numArray[i + 1] - numArray[i]);
  }
  starts.push(numArray[0]);

  return getPreviousNumber(diffs, starts);
};
