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
  let lanternfish = source
    .split(',')
    .map((f) => parseInt(f))
    .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
  console.log(lanternfish);

  for (let i = 0; i <= 8; i++) {
    if (!lanternfish.get(i)) lanternfish.set(i, 0);
  }

  for (let i = 0; i < 256; i++) {
    lanternfish = executeBreedingCycle(lanternfish);
  }
  let sum = 0;

  lanternfish.forEach((fishCount) => {
    sum += fishCount;
  });

  console.log(sum);
};

const executeBreedingCycle = (fishMap) => {
  const nextFishMap = new Map();
  for (let i = 0; i <= 8; i++) {
    nextFishMap.set(i, 0);
  }

  for (let fishkind = 8; fishkind >= 0; fishkind--) {
    if (fishkind === 0) {
      nextFishMap.set(8, fishMap.get(0));
      nextFishMap.set(6, fishMap.get(0) + nextFishMap.get(6));
    } else {
      nextFishMap.set(fishkind - 1, fishMap.get(fishkind));
    }
  }
  console.log(nextFishMap);
  return nextFishMap;
};
