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
  const times = source.split("\r\n")[0].match(/\d+/g).map(Number);
  const records = source.split("\r\n")[1].match(/\d+/g).map(Number);
  const races = times.map((time, index) => ({ time: time, record: records[index] }));

  return races
    .map(race => getIntsBetweenNumbers(...getIntersections(race.time, race.record)))
    .reduce((solution, winningXs) => solution * winningXs.length, 1)
};

const getSolutionForPart2 = (source) => {
  let raceTime = parseInt(source.split("\r\n")[0].split('').filter(c => /\d/.test(c)).join(''));
  let record = parseInt(source.split("\r\n")[1].split('').filter(c => /\d/.test(c)).join(''));
  return getIntsBetweenNumbers(...getIntersections(raceTime, record)).length;
}

/*
 Returns the two x values where Tx-x^2=R using the quadratic formula,
 and if the results are integer values, it modifies them slightly to
 avoid including numbers that don't break the record, just match it.
*/
const getIntersections = (raceTime, record) => {
  let x1 = Math.round(((-raceTime + Math.sqrt(Math.pow(raceTime, 2) - (4 * record))) / -2) * 100) / 100;
  let x2 = Math.round(((-raceTime - Math.sqrt(Math.pow(raceTime, 2) - (4 * record))) / -2) * 100) / 100;
  if (x1 % 1 === 0) x1 = x1 + 0.1;
  if (x2 % 1 === 0) x2 = x2 - 0.1;
  return [x1, x2];
}

const getIntsBetweenNumbers = (lowerBound, upperBound) => {
  let integers = [];
  for (let i = Math.ceil(lowerBound); i <= Math.floor(upperBound); i++) {
    integers.push(i);
  }
  return integers;
}
