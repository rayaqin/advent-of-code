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

  let elementPairToCount = new Map();

  for (let i = 0; i < polymer.length - 1; i++) {
    let pair = polymer[i] + polymer[i + 1];
    elementPairToCount.set(
      pair,
      elementPairToCount.get(pair) ? elementPairToCount.get(pair) + 1 : 1,
    );
  }

  let newElementToPairCount = new Map();
  let counts = new Map();

  polymer
    .split("")
    .forEach((a) => counts.set(a, counts.get(a) ? counts.get(a) + 1 : 1));

  for (let i = 0; i < 40; i++) {
    for (const pair of elementPairToCount.keys()) {
      let elementToInsert = instructions.get(pair);
      let newPair1 = pair[0] + elementToInsert;
      let newPair2 = elementToInsert + pair[1];

      newElementToPairCount.set(
        newPair1,
        newElementToPairCount.get(newPair1)
          ? newElementToPairCount.get(newPair1) + elementPairToCount.get(pair)
          : elementPairToCount.get(pair),
      );
      newElementToPairCount.set(
        newPair2,
        newElementToPairCount.get(newPair2)
          ? newElementToPairCount.get(newPair2) + elementPairToCount.get(pair)
          : elementPairToCount.get(pair),
      );

      counts.set(
        elementToInsert,
        counts.get(elementToInsert)
          ? counts.get(elementToInsert) + elementPairToCount.get(pair)
          : elementPairToCount.get(pair),
      );
    }
    elementPairToCount = new Map(newElementToPairCount);
    newElementToPairCount = new Map();
  }

  let countValues = [];
  for (let cv of counts.keys()) {
    countValues.push(counts.get(cv));
  }

  let sortedCountValues = countValues.sort((a, b) => a - b);

  console.log(
    sortedCountValues[sortedCountValues.length - 1] - sortedCountValues[0],
  );
};
