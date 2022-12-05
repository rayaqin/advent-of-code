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

const rock = {};
const paper = {};
const scissors = {};

rock.beats = scissors;
rock.score = 1;

paper.beats = rock;
paper.score = 2;

scissors.beats = paper;
scissors.score = 3;

const scoreMap = {
  win: 6,
  draw: 3,
  loss: 0,
};

const getSolutionForPart1 = (source) => {
  const guide = source.split("\r\n").map((row) => ({ first: row.split(" ")[0], second: row.split(" ")[1] }));

  const symbolToShapeMap = {
    A: rock,
    X: rock,
    B: paper,
    Y: paper,
    C: scissors,
    Z: scissors,
  };

  let playerScore = 0;

  guide.forEach((match) => {
    const opponentShape = symbolToShapeMap[match.first];
    const ourShape = symbolToShapeMap[match.second];

    playerScore += ourShape.score + scoreMap[getMatchResultFromShapes(opponentShape, ourShape)];
  });

  return playerScore;
};

const getSolutionForPart2 = (source) => {
  const guide = source.split("\r\n").map((row) => ({ first: row.split(" ")[0], second: row.split(" ")[1] }));

  const symbolToShapeMap = {
    A: rock,
    B: paper,
    C: scissors,
  };

  const symbolToDesiredResultMap = {
    X: "lose",
    Y: "draw",
    Z: "win",
  };

  let playerScore = 0;

  guide.forEach((match) => {
    const opponentShape = symbolToShapeMap[match.first];
    const desiredResult = symbolToDesiredResultMap[match.second];
    const ourShape = getNeededResponseShape(opponentShape, desiredResult);

    playerScore += ourShape.score + scoreMap[getMatchResultFromShapes(opponentShape, ourShape)];
  });

  return playerScore;
};

const getMatchResultFromShapes = (opponentShape, ourShape) => {
  if (opponentShape === ourShape) {
    return "draw";
  }
  if (opponentShape.beats === ourShape) {
    return "loss";
  }
  return "win";
};

const getNeededResponseShape = (opponentShape, desiredResult) => {
  if (desiredResult === "draw") {
    return opponentShape;
  }
  if (desiredResult === "lose") {
    return opponentShape.beats;
  }
  if (desiredResult === "win") {
    return opponentShape.beats.beats;
  }
};
