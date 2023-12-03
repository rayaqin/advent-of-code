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
  const maxRed = 12;
  const maxGreen = 13;
  const maxBlue = 14;
  return source
    .split("\r\n")
    .map(line => ({
      gameNumber: extractDigitsFromString(line.split(':')[0]),
      maxDraws: line.split(':')[1].split(';').reduce((acc, curr) => {
        curr.split(',').forEach(draw => {
          if (draw.includes('red')) {
            acc.r = Math.max(acc.r, parseInt(draw));
          }
          if (draw.includes('green')) {
            acc.g = Math.max(acc.g, parseInt(draw));
          }
          if (draw.includes('blue')) {
            acc.b = Math.max(acc.b, parseInt(draw));
          }
        })
        return acc;
      }, { r: 0, g: 0, b: 0 })
    }))
    .filter(gameData => gameData.maxDraws.r <= maxRed && gameData.maxDraws.b <= maxBlue && gameData.maxDraws.g <= maxGreen)
    .reduce((acc, curr) => acc + curr.gameNumber, 0)

};

const getSolutionForPart2 = (source) => {
  return source
    .split("\r\n")
    .map(line => ({
      gameNumber: extractDigitsFromString(line.split(':')[0]),
      maxDraws: line.split(':')[1].split(';').reduce((acc, curr) => {
        curr.split(',').forEach(draw => {
          const cubeCount = extractDigitsFromString(draw);
          if (draw.includes('red')) {
            acc.r = Math.max(acc.r, cubeCount);
          }
          if (draw.includes('green')) {
            acc.g = Math.max(acc.g, cubeCount);
          }
          if (draw.includes('blue')) {
            acc.b = Math.max(acc.b, cubeCount);
          }
        })
        return acc;
      }, { r: 0, g: 0, b: 0 })
    }))
    .map(gameData => gameData.maxDraws.r * gameData.maxDraws.g * gameData.maxDraws.b)
    .reduce((powerSum, currPower) => powerSum + currPower, 0)
};

const extractDigitsFromString = (s) => {
  return parseInt(s.split('').filter(ch => /\d/.test(ch)).join(''));
}
