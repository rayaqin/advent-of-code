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

  let hexToBinaryMap = {
    0: '0000',
    1: '0001',
    2: '0010',
    3: '0011',
    4: '0100',
    5: '0101',
    6: '0110',
    7: '0111',
    8: '1000',
    9: '1001',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111',
  };

  let packets = [];
  //operational: {versionNumber: '', typeId: '', lengthType: '', subPacketBits: ''}
  //literal: {versionNumber: '', typeId: '', binaryNumber: ''}

  let outermostPacket = source
    .split('')
    .map((hexChar) => hexToBinaryMap[hexChar])
    .join('');

  console.log(outermostPacket);

  for (let i = 0; i < outermostPacket.length; i++) {
    let currentPacket = {};
    currentPacket.versionNumber = outermostPacket.slice(i, i + 3);
    currentPacket.typeId = outermostPacket.slice(i + 3, i + 6);
    if (currentPacket.typeId === '100') {
      // literal packet
    } else {
      // operation packet
    }
  }
};

const convertBinaryToDecimal = (binaryString) => {
  let decimal = 0;
  binaryString
    .split('')
    .reverse()
    .forEach((b, i) => (decimal += parseInt(b) * Math.pow(2, i)));

  return decimal;
};
