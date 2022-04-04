if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log('File APIs are supported in your browser, you may proceed.');
} else {
  alert("The File APIs are not fully supported in this browser. The code won't work.");
}

const chooseFile = document.getElementById('choose-file');
const inputWrapper = document.getElementById('input-wrapper');
const canvasWrapper = document.getElementById('canvas-wrapper');
const canvas = document.getElementById('canvas');

const handleFileSelect = (event) => {
  const reader = new FileReader();
  reader.readAsText(event.target.files[0]);
  reader.onload = (e) => solution(e.target.result);
};

const swapToCanvas = () => {
  inputWrapper.style.display = 'none';
  chooseFile.style.display = 'none';
  canvasWrapper.style.display = 'block';
};

chooseFile.addEventListener('change', handleFileSelect, false);

const solution = (source) => {
  swapToCanvas();
  const wires = source.split('\n');
  console.log(wires);

  let shortestDistance = Number.MAX_SAFE_INTEGER;
  let wireOneSet = getSetOfDotsAsStringsFromCommands(wires[0].split(','));

  let currentPoint = { x: 0, y: 0 };
  wires[1].split(',').forEach((c) => {
    let length = parseInt(c.substring(1));
    let modifierX = 0;
    let modifierY = 0;
    if (c[0] === 'R') modifierX = 1;
    if (c[0] === 'L') modifierX = -1;
    if (c[0] === 'U') modifierY = 1;
    if (c[0] === 'D') modifierY = -1;

    for (let i = 0; i < length; i++) {
      currentPoint.x += modifierX;
      currentPoint.y += modifierY;
      if (wireOneSet.has(`x:${currentPoint.x},y:${currentPoint.y}`)) {
        shortestDistance = Math.min(getManhattanDistance(0, 0, currentPoint.x, currentPoint.y), shortestDistance);
      }
    }
  });
  console.log(shortestDistance);
};

const getSetOfDotsAsStringsFromCommands = (listOfCommands) => {
  let currentPoint = { x: 0, y: 0 };
  let pointArray = new Set();

  listOfCommands.forEach((c) => {
    let length = parseInt(c.substring(1));
    let modifierX = 0;
    let modifierY = 0;
    if (c[0] === 'R') modifierX = 1;
    if (c[0] === 'L') modifierX = -1;
    if (c[0] === 'U') modifierY = 1;
    if (c[0] === 'D') modifierY = -1;

    for (let i = 0; i < length; i++) {
      currentPoint.x += modifierX;
      currentPoint.y += modifierY;
      pointArray.add(`x:${currentPoint.x},y:${currentPoint.y}`);
    }
  });

  return pointArray;
};

const getManhattanDistance = (x1, x2, y1, y2) => {
  return Math.abs(x1 - y1) + Math.abs(x2 - y2);
};
