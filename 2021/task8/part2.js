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
  let entries = source.split("\n").map((a) => ({
    signalPatterns: a.split("|")[0].trim().split(" "),
    output: a.split("|")[1].trim().split(" "),
  }));

  let result = entries.reduce((acc, curr) => {
    return acc + calculateOutputValue(curr);
  }, 0);
  canvas.innerHTML += "<br />" + "<br />" + "sum: " + result;
};

const calculateOutputValue = (entry) => {
  let rightToWrongLetter = new Map();

  rightToWrongLetter.set("a", null);
  rightToWrongLetter.set("b", null);
  rightToWrongLetter.set("c", null);
  rightToWrongLetter.set("d", null);
  rightToWrongLetter.set("e", null);
  rightToWrongLetter.set("f", null);
  rightToWrongLetter.set("g", null);

  let lettersOfFour = entry.signalPatterns
    .find((a) => a.length === 4)
    .split("");
  let lettersOfOne = entry.signalPatterns.find((a) => a.length === 2).split("");
  let lettersOfSeven = entry.signalPatterns
    .find((a) => a.length === 3)
    .split("");
  let lettersOfEight = entry.signalPatterns
    .find((a) => a.length === 7)
    .split("");
  let patternsOfSix = entry.signalPatterns.filter((a) => a.length === 6);

  let commonAmongFives = [];
  let letterCounts = new Map();
  entry.signalPatterns.forEach((pattern) => {
    if (pattern.length === 5) {
      pattern.split("").forEach((l) => {
        letterCounts.set(l, letterCounts.get(l) ? letterCounts.get(l) + 1 : 1);
      });
    }
  });
  for (let key of letterCounts.keys()) {
    if (letterCounts.get(key) === 3) {
      commonAmongFives.push(key);
    }
  }

  for (let letter of rightToWrongLetter.keys()) {
    if (lettersOfFour.includes(letter) && commonAmongFives.includes(letter)) {
      rightToWrongLetter.set("d", letter);
    } else if (
      lettersOfSeven.includes(letter) &&
      commonAmongFives.includes(letter)
    ) {
      rightToWrongLetter.set("a", letter);
    } else if (
      lettersOfFour.includes(letter) &&
      !commonAmongFives.includes(letter) &&
      !lettersOfOne.includes(letter)
    ) {
      rightToWrongLetter.set("b", letter);
    } else if (
      !lettersOfFour.includes(letter) &&
      !commonAmongFives.includes(letter) &&
      lettersOfEight.includes(letter)
    ) {
      rightToWrongLetter.set("e", letter);
    } else if (
      lettersOfOne.includes(letter) &&
      findLetterFrequencyInPatterns(letter, patternsOfSix) === 2
    ) {
      rightToWrongLetter.set("c", letter);
    } else if (
      commonAmongFives.includes(letter) &&
      !lettersOfFour.includes(letter) &&
      !lettersOfSeven.includes(letter)
    ) {
      rightToWrongLetter.set("g", letter);
    } else {
      rightToWrongLetter.set("f", letter);
    }
  }
  canvas.innerHTML += "<br />" + "output code: " + entry.output.join(" ");
  let outputValue = getOutputValueFromDigits(entry.output, rightToWrongLetter);
  canvas.innerHTML += "<br />" + "value: " + outputValue + "<br />";
  return outputValue;
};

const findLetterFrequencyInPatterns = (letter, patterns) => {
  let count = 0;
  patterns.forEach((p) => p.includes(letter) && count++);
  return count;
};

const getOutputValueFromDigits = (outputDigits, rightToWrongMap) => {
  return outputDigits
    .map((output) => {
      if (output.length === 2) {
        return 1;
      }
      if (output.length === 4) {
        return 4;
      }
      if (output.length === 3) {
        return 7;
      }
      if (output.length === 7) {
        return 8;
      }
      if (output.length === 5) {
        if (output.split("").includes(rightToWrongMap.get("e"))) {
          return 2;
        }
        if (output.split("").includes(rightToWrongMap.get("b"))) {
          return 5;
        }
        return 3;
      }
      if (output.length === 6) {
        if (!output.split("").includes(rightToWrongMap.get("d"))) {
          return 0;
        }
        if (output.split("").includes(rightToWrongMap.get("c"))) {
          return 9;
        }
        return 6;
      }
    })
    .reverse()
    .reduce((acc, curr, index) => {
      return acc + curr * Math.pow(10, index);
    }, 0);
};
