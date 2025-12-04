if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log("File APIs are supported in your browser, you may proceed.");
} else {
  alert(
    "The File APIs are not fully supported in this browser. The code won't work.",
  );
}

const chooseFile = document.getElementById("choose-file");
const inputWrapper = document.getElementById("input-wrapper");
const canvasWrapper = document.getElementById("canvas-wrapper");
const canvas = document.getElementById("canvas");

const handleFileSelect = (event) => {
  const reader = new FileReader();
  reader.readAsText(event.target.files[0]);
  reader.onload = (e) => solution(e.target.result);
};

const swapToCanvas = () => {
  inputWrapper.style.display = "none";
  chooseFile.style.display = "none";
  canvasWrapper.style.display = "block";
};

chooseFile.addEventListener("change", handleFileSelect, false);

const solution = (source) => {
  swapToCanvas();
  let rawInputParts = source.split("\n\n");
  let polymer = rawInputParts[0];
  let instructions = new Map();
  rawInputParts[1]
    .split("\n")
    .forEach((line) =>
      instructions.set(line.split("->")[0].trim(), line.split("->")[1].trim()),
    );

  for (let i = 0; i < 10; i++) {
    polymer = getNewPolymerAfterOneStep(polymer, instructions);
  }
  let counts = {};
  let count;

  for (let i = 0; i < polymer.length; i++) {
    count = counts[polymer.charAt(i)];
    counts[polymer.charAt(i)] = count ? count + 1 : 1;
  }

  console.log(counts, counts[Object.keys(counts)[0]]);

  let leastCommonLetter = Object.keys(counts).reduce((acc, curr) => {
    return counts[curr] < counts[acc] ? curr : acc;
  }, Object.keys(counts)[0]);

  let mostCommonLetter = Object.keys(counts).reduce((acc, curr) => {
    return counts[curr] > counts[acc] ? curr : acc;
  }, Object.keys(counts)[0]);

  console.log(counts[mostCommonLetter] - counts[leastCommonLetter]);
};

const getNewPolymerAfterOneStep = (polymer, instructions) => {
  let polymerData = polymer.split("").map((c) => ({ char: c, original: true }));
  for (let i = 0; i < polymerData.length - 1; i++) {
    let pair = polymerData[i].char + polymerData[i + 1].char;
    if (
      polymerData[i].original &&
      polymerData[i + 1].original &&
      !!instructions.get(pair)
    ) {
      polymerData = [
        ...polymerData.slice(0, i + 1),
        { char: instructions.get(pair), original: false },
        ...polymerData.slice(i + 1),
      ];
    }
  }
  return polymerData.map((a) => a.char).join("");
};
