if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log('File APIs are supported in your browser, you may proceed.');
} else {
  alert(
    "The File APIs are not fully supported in this browser. The code won't work."
  );
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
  const depthLevels = source.split('\n').map((d) => parseInt(d));
  const depthChanges = [
    { depth: depthLevels[0], change: 'n/a - no previous measurement' },
  ];
  let numberOfDepthIncreases = 0;

  for (let i = 0; i < depthLevels.length - 1; i++) {
    let change = '';

    if (depthLevels[i] === depthLevels[i + 1]) {
      change = 'no change';
    } else if (depthLevels[i] < depthLevels[i + 1]) {
      change = 'increased';
      numberOfDepthIncreases++;
    } else {
      change = 'decreased';
    }

    depthChanges.push({
      depth: depthLevels[i + 1],
      change: change,
    });
  }

  canvas.innerHTML =
    '<b>Depth changes</b>' +
    '<br />' +
    depthChanges.map((dc) => {
      return '<br />' + dc.depth + ' - ' + dc.change;
    }) +
    '<br />' +
    '<br />' +
    'Number of depth increases: ' +
    numberOfDepthIncreases;
};
