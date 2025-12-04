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
  const sortedLists = source.split("\n").reduce(
    (acc, line, index, all) => {
      const [numA, numB] = line.split("   ");
      acc.listA.push(Number(numA));
      acc.listB.push(Number(numB));
      if (index === all.length - 1) {
        acc.listA.sort((a, b) => a - b);
        acc.listB.sort((a, b) => a - b);
      }
      return acc;
    },
    { listA: [], listB: [] },
  );
  const sumOfDifferences = sortedLists.listA.reduce(
    (acc, numA, index) => acc + Math.abs(numA - sortedLists.listB[index]),
    0,
  );
  return sumOfDifferences;
};
const getSolutionForPart2 = (source) => {
  const numLists = source.split("\n").reduce(
    (acc, line) => {
      const [numA, numB] = line.split("   ");
      acc.listA.push(Number(numA));
      acc.listB.push(Number(numB));
      return acc;
    },
    { listA: [], listB: [] },
  );
  const sumOfNumsTimesOccurrences = numLists.listA.reduce((acc, numA) => {
    return acc + numA * numLists.listB.filter((numB) => numB === numA).length;
  }, 0);
  return sumOfNumsTimesOccurrences;
};
