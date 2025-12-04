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
    .map((line) => line.split("").filter((ch) => /\d/.test(ch)))
    .map((numberLine) =>
      parseInt(numberLine[0] + numberLine[numberLine.length - 1]),
    )
    .reduce((acc, curr) => acc + curr, 0);
};

const getSolutionForPart2 = (source) => {
  // to avoid 'eightwo' and `twone` causing problems
  const textToNumMap = {
    one: "o1e",
    two: "t2o",
    three: "th3ee",
    four: "fo4r",
    five: "fi5e",
    six: "s6x",
    seven: "se7en",
    eight: "ei8ht",
    nine: "ni9e",
  };

  return source
    .split("\r\n")
    .map((line) => {
      let parsedLine = line;

      // replace written numbers with easily detectable aliases
      Object.keys(textToNumMap).forEach((numText) => {
        parsedLine = parsedLine.replaceAll(numText, textToNumMap[numText]);
      });
      return parsedLine;
    })
    .map((line) => line.split("").filter((ch) => /\d/.test(ch)))
    .map((numberLine) =>
      parseInt(numberLine[0] + numberLine[numberLine.length - 1]),
    )
    .reduce((acc, curr) => acc + curr, 0);
};
