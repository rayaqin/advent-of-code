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
  const algorithm = source
    .split('\n\n')[0]
    .split('')
    .map((a) => (a === '#' ? 1 : 0));

  let inputImage = source
    .split('\n\n')[1]
    .split('\n')
    .map((line) => line.split('').map((a) => (a === '#' ? 1 : 0)));

  let infiniteGridState = 0;

  console.log(algorithm, inputImage, addOuterRim(inputImage, infiniteGridState));

  for (let i = 0; i < 2; i++) {
    inputImage = performOneEnhancement(inputImage, infiniteGridState, algorithm);
    infiniteGridState = infiniteGridState ? 0 : 1;
  }
  console.log('state: ', infiniteGridState);
  console.log('lightPixelCount: ', countLightPixels(inputImage));
};

const addOuterRim = (image, gridState) => {
  let imageWithRim = Array.from(Array(image.length + 4), () => new Array(image[0].length + 4).fill(gridState));
  for (let i = 2; i < imageWithRim[0].length - 2; i++) {
    for (let j = 2; j < imageWithRim.length - 2; j++) {
      imageWithRim[j][i] = image[j - 2][i - 2];
    }
  }
  return imageWithRim;
};

const performOneEnhancement = (image, gridState, algorithm) => {
  let imageWithRim = addOuterRim(image, gridState);
  let outputImage = JSON.parse(JSON.stringify(imageWithRim));

  for (let i = 0; i < imageWithRim[0].length; i++) {
    for (let j = 0; j < imageWithRim.length; j++) {
      if (i === 0 || j == 0 || i === imageWithRim[0].length - 1 || j === imageWithRim.length - 1) {
        outputImage[j][i] = gridState ? 0 : 1;
        continue;
      }
      let binaryCodeInString =
        '' +
        imageWithRim[j - 1][i - 1] +
        imageWithRim[j - 1][i] +
        imageWithRim[j - 1][i + 1] +
        imageWithRim[j][i - 1] +
        imageWithRim[j][i] +
        imageWithRim[j][i + 1] +
        imageWithRim[j + 1][i - 1] +
        imageWithRim[j + 1][i] +
        imageWithRim[j + 1][i + 1];
      debugger;
      let decimalCode = convertBinaryToDecimal(binaryCodeInString);
      outputImage[j][i] = algorithm[decimalCode];
    }
  }
  return outputImage;
};

const convertBinaryToDecimal = (binaryString) => {
  let decimal = 0;
  binaryString
    .split('')
    .reverse()
    .forEach((b, i) => (decimal += parseInt(b) * Math.pow(2, i)));

  return decimal;
};

const countLightPixels = (image) => {
  let lightCount = 0;
  for (let i = 0; i < image[0].length; i++) {
    for (let j = 0; j < image.length; j++) {
      lightCount += image[i][j];
    }
  }
  return lightCount;
};
