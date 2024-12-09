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

const isLineSafe = (levels) => {
  if(levels.length <= 1) return true;

  let shouldIncrease = false;
  let shouldDecrease = false;
  for(let i = 1; i < levels.length; i++) {
    const diff = levels[i] - levels[i-1];
    if(!shouldIncrease && !shouldDecrease){
      shouldIncrease = diff >= 1;
      shouldDecrease = diff <= -1;
    }
    if(shouldIncrease && diff < 1) return false;
    if(shouldDecrease && diff > -1) return false;
    if(Math.abs(diff) < 1 || Math.abs(diff) > 3) return false;
  }
  return true;
}

const isLineSafeWithDampener = (levels) => {
  // console.log("levels being checked: ", levels);
  if (levels.length <= 1) return true;


  let isProblematic = false;
  let shouldIncrease = false;
  let shouldDecrease = false;

  for (let i = 1; i < levels.length; i++) {
    const diff = levels[i] - levels[i - 1];
    if (!shouldIncrease && !shouldDecrease) {
      shouldIncrease = diff >= 1;
      shouldDecrease = diff <= -1;
    }
    if (
      (shouldIncrease && diff < 1) ||
      (shouldDecrease && diff > -1) ||
      Math.abs(diff) < 1 ||
      Math.abs(diff) > 3
    ) {
      isProblematic = true;
    }
  }

  if(!isProblematic) return true;

  for (let i = 0; i < levels.length; i++) {
    const levelsWithoutProblematicAtIndex = levels.toSpliced(i, 1);
    // console.log("correction attempt, levels being checked: ", levelsWithoutProblematicAtIndex);

    if (isLineSafe(levelsWithoutProblematicAtIndex)) {
      // console.log("safe after removing: ", levels[i]);
      return true;
    }
  }
  // console.log("no fix was possible");

  return false;
}

const getSolutionForPart1 = (source) => {
  return source.split("\n").map(line => isLineSafe(line.split(' ').map(Number))).reduce((acc,curr) => acc + (Boolean(curr) ? 1 : 0));
};
const getSolutionForPart2 = (source) => {
  return source.split("\n").map(line => isLineSafeWithDampener(line.split(' ').map(Number))).reduce((acc,curr) => acc + (Boolean(curr) ? 1 : 0));
};
