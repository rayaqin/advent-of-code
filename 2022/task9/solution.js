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
  const headMovements = source
    .split("\r\n")
    .map((line) => ({ direction: line[0], numberOfSteps: parseInt(line.split(" ")[1]) }));

  let headPosition = {
    x: 0,
    y: 0,
  };

  let tailPosition = {
    x: 0,
    y: 0,
  };

  const locationsVisitedByTailSet = new Set();
  locationsVisitedByTailSet.add("0,0");

  headMovements.forEach((headMovement) => {
    let xModifier = 0;
    let yModifier = 0;
    if (headMovement.direction === "R") xModifier = 1;
    if (headMovement.direction === "L") xModifier = -1;
    if (headMovement.direction === "D") yModifier = 1;
    if (headMovement.direction === "U") yModifier = -1;

    for (let i = 0; i < headMovement.numberOfSteps; i++) {
      headPosition.x += xModifier;
      headPosition.y += yModifier;
      tailPosition = getNewTailPosition(tailPosition, headPosition);
      locationsVisitedByTailSet.add(`${tailPosition.x},${tailPosition.y}`);
    }
  });

  return locationsVisitedByTailSet.size;
};

const getSolutionForPart2 = (source) => {
  const headMovements = source
    .split("\r\n")
    .map((line) => ({ direction: line[0], numberOfSteps: parseInt(line.split(" ")[1]) }));

  const head = {
    id: 0,
    head: undefined,
    tail: undefined,
    x: 0,
    y: 0,
  };

  addTails(head, 9);

  const locationsVisitedByTailSet = new Set();
  locationsVisitedByTailSet.add("0,0");

  headMovements.forEach((headMovement) => {
    let xModifier = 0;
    let yModifier = 0;
    if (headMovement.direction === "R") xModifier = 1;
    if (headMovement.direction === "L") xModifier = -1;
    if (headMovement.direction === "D") yModifier = 1;
    if (headMovement.direction === "U") yModifier = -1;

    for (let i = 0; i < headMovement.numberOfSteps; i++) {
      head.x += xModifier;
      head.y += yModifier;
      propagateTailMovement(head.tail, head, locationsVisitedByTailSet);
    }
  });

  return locationsVisitedByTailSet.size;
};

const addTails = (head, tailNumber) => {
  let currentNode = head;
  for (let i = 0; i < tailNumber; i++) {
    let newTail = {
      id: i + 1,
      head: currentNode,
      tail: undefined,
      x: head.x,
      y: head.y,
    };
    currentNode.tail = newTail;
    currentNode = currentNode.tail;
  }
  return head;
};

const propagateTailMovement = (tail, head, locationsVisitedByTailSet) => {
  if (tail !== undefined) {
    getNewTailPosition(tail, head);
    if (tail.id === 9) locationsVisitedByTailSet.add(`${tail.x},${tail.y}`);
    propagateTailMovement(tail.tail, tail, locationsVisitedByTailSet);
  }
  return head;
};

const getNewTailPosition = (tailPosition, headPosition) => {
  const xDistance = Math.abs(tailPosition.x - headPosition.x);
  const yDistance = Math.abs(tailPosition.y - headPosition.y);
  if (xDistance <= 1 && yDistance <= 1) {
    return tailPosition;
  }
  if (tailPosition.x > headPosition.x) {
    tailPosition.x--;
  }
  if (tailPosition.x < headPosition.x) {
    tailPosition.x++;
  }
  if (tailPosition.y > headPosition.y) {
    tailPosition.y--;
  }
  if (tailPosition.y < headPosition.y) {
    tailPosition.y++;
  }
  return tailPosition;
};
