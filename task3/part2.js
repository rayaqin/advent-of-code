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
  let oxygenGeneratorRating = getRating(diagnosticReport, 'oxygen');
  let CO2ScrubberRating = getRating(diagnosticReport, 'CO2');

  canvas.innerHTML +=
    '<br />' +
    '<br />' +
    '<br />' +
    '<b>Oxygen generator rating: </b>' +
    oxygenGeneratorRating +
    '<br />' +
    '<b>CO2 scrubber rating: </b>' +
    CO2ScrubberRating +
    '<br />' +
    '<b>Life support rating: </b>' +
    CO2ScrubberRating * oxygenGeneratorRating +
    '<br />';
};

const getRating = (report, typeOfRating) => {
  let remaining = [...report];

  canvas.innerHTML +=
    '<br />' +
    'Getting the following rating type: ' +
    typeOfRating +
    '...<br />';

  for (let i = 0; i < remaining[0].length; i++) {
    canvas.innerHTML += '<br />' + 'remaining lines of report: ' + remaining;
    let zeroes = 0;
    let ones = 0;

    remaining.forEach((line) => {
      line[i] === '0' ? zeroes++ : ones++;
    });

    canvas.innerHTML +=
      '<br />' +
      'more ' +
      (zeroes > ones ? 'zeroes' : 'ones') +
      ' at index ' +
      i;

    if (ones > zeroes || ones === zeroes) {
      canvas.innerHTML +=
        '<br />' +
        'removing lines with ' +
        (typeOfRating === 'oxygen' ? 'zeroes' : 'ones') +
        ' at index: ' +
        i;
      ('...');

      remaining.forEach((line, index) => {
        if (line[i] === (typeOfRating === 'oxygen' ? '0' : '1')) {
          remaining[index] = null;
        }
      });
    } else {
      canvas.innerHTML +=
        '<br />' +
        'removing lines with ' +
        (typeOfRating === 'oxygen' ? 'ones' : 'zeroes') +
        ' at index ' +
        i;

      remaining.forEach((line, index) => {
        ('...');
        if (line[i] === (typeOfRating === 'oxygen' ? '1' : '0')) {
          remaining[index] = null;
        }
      });
    }
    remaining = remaining.filter((a) => a !== null);
    canvas.innerHTML += '<br />';
    if (remaining.length === 1) {
      canvas.innerHTML += '<br />' + 'remaining lines of report: ' + remaining;
      break;
    }
  }
  return convertToDecimal(remaining[0].split(''));
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
