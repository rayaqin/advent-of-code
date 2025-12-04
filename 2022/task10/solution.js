if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log("File APIs are supported in your browser, you may proceed.");
} else {
  alert(
    "The File APIs are not fully supported in this browser. The code won't work.",
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
  const commands = source.split("\r\n").map((cmd) => ({
    type: cmd.split(" ")[0],
    increaseBy:
      cmd.indexOf("noop") >= 0 ? undefined : parseInt(cmd.split(" ")[1]),
  }));

  let registerX = 1;
  let signalStrength = 0;
  let cycle = 1;
  let executionOngiong = false;
  let currentIncreaseValue = 0;

  for (let i = 0; i < commands.length; i++) {
    if (executionOngiong) {
      cycle++;
      executionOngiong = false;
      registerX += currentIncreaseValue;
      if (cycle === 20 || (cycle - 20) % 40 === 0) {
        signalStrength += cycle * registerX;
      }
    }
    if (commands[i].type === "noop") {
      cycle++;
      if (cycle === 20 || (cycle - 20) % 40 === 0) {
        signalStrength += cycle * registerX;
      }
      continue;
    }
    cycle++;
    executionOngiong = true;
    currentIncreaseValue = commands[i].increaseBy;
    if (cycle === 20 || (cycle - 20) % 40 === 0) {
      signalStrength += cycle * registerX;
    }
  }
  return signalStrength;
};

const getSolutionForPart2 = (source) => {
  const commands = source.split("\r\n").map((cmd) => ({
    type: cmd.split(" ")[0],
    increaseBy:
      cmd.indexOf("noop") >= 0 ? undefined : parseInt(cmd.split(" ")[1]),
  }));

  let registerX = 1;
  let cycle = 1;
  let executionOngiong = false;
  let currentIncreaseValue = 0;

  // this just creates a [6][40] matrix called screen, #JSThings
  let [r, c] = [6, 40];
  let screen = Array(r)
    .fill()
    .map(() => Array(c).fill(" "));

  for (let i = 0; i < commands.length; i++) {
    if (executionOngiong) {
      determinePixel(cycle, registerX, screen);
      cycle++;
      executionOngiong = false;
      registerX += currentIncreaseValue;
    }
    if (commands[i].type === "noop") {
      determinePixel(cycle, registerX, screen);
      cycle++;
      continue;
    }
    determinePixel(cycle, registerX, screen);
    cycle++;
    executionOngiong = true;
    currentIncreaseValue = commands[i].increaseBy;
  }

  return getScreenAsText(screen);
};

const getScreenAsText = (screen) => {
  let result = "\n";
  for (let y = 0; y < Object.keys(screen).length; y++) {
    let line = "";
    for (let x = 0; x < screen[0].length; x++) {
      line += screen[y][x];
    }
    result += line + "\n";
  }
  return result;
};

const determinePixel = (cycle, registerX, screen) => {
  const drawPosition = cycle - 1;
  screen[Math.floor(drawPosition / 40)][drawPosition % 40] =
    Math.abs((drawPosition % 40) - registerX) <= 1 ? "#" : ".";
};
