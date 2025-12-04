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

let flashes = 0;

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
  let octopusGrid = source
    .split("\n")
    .map((line) =>
      line.split("").map((c) => ({ energy: parseInt(c), justFlashed: false })),
    );

  let ready = false;
  let stepCount = 0;
  while (!ready) {
    ready = performOneStep(octopusGrid);
    stepCount++;
  }

  console.log(stepCount);
};

const increaseEnergyLevel = (oGrid) => {
  for (let x = 0; x < oGrid.length; x++) {
    for (let y = 0; y < oGrid[x].length; y++) {
      oGrid[x][y].energy++;
    }
  }
};

const performOneStep = (oGrid) => {
  increaseEnergyLevel(oGrid);
  let oGridCopy = [];
  do {
    oGridCopy = JSON.parse(JSON.stringify(oGrid));
    performOneFlash(oGrid);
  } while (!areTwoGridsIdentical(oGrid, oGridCopy));
  return resetJustFlashed(oGrid);
};

const performOneFlash = (oGrid) => {
  for (let x = 0; x < oGrid.length; x++) {
    for (let y = 0; y < oGrid[x].length; y++) {
      if (oGrid[x][y].energy > 9 && oGrid[x][y].justFlashed === false) {
        flashes++;
        oGrid[x][y].justFlashed = true;
        if (x + 1 !== oGrid.length) oGrid[x + 1][y].energy++;
        if (y + 1 !== oGrid[x].length) oGrid[x][y + 1].energy++;
        if (x + 1 !== oGrid.length && y + 1 !== oGrid[x].length)
          oGrid[x + 1][y + 1].energy++;
        if (x - 1 >= 0) oGrid[x - 1][y].energy++;
        if (y - 1 >= 0) oGrid[x][y - 1].energy++;
        if (x - 1 >= 0 && y - 1 >= 0) oGrid[x - 1][y - 1].energy++;
        if (x + 1 !== oGrid.length && y - 1 >= 0) oGrid[x + 1][y - 1].energy++;
        if (x - 1 >= 0 && y + 1 !== oGrid[x].length)
          oGrid[x - 1][y + 1].energy++;
      }
    }
  }
};

const areTwoGridsIdentical = (oGrid1, oGrid2) => {
  for (let x = 0; x < oGrid1.length; x++) {
    for (let y = 0; y < oGrid1[x].length; y++) {
      if (oGrid1[x][y].energy !== oGrid2[x][y].energy) return false;
    }
  }
  return true;
};

const resetJustFlashed = (oGrid) => {
  let didAllFlash = true;
  for (let x = 0; x < oGrid.length; x++) {
    for (let y = 0; y < oGrid[x].length; y++) {
      if (oGrid[x][y].justFlashed === true) {
        oGrid[x][y].justFlashed = false;
        oGrid[x][y].energy = 0;
      } else {
        didAllFlash = false;
      }
    }
  }
  return didAllFlash;
};
