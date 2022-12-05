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

const priorities = {};
for (let i = 1; i <= 26; i++) {
  priorities[String.fromCharCode(64 + i)] = i + 26;
  priorities[String.fromCharCode(96 + i)] = i;
}

const getSolutionForPart1 = (source) => {
  let sumOfPriorities = 0;

  source.split("\r\n").map((rucksack) => {
    const leftCharacterArray = rucksack.slice(0, rucksack.length / 2).split("");
    const rightCharacterSet = new Set(rucksack.slice(rucksack.length / 2).split(""));
    sumOfPriorities += priorities[leftCharacterArray.find((packageType) => rightCharacterSet.has(packageType))];
  });
  return sumOfPriorities;
};

const getSolutionForPart2 = (source) => {
  let sumOfPriorities = 0;

  const rucksacks = source.split("\r\n").map((rucksack) => new Set(rucksack.split("")));

  for (let i = 0; i < rucksacks.length - 2; i += 3) {
    sumOfPriorities +=
      priorities[[...getIntersection(rucksacks[i], getIntersection(rucksacks[i + 1], rucksacks[i + 2]))][0]];
  }

  return sumOfPriorities;
};

const getIntersection = (set1, set2) => {
  return new Set([...set1].filter((packageType) => set2.has(packageType)));
};
