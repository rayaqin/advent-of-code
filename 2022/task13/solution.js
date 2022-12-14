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

const getSolutionForPart1 = (source) => {
  return source
    .split("\r\n\r\n")
    .map((pair) => validatePackets(pair.split("\r\n")[0], pair.split("\r\n")[1]))
    .reduce((acc, curr, index) => (curr === "valid" || curr === "continue" ? acc + index + 1 : acc), 0);
};

const getSolutionForPart2 = (source) => {
  return [...source.split("\r\n").filter((packet) => packet !== ""), "[[2]]", "[[6]]"]
    .sort(comparePackets)
    .reduce((acc, curr, index) => (curr === "[[2]]" || curr === "[[6]]" ? acc * (index + 1) : acc * 1), 1);
};

const comparePackets = (leftPacketString, rightPacketString) => {
  const validationResult = validatePackets(leftPacketString, rightPacketString);
  if (validationResult === "valid" || validationResult === "continue") {
    return -1;
  }
  return 1;
};

const validatePackets = (leftPacketString, rightPacketString) => {
  let i = 0;
  let j = 0;
  leftPacketString = leftPacketString.slice(1, leftPacketString.length - 1);
  rightPacketString = rightPacketString.slice(1, rightPacketString.length - 1);
  while (true) {
    let leftValue = leftPacketString[i];
    let rightValue = rightPacketString[j];

    if (!leftValue && !rightValue) {
      return "continue";
    }
    if (!leftValue) {
      return "valid";
    }
    if (!rightValue) {
      return "invalid";
    }

    if (leftValue === "," && rightValue === ",") {
      i++;
      j++;
      continue;
    }

    // check if left is a 2-digit number
    if (!isNaN(leftValue) && !isNaN(leftPacketString[i + 1])) {
      leftValue += leftPacketString[i + 1];
      i++;
    }
    // check if right is a 2-digit number
    if (!isNaN(rightValue) && !isNaN(rightPacketString[j + 1])) {
      rightValue += rightPacketString[j + 1];
      j++;
    }

    if (!isNaN(leftValue) && !isNaN(rightValue)) {
      if (parseInt(leftValue) === parseInt(rightValue)) {
        i++;
        j++;
        continue;
      }
      if (parseInt(leftValue) > parseInt(rightValue)) {
        return "invalid";
      }
      if (parseInt(leftValue) < parseInt(rightValue)) {
        return "valid";
      }
    }
    if (leftValue === "[" || rightValue === "[") {
      const leftList = leftValue.length > 1 ? `[${leftValue}]` : sliceNextListFromString(leftPacketString.slice(i));
      const rightList = rightValue.length > 1 ? `[${rightValue}]` : sliceNextListFromString(rightPacketString.slice(j));
      const subPacketValidity = validatePackets(leftList, rightList);
      if (subPacketValidity === "continue") {
        i += leftValue === "[" ? leftList.length : 1; // jump to after end of list
        j += rightValue === "[" ? rightList.length : 1; // jump to after end of list
        continue;
      }
      return subPacketValidity;
    }
    return "continue";
  }
};

const sliceNextListFromString = (string) => {
  if (!isNaN(string[0])) {
    return `[${string[0]}]`;
  }
  let openingsCount = 1;
  for (let i = 1; i < string.length; i++) {
    if (string[i] === "[") {
      openingsCount++;
      continue;
    }
    if (string[i] === "]") {
      openingsCount--;
      if (openingsCount === 0) {
        return string.slice(0, i + 1);
      }
    }
  }
};
