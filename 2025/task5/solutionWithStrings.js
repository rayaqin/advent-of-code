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
  const freshIDStringRanges = freshIDsRaw
    .split("\n")
    .map((rangeString) => rangeString.split("-"))
    .map((rangeArray) => ({
      fromAsString: rangeArray[0],
      toAsString: rangeArray[1],
    }));

  let totalSizeAsString = "0";
  let overlapCountAsString = "0";

  for (
    let rangeIndex = 0;
    rangeIndex < freshIDStringRanges.length;
    rangeIndex++
  ) {
    const currentRangeSize = getRangeSizeAsString(
      freshIDStringRanges[rangeIndex]
    );
    totalSizeAsString = addNumbersAsStrings(
      totalSizeAsString,
      currentRangeSize
    );

    for (
      let innerRangeIndex = 0;
      innerRangeIndex < rangeIndex;
      innerRangeIndex++
    ) {
      const currentOverlapRange = getOverlapRangeOfTwoRanges(
        freshIDStringRanges[rangeIndex],
        freshIDStringRanges[innerRangeIndex]
      );
      const overlapSize = getRangeSizeAsString(currentOverlapRange);
      overlapCountAsString = addNumbersAsStrings(
        overlapCountAsString,
        overlapSize
      );
    }
  }

  return subtractNumbersAsStrings(totalSizeAsString, overlapCountAsString);
};

const isNumberAsStringWithinStringRange = (numberAsString, stringRange) =>
  [0, 1].includes(
    getNumericComparisonResult(numberAsString, stringRange.fromAsString)
  ) &&
  [0, -1].includes(
    getNumericComparisonResult(numberAsString, stringRange.toAsString)
  );

const getNumericComparisonResult = (
  // works
  firstNumberAsString,
  secondNumberAsString
) => {
  if (firstNumberAsString.length !== secondNumberAsString.length) {
    return firstNumberAsString.length > secondNumberAsString.length ? 1 : -1;
  }

  if (firstNumberAsString > secondNumberAsString) return 1;
  if (firstNumberAsString < secondNumberAsString) return -1;
  return 0;
};

const getRangeSizeAsString = (range) => {
  //works
  const { fromAsString, toAsString } = range;
  // If from > to, there's no valid range (size = 0)
  if (getNumericComparisonResult(fromAsString, toAsString) === 1) {
    return "0";
  }
  // size = to - from + 1
  const diff = subtractNumbersAsStrings(toAsString, fromAsString);
  return addNumbersAsStrings(diff, "1");
};

const getOverlapRangeOfTwoRanges = (rangeOne, rangeTwo) => {
  //works
  const oneToVSTwoTo = getNumericComparisonResult(
    rangeOne.toAsString,
    rangeTwo.toAsString
  );
  const oneToVSTwoFrom = getNumericComparisonResult(
    rangeOne.toAsString,
    rangeTwo.fromAsString
  );
  const oneFromVSTwoTo = getNumericComparisonResult(
    rangeOne.fromAsString,
    rangeTwo.toAsString
  );
  const oneFromVSTwoFrom = getNumericComparisonResult(
    rangeOne.fromAsString,
    rangeTwo.fromAsString
  );

  if (oneToVSTwoFrom === -1 || oneFromVSTwoTo === 1) {
    return {
      fromAsString: "1",
      toAsString: "0",
    };
  }

  if ([0, 1].includes(oneToVSTwoTo) && [0, -1].includes(oneFromVSTwoFrom)) {
    return rangeTwo;
  }

  if ([0, -1].includes(oneToVSTwoTo) && [0, 1].includes(oneFromVSTwoFrom)) {
    return rangeOne;
  }

  if ([0, 1].includes(oneToVSTwoTo)) {
    return {
      fromAsString: rangeOne.fromAsString,
      toAsString: rangeTwo.toAsString,
    };
  }

  return {
    fromAsString: rangeTwo.fromAsString,
    toAsString: rangeOne.toAsString,
  };
};

function addNumbersAsStrings(a, b) {
  //works
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  let out = [];

  while (i >= 0 || j >= 0 || carry) {
    const digitFromA = i >= 0 ? a.charCodeAt(i) - 48 : 0;
    const digitFromB = j >= 0 ? b.charCodeAt(j) - 48 : 0;
    const sum = digitFromA + digitFromB + carry;

    out.push(sum % 10);
    carry = Math.floor(sum / 10);

    i--;
    j--;
  }

  return out.reverse().join("");
}

function subtractNumbersAsStrings(a, b) {
  //works
  let negative = false;

  if (getNumericComparisonResult(a, b) === -1) {
    [a, b] = [b, a];
    negative = true;
  }

  let i = a.length - 1;
  let j = b.length - 1;
  let borrow = 0;
  let out = [];

  while (i >= 0) {
    const digitA = a.charCodeAt(i) - 48;
    const digitB = j >= 0 ? b.charCodeAt(j) - 48 : 0;

    let diff = digitA - digitB - borrow;

    if (diff < 0) {
      diff += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    out.push(diff);
    i--;
    j--;
  }

  while (out.length > 1 && out[out.length - 1] === 0) {
    out.pop();
  }

  const result = out.reverse().join("");

  return negative ? "-" + result : result;
}
