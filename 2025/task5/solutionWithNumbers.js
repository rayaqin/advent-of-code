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
  const [freshIDsRaw, availableIDsRaw] = source.split("\n\n");
  const freshIDStringRanges = freshIDsRaw
    .split("\n")
    .map((rangeString) => rangeString.split("-"))
    .map((rangeArray) => ({
      fromAsString: rangeArray[0],
      toAsString: rangeArray[1],
    }));

  const availableStringIDs = availableIDsRaw.split("\n");

  let freshCount = 0;

  for (const availableStringID of availableStringIDs) {
    let isFresh = false;
    for (const freshIDStringRange of freshIDStringRanges) {
      if (
        isNumberAsStringWithinStringRange(availableStringID, freshIDStringRange)
      ) {
        isFresh = true;
      }
    }
    if (isFresh) freshCount++;
  }

  return freshCount;
};

const getSolutionForPart2 = (source) => {
  const [freshIDsRaw, _] = source.split("\n\n");
  const freshIDRanges = freshIDsRaw
    .split("\n")
    .map((rangeString) => rangeString.split("-"))
    .map((rangeArray) => ({
      from: Number(rangeArray[0]),
      to: Number(rangeArray[1]),
    }));

  let mergedRanges = [...freshIDRanges];
  let mergeOccurred;

  do {
    mergeOccurred = false;
    const newMergedRanges = [];

    for (const currentRange of mergedRanges) {
      let wasMerged = false;

      for (let i = 0; i < newMergedRanges.length; i++) {
        if (doRangesOverlap(currentRange, newMergedRanges[i])) {
          newMergedRanges[i] = mergeTwoOverlappingRanges(
            currentRange,
            newMergedRanges[i]
          );
          wasMerged = true;
          mergeOccurred = true;
          break;
        }
      }

      if (!wasMerged) {
        newMergedRanges.push(currentRange);
      }
    }

    mergedRanges = newMergedRanges;
  } while (mergeOccurred);

  const combinedRangeSize = mergedRanges.reduce(
    (acc, range) => acc + range.to - range.from + 1,
    0
  );

  return combinedRangeSize;
};

const getOverlapRangeOfTwoRanges = (rangeOne, rangeTwo) => {
  if (rangeOne.to < rangeTwo.from || rangeOne.from > rangeTwo.to) {
    return null;
  }

  if (rangeOne.to <= rangeTwo.to && rangeOne.from >= rangeTwo.from) {
    return rangeOne;
  }

  if (rangeOne.to >= rangeTwo.to && rangeOne.from <= rangeTwo.from) {
    return rangeTwo;
  }

  if (rangeOne.to >= rangeTwo.to) {
    return {
      from: rangeOne.from,
      to: rangeTwo.to,
    };
  }

  return {
    from: rangeTwo.from,
    to: rangeOne.to,
  };
};

const doRangesOverlap = (rangeOne, rangeTwo) => {
  return rangeOne.to >= rangeTwo.from && rangeOne.from <= rangeTwo.to;
};

const mergeTwoOverlappingRanges = (rangeOne, rangeTwo) => {
  return {
    from: Math.min(rangeOne.from, rangeTwo.from),
    to: Math.max(rangeOne.to, rangeTwo.to),
  };
};
