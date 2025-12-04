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
  let heightMatrix = source.split("\n").map((line) => {
    return line.split("").map((c) => parseInt(c));
  });

  let lowPoints = [];
  for (let x = 0; x < heightMatrix.length; x++) {
    for (let y = 0; y < heightMatrix[0].length; y++) {
      if (
        (x - 1 < 0 || heightMatrix[x][y] < heightMatrix[x - 1][y]) &&
        (x === heightMatrix.length - 1 ||
          heightMatrix[x][y] < heightMatrix[x + 1][y]) &&
        (y - 1 < 0 || heightMatrix[x][y] < heightMatrix[x][y - 1]) &&
        (y === heightMatrix[0].length - 1 ||
          heightMatrix[x][y] < heightMatrix[x][y + 1])
      ) {
        lowPoints.push(heightMatrix[x][y]);
      }
    }
  }
  canvas.innerHTML += "<br />" + "low points: " + lowPoints;
  canvas.innerHTML +=
    "<br />" +
    "danger level: " +
    lowPoints.reduce((acc, curr) => acc + curr + 1, 0);
};
