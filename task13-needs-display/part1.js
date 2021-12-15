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
  let origamiInputRaw = source.split('\n\n');
  let maxX = 0;
  let maxY = 0;
  let markCoordinates = origamiInputRaw[0].split('\n').map((cc) => {
    let x = parseInt(cc.split(',')[0]);
    let y = parseInt(cc.split(',')[1]);
    if (y > maxY) maxY = y;
    if (x > maxX) maxX = x;
    return { x: x, y: y };
  });
  let foldInstructions = origamiInputRaw[1].split('\n').map((instruction) => {
    return { axis: instruction.indexOf('y') >= 0 ? 'y' : 'x', position: parseInt(instruction.split('=')[1]) };
  });

  let newCoordinates = [];
  markCoordinates.forEach((c) => {
    let nc = flipCoordinateOnAxis(c, foldInstructions[0].axis, foldInstructions[0].position);
    if (!doesArrayContainCoordinates(newCoordinates, nc)) newCoordinates.push(nc);
  });

  console.log(newCoordinates);
};

const flipCoordinateOnAxis = (c, axis, position) => {
  return {
    x: axis === 'x' && c.x > position ? position - (c.x - position) : c.x,
    y: axis === 'y' && c.y > position ? position - (c.y - position) : c.y,
  };
};

const doesArrayContainCoordinates = (array, c) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].x === c.x && array[i].y === c.y) {
      return true;
    }
  }
  return false;
};
