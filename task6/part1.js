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
  let lanternfish = source.split(',').map((f) => parseInt(f));
  console.log(lanternfish);
  for (let i = 0; i < 18; i++) {
    console.log(simulateBreedingCycle(lanternfish));
  }
};

const simulateBreedingCycle = (lanternfish) => {
  const currentLength = lanternfish.length;
  for (let i = 0; i < currentLength; i++) {
    if (lanternfish[i] === 0) {
      lanternfish[i] = 6;
      lanternfish.push(8);
    } else {
      lanternfish[i]--;
    }
  }
  return lanternfish;
};
