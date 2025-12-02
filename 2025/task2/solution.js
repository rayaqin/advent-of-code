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
  const ranges = source
    .split(",")
    .map((rawRange) => rawRange.split("-"))
    .map((rangeArray) => ({
      lowerBound: rangeArray[0],
      upperBound: rangeArray[1],
    }));
  return ranges.reduce((sumOfRepeatingNumbers, currentRange) => {
    const { lowerBound, upperBound } = currentRange;
    if (
      lowerBound.length === upperBound.length &&
      lowerBound.length % 2 !== 0 &&
      upperBound.length % 2 !== 0
    )
      return sumOfRepeatingNumbers;

    let newSum = sumOfRepeatingNumbers;

    for (
      let productIDNumber = Number(lowerBound);
      productIDNumber <= Number(upperBound);
      productIDNumber++
    ) {
      const productID = String(productIDNumber);
      if (productID.length % 2 !== 0) continue;

      const halfPoint = productID.length / 2;
      const firstHalf = productID.slice(0, halfPoint);
      const secondHalf = productID.slice(halfPoint);

      if (firstHalf === secondHalf) newSum += productIDNumber;
    }

    return newSum;
  }, 0);
};

const getSolutionForPart2 = (source) => {
  const ranges = source
    .split(",")
    .map((rawRange) => rawRange.split("-"))
    .map((rangeArray) => ({
      lowerBound: rangeArray[0],
      upperBound: rangeArray[1],
    }));
  return ranges.reduce((sumOfRepeatingNumbers, currentRange) => {
    const { lowerBound, upperBound } = currentRange;

    // console.log("currentRange", currentRange);

    let newSum = sumOfRepeatingNumbers;

    for (
      let productIDNumber = Number(lowerBound);
      productIDNumber <= Number(upperBound);
      productIDNumber++
    ) {
      const productID = String(productIDNumber);
      // console.log("-------------------------------");
      // console.log("productID: ", productID);
      if (productID.length <= 1) continue;

      let productIDIsInvalid = false;

      for (
        let repeatingSequenceLength = 1;
        repeatingSequenceLength <= productID.length / 2;
        repeatingSequenceLength++
      ) {
        // console.log("repeatingSequenceLength: ", repeatingSequenceLength);
        const baseSequence = productID.slice(0, repeatingSequenceLength);
        // console.log("baseSequence: ", baseSequence);
        let repeatingPatternExists = true;
        for (
          let sequenceStart = repeatingSequenceLength;
          sequenceStart <= productID.length - repeatingSequenceLength;
          sequenceStart += repeatingSequenceLength
        ) {
          if (productID.length % repeatingSequenceLength !== 0) {
            repeatingPatternExists = false;
            break;
          }
          // console.log("sequenceStart: ", sequenceStart);
          const sequenceToCheck = productID.slice(
            sequenceStart,
            sequenceStart + repeatingSequenceLength
          );
          // console.log("sequenceToCheck: ", sequenceToCheck);
          if (sequenceToCheck !== baseSequence) {
            repeatingPatternExists = false;
            break;
          }
        }

        if (repeatingPatternExists === true) {
          productIDIsInvalid = true;
        }
        // console.log("newSum: ", newSum);
      }

      if (productIDIsInvalid) {
        // console.log("repeating pattern found, productID is invalid");
        newSum += productIDNumber;
      }
    }

    return newSum;
  }, 0);
};
