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
  let heightMatrix = source.split('\n').map((line) => {
    return line.split('').map((c) => parseInt(c));
  });

  let lowPoints = [];
  for (let x = 0; x < heightMatrix.length; x++) {
    for (let y = 0; y < heightMatrix[0].length; y++) {
      if (
        (x - 1 < 0 || heightMatrix[x][y] < heightMatrix[x - 1][y]) &&
        (x === heightMatrix.length - 1 || heightMatrix[x][y] < heightMatrix[x + 1][y]) &&
        (y - 1 < 0 || heightMatrix[x][y] < heightMatrix[x][y - 1]) &&
        (y === heightMatrix[0].length - 1 || heightMatrix[x][y] < heightMatrix[x][y + 1])
      ) {
        lowPoints.push({ x: x, y: y, value: heightMatrix[x][y] });
      }
    }
  }
  let basins = [];
  lowPoints.forEach((lp) => {
    let basinNumbers = [];

    findAndFillBasinNumbers(lp.x, lp.y, heightMatrix, basinNumbers);
    basins.push(basinNumbers);
  });

  canvas.innerHTML +=
    'basins: ' +
    basins.map(
      (basin) => '<br >' + '<br >' + basin.map((n) => '[' + n[0] + ', ' + n[1] + ']') + '<br >' + 'size: ' + basin.length
    );
  let sortedBasinSizes = basins.map((a) => a.length).sort((a, b) => b - a);

  sortedBasinSizes.length >= 2 &&
    (canvas.innerHTML +=
      '<br >' +
      '<br >' +
      '3 largest basin sizes multiplied: ' +
      sortedBasinSizes[0] * sortedBasinSizes[1] * sortedBasinSizes[2]);
};

const findAndFillBasinNumbers = (x, y, heightMatrix, basinNumbers) => {
  if (heightMatrix[x][y] === 9) return;
  if (coordinatesAlreadyAdded([x, y], basinNumbers)) {
    return;
  }
  basinNumbers.push([x, y]);

  if (x + 1 < heightMatrix.length && heightMatrix[x + 1][y] >= heightMatrix[x][y]) {
    findAndFillBasinNumbers(x + 1, y, heightMatrix, basinNumbers);
  }
  if (x - 1 >= 0 && heightMatrix[x - 1][y] >= heightMatrix[x][y]) {
    findAndFillBasinNumbers(x - 1, y, heightMatrix, basinNumbers);
  }
  if (y + 1 < heightMatrix[0].length && heightMatrix[x][y + 1] >= heightMatrix[x][y]) {
    findAndFillBasinNumbers(x, y + 1, heightMatrix, basinNumbers);
  }
  if (y - 1 >= 0 && heightMatrix[x][y - 1] >= heightMatrix[x][y]) {
    findAndFillBasinNumbers(x, y - 1, heightMatrix, basinNumbers);
  }
  return;
};

const doCoordinatesMatch = (coordinates1, coordinates2) => {
  return coordinates1[0] === coordinates2[0] && coordinates1[1] === coordinates2[1];
};

const coordinatesAlreadyAdded = (coordinates, array) => {
  return array.some((c) => doCoordinatesMatch(coordinates, c));
};
