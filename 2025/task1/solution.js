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
  return source
    .split("\n")
    .map(
      (rotationInstruction) =>
        Number(rotationInstruction.slice(1)) *
        (rotationInstruction[0] === "L" ? -1 : 1)
    )
    .reduce(
      (dialData, rotationDistance) => {
        // console.log("dialPosition before: ", dialData.dialPosition);
        // console.log("rotation required: ", rotationDistance);

        dialData.dialPosition = getNewDialPosition({
          currentDialPosition: dialData.dialPosition,
          rotationDistance: rotationDistance,
          dialLength: 100,
        });

        // console.log("rotation result: ", dialData.dialPosition);
        if (dialData.dialPosition === 0) {
          dialData.zeroVisitCount++;
        }
        return dialData;
      },
      { dialPosition: 50, zeroVisitCount: 0 }
    ).zeroVisitCount;
};

const getSolutionForPart2 = (source) => {
  const dialLength = 100;
  return source
    .split("\n")
    .map(
      (rotationInstruction) =>
        Number(rotationInstruction.slice(1)) *
        (rotationInstruction[0] === "L" ? -1 : 1)
    )
    .reduce(
      (dialData, rotationDistance) => {
        console.log("zeroVisitCount before: ", dialData.zeroVisitCount);
        console.log("dialPosition before: ", dialData.dialPosition);
        console.log("rotation required: ", rotationDistance);

        const dialChangeFromZero = getDialChangeFromZero({
          currentDialPosition: dialData.dialPosition,
          rotationDistance: rotationDistance,
          dialLength: dialLength,
        });

        const previousDialPosition = dialData.dialPosition;

        dialData.dialPosition = getNewDialPosition({
          dialChangeFromZero: dialChangeFromZero,
          dialLength: dialLength,
        });

        console.log("dialPosition after: ", dialData.dialPosition);

        dialData.zeroVisitCount += getZeroCrosses({
          previousDialPosition: previousDialPosition,
          rotationDistance: rotationDistance,
          dialLength: dialLength,
          newDialPosition: dialData.dialPosition,
        });
        console.log("zeroVisitCount after: ", dialData.zeroVisitCount);
        console.log("------------------------------");
        return dialData;
      },
      { dialPosition: 50, zeroVisitCount: 0 }
    );
};

const getDialChangeFromZero = ({
  currentDialPosition,
  rotationDistance,
  dialLength,
}) => (currentDialPosition + rotationDistance) % dialLength;

const getNewDialPosition = ({ dialChangeFromZero, dialLength }) => {
  if (dialChangeFromZero < 0) return dialLength + dialChangeFromZero;

  return dialChangeFromZero;
};

const getZeroCrosses = ({
  previousDialPosition,
  rotationDistance,
  dialLength,
  newDialPosition,
}) => {
  if (rotationDistance === 0) return 0;

  if (rotationDistance > 0) {
    if (previousDialPosition + rotationDistance >= dialLength) {
      return Math.floor((previousDialPosition + rotationDistance) / dialLength);
    }

    return 0;
  }
  if (previousDialPosition + rotationDistance <= 0) {
    return (
      Math.floor(
        Math.abs(previousDialPosition + rotationDistance) / dialLength
      ) + Number(previousDialPosition !== 0 || newDialPosition === 0)
    );
  }

  return 0;
};
