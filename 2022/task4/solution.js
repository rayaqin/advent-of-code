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

const getAssignmentPairs = (source) => {
  return source.split("\r\n").map((line) => {
    const range1 = line.split(",")[0];
    const range2 = line.split(",")[1];
    return {
      rangeOne: {
        from: parseInt(range1.split("-")[0]),
        to: parseInt(range1.split("-")[1]),
      },
      rangeTwo: {
        from: parseInt(range2.split("-")[0]),
        to: parseInt(range2.split("-")[1]),
      },
    };
  });
};

const getSolutionForPart1 = (source) => {
  const assignmentPairs = getAssignmentPairs(source);

  let fullContainments = 0;

  assignmentPairs.forEach((pair) => {
    if (
      (pair.rangeOne.from <= pair.rangeTwo.from && pair.rangeOne.to >= pair.rangeTwo.to) ||
      (pair.rangeTwo.from <= pair.rangeOne.from && pair.rangeTwo.to >= pair.rangeOne.to)
    ) {
      fullContainments++;
    }
  });

  return fullContainments;
};

const getSolutionForPart2 = (source) => {
  const assignmentPairs = getAssignmentPairs(source);

  let partialContainments = 0;

  assignmentPairs.forEach((pair) => {
    if (!(pair.rangeOne.from > pair.rangeTwo.to || pair.rangeOne.to < pair.rangeTwo.from)) {
      partialContainments++;
    }
  });

  return partialContainments;
};
