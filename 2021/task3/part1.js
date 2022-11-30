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
  let diagnosticReport = source.split('\n');

  let gammaRateBinary = diagnosticReport[0].split('').map((bit, index) => {
    let zeroes = 0;
    let ones = 0;
    diagnosticReport.forEach((line) => {
      line[index] === '0' ? zeroes++ : ones++;
    });
    return zeroes > ones ? '0' : '1';
  });

  let epsilonRateBinary = diagnosticReport[0].split('').map((bit, index) => {
    let zeroes = 0;
    let ones = 0;
    diagnosticReport.forEach((line) => {
      line[index] === '0' ? zeroes++ : ones++;
    });
    return zeroes < ones ? '0' : '1';
  });

  canvas.innerHTML +=
    '<br />' +
    '<b>Gamma rate binary: </b>' +
    gammaRateBinary +
    '  ---  in decimal: ' +
    convertToDecimal(gammaRateBinary) +
    '<br />' +
    '<b>Epsilon rate binary: </b>' +
    epsilonRateBinary +
    '  ---  in decimal: ' +
    convertToDecimal(epsilonRateBinary) +
    '<br />' +
    '<b>Power consumption: </b>' +
    convertToDecimal(gammaRateBinary) * convertToDecimal(epsilonRateBinary) +
    '<br />';

  console.log(
    convertToDecimal(gammaRateBinary) * convertToDecimal(epsilonRateBinary)
  );
};

const convertToDecimal = (charArray) => {
  return charArray.reduce((acc, current, index) => {
    if (current == '1') {
      return acc + Math.pow(2, charArray.length - 1 - index);
    } else {
      return acc;
    }
  }, 0);
};
