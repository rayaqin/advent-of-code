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
  let openToCloseTagMap = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
  };
  let tagToValueMap = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };
  let lineCharArrays = source.split("\n").map((line) => {
    return line.trim().split("");
  });

  let openingsStack = [];
  let charsCausingCorruption = [];

  lineCharArrays.forEach((lineArray) => {
    for (let i = 0; i < lineArray.length; i++) {
      if (Object.keys(openToCloseTagMap).includes(lineArray[i])) {
        openingsStack.push(lineArray[i]);
        continue;
      }
      if (
        lineArray[i] ===
        openToCloseTagMap[openingsStack[openingsStack.length - 1]]
      ) {
        openingsStack.pop();
      } else {
        charsCausingCorruption.push(lineArray[i]);
        break;
      }
    }
  });

  canvas.innerHTML +=
    "<br />" +
    "characters causing corruption: " +
    "<br />" +
    charsCausingCorruption.toString().replaceAll(",", "");
  ("<br />");

  canvas.innerHTML +=
    "<br />" +
    "<br />" +
    "syntax points: " +
    charsCausingCorruption.reduce((acc, curr) => acc + tagToValueMap[curr], 0);
};
