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
  const gravityAssistProgram = source.split(",").map(p => parseInt(p));
  const output = [];
  executeOpcodes(gravityAssistProgram, output);
  return output;
};

const getSolutionForPart2 = (source) => {
  return "2";
};

const executeOpcodes = (GAP, output) => {
  let opcode = NaN;
  let posOfOpcode = 0;
  let inputValue = 1;
  while (opcode !== 99) {
    opcode = GAP[posOfOpcode]; // this has to be revised to get the right opcode form the 2 rightmost digits, then get the parameter modes also
    switch(opcode) {
      case 1:
        GAP[GAP[posOfOpcode + 3]] = GAP[GAP[posOfOpcode + 1]] + GAP[GAP[posOfOpcode + 2]];
        posOfOpcode += 4;
        break;
      case 2:
        GAP[GAP[posOfOpcode + 3]] = GAP[GAP[posOfOpcode + 1]] * GAP[GAP[posOfOpcode + 2]];
        posOfOpcode += 4;
        break;
      case 3:
        GAP[GAP[posOfOpcode + 1]] = inputValue;
        posOfOpcode += 2;
        break;
      case 4:
        output.push(GAP[GAP[posOfOpcode + 1]]);
        posOfOpcode += 2;
        break;
      default:
        throw new Error("Unknown opcode encountered");
    }
  }
  return GAP;
}
