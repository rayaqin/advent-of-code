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

  let openToCloseTagMap = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
  };
  let tagToValueMap = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  };
  let tagToValueMap2 = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  };
  let lineCharArrays = source.split('\n').map((line) => {
    return line.trim().split('');
  });

  let openingsStack = [];
  let arrayOfTagsNeededForCompletion = [];

  lineCharArrays.forEach((lineArray) => {
    openingsStack = [];
    for (let i = 0; i < lineArray.length; i++) {
      if (Object.keys(openToCloseTagMap).includes(lineArray[i])) {
        openingsStack.push(lineArray[i]);
      } else if (lineArray[i] === openToCloseTagMap[openingsStack[openingsStack.length - 1]]) {
        openingsStack.pop();
      } else {
        break;
      }
      if (i === lineArray.length - 1 && openingsStack.length) {
        debugger;
        arrayOfTagsNeededForCompletion.push(openingsStack.reverse().map((c) => openToCloseTagMap[c]));
        break;
      }
    }
  });

  let completionPoints = arrayOfTagsNeededForCompletion
    .map((tags) => tags.reduce((acc, curr) => acc * 5 + tagToValueMap2[curr], 0))
    .sort((a, b) => a - b)[Math.floor((arrayOfTagsNeededForCompletion.length - 1) / 2)];

  canvas.innerHTML +=
    '<br />' +
    'tags needed for completion: ' +
    '<br />' +
    arrayOfTagsNeededForCompletion.map((a) => '<br />' + a.toString().replaceAll(',', ''));

  canvas.innerHTML += '<br />' + '<br />' + 'completion points: ' + completionPoints;
};
