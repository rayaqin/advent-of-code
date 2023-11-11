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
  const restoredGAP = provideInputs([...gravityAssistProgram], 12, 2);
  return executeOpcodes([...restoredGAP])[0];
};

const getSolutionForPart2 = (source) => {
  const gravityAssistProgram = source.split(",").map(p => parseInt(p));
  const desiredOutput = 19690720;
  for (let noun = 0; noun < 99; noun++) {
    for (let verb = 0; verb < 99; verb++) {
      const valueAtZero = executeOpcodes(provideInputs([...gravityAssistProgram], noun, verb))[0];
      if (valueAtZero === desiredOutput) {
        return 100 * noun + verb;
      }
    }
  }
  return "something went wrong";
};

const provideInputs = (GAP, n, v) => {
  GAP[1] = n;
  GAP[2] = v;
  return GAP;
}

const executeOpcodes = (GAP) => {
  let opcode = NaN;
  let posOfOpcode = 0;
  while (opcode !== 99) {
    opcode = GAP[posOfOpcode];
    if (opcode === 1) {
      GAP[GAP[posOfOpcode + 3]] = GAP[GAP[posOfOpcode + 1]] + GAP[GAP[posOfOpcode + 2]];
      posOfOpcode += 4;
    } else if (opcode === 2) {
      GAP[GAP[posOfOpcode + 3]] = GAP[GAP[posOfOpcode + 1]] * GAP[GAP[posOfOpcode + 2]];
      posOfOpcode += 4;
    }
  }
  return GAP;
}
