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

  const guide = source.split("\r\n").map((row) => ({ first: row.split(" ")[0], second: row.split(" ")[1] }));

  let playerScore = 0;

  guide.forEach((match) => {
    const opponentShape = getShapeFromSymbolPartOne(match.first, rock, paper, scissors);
    const ourShape = getShapeFromSymbolPartOne(match.second, rock, paper, scissors);

    playerScore += ourShape.score + scoreMap[getMatchResultFromShapes(opponentShape, ourShape)];
  });

  return playerScore;
};

const getSolutionForPart2 = (source) => {
  const guide = source.split("\r\n").map((row) => ({ first: row.split(" ")[0], second: row.split(" ")[1] }));
  let playerScore = 0;

  guide.forEach((match) => {
    const opponentShape = getShapeFromSymbolPartTwo(match.first, rock, paper, scissors);
    const desiredResult = getDesiredResultFromSymbol(match.second);
    const ourShape = getNeededResponseShape(opponentShape, desiredResult);

    playerScore += ourShape.score + scoreMap[getMatchResultFromShapes(opponentShape, ourShape)];
  });

  return playerScore;
};

const getShapeFromSymbolPartOne = (symbol, rock, paper, scissors) => {
  if (symbol === "A" || symbol === "X") {
    return rock;
  }
  if (symbol === "B" || symbol === "Y") {
    return paper;
  }
  if (symbol === "C" || symbol === "Z") {
    return scissors;
  }
};

const getShapeFromSymbolPartTwo = (symbol, rock, paper, scissors) => {
  if (symbol === "A") {
    return rock;
  }
  if (symbol === "B") {
    return paper;
  }
  if (symbol === "C") {
    return scissors;
  }
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

const getDesiredResultFromSymbol = (symbol) => {
  if (symbol === "X") {
    return "lose";
  }
  if (symbol === "Y") {
    return "draw";
  }
  if (symbol === "Z") {
    return "win";
  }
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
