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
  let positions = source
    .split(',')
    .map((a) => parseInt(a))
    .sort((a, b) => a - b);
  let positionsMap = new Map();
  positions.forEach((p) => {
    positionsMap.set(p, (positionsMap.get(p) ?? 0) + 1);
  });

  console.log(positions);

  let bestMeetingHeight = { num: 0, fuelUsed: null };
  for (let i = Math.min(...positions); i < Math.max(...positions); i++) {
    let fuelUsed = 0;
    positions.forEach((p) => {
      fuelUsed += Math.abs(p - i);
    });
    if (
      bestMeetingHeight.fuelUsed === null ||
      fuelUsed < bestMeetingHeight.fuelUsed
    ) {
      bestMeetingHeight.num = i;
      bestMeetingHeight.fuelUsed = fuelUsed;
    }
  }
  console.log(bestMeetingHeight);
};
