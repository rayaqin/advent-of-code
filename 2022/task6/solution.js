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

function checkForRepetition(array) {
  const seenCharacters = new Set();
  for (const character of array) {
    if (seenCharacters.has(character)) {
      return true;
    }
    seenCharacters.add(character);
  }
  return false;
}

const getSolutionForPart1 = (source) => {
  const last3Array = [];
  const sourceArray = source.split("");
  for (let i = 0; i < sourceArray.length; i++) {
    if (last3Array.length < 3) {
      last3Array.push(sourceArray[i]);
      continue;
    }
    if (last3Array.includes(sourceArray[i]) || checkForRepetition(last3Array)) {
      last3Array.shift();
      last3Array.push(sourceArray[i]);
      continue;
    }
    return i + 1;
  }
};

const getSolutionForPart2 = (source) => {
  const last3Array = [];
  const sourceArray = source.split("");
  for (let i = 0; i < sourceArray.length; i++) {
    if (last3Array.length < 13) {
      last3Array.push(sourceArray[i]);
      continue;
    }
    if (last3Array.includes(sourceArray[i]) || checkForRepetition(last3Array)) {
      last3Array.shift();
      last3Array.push(sourceArray[i]);
      continue;
    }
    return i + 1;
  }
};
