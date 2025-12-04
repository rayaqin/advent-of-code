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
  const cleanedInstructions = source
    .match(/mul\(\d{1,3},\d{1,3}\)/gm)
    .map((instruction) => ({
      task: instruction.split("(")[0],
      values: instruction.match(/\d{1,3}/gm).map(Number),
    }));

  const sumOfExecutedInstructions = cleanedInstructions.reduce(
    (sum, currentInstruction) => {
      return sum + currentInstruction.values[0] * currentInstruction.values[1];
    },
    0,
  );

  return sumOfExecutedInstructions;
};

const getSolutionForPart2 = (source) => {
  const cleanedInstructions = source
    .match(/mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/gm)
    .map((instruction) => ({
      task: instruction.split("(")[0],
      values: instruction.match(/\d{1,3}/gm)?.map(Number),
    }));

  let instructionsEnabled = true;

  const sumOfExecutedInstructions = cleanedInstructions.reduce(
    (sum, currentInstruction) => {
      if (currentInstruction.task === "do") {
        instructionsEnabled = true;
        return sum;
      }
      if (currentInstruction.task === "don't") {
        instructionsEnabled = false;
        return sum;
      }
      return (
        sum +
        Boolean(instructionsEnabled) *
          currentInstruction.values[0] *
          currentInstruction.values[1]
      );
    },
    0,
  );

  return sumOfExecutedInstructions;
};
