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
  const batteryBanks = source
    .split("\n")
    .map((bankString) => bankString.split("").map(Number));

  return batteryBanks.reduce(
    (sum, currentBank) => sum + getHighestBatteryNComboFromBank(currentBank, 2),
    0,
  );
};

const getSolutionForPart2 = (source) => {
  const batteryBanks = source
    .split("\n")
    .map((bankString) => bankString.split("").map(Number));

  return batteryBanks.reduce(
    (sum, currentBank) =>
      sum + getHighestBatteryNComboFromBank(currentBank, 12),
    0,
  );
};

const getHighestBatteryNComboFromBank = (batteryBank, n) => {
  let resultSum = 0;
  let remainingPossibleBatteries = batteryBank;

  for (let i = n; i >= 1; i--) {
    const nextDigitIndex = remainingPossibleBatteries
      .slice(0, -(i - 1) || undefined)
      .reduce((accIndex, currValue, index) => {
        const accValue = remainingPossibleBatteries[accIndex];
        if (accValue < currValue) {
          return index;
        }
        return accIndex;
      }, 0);

    resultSum +=
      remainingPossibleBatteries[nextDigitIndex] * Math.pow(10, i - 1);

    remainingPossibleBatteries = remainingPossibleBatteries.slice(
      nextDigitIndex + 1,
    );
  }

  return resultSum;
};
