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
  let sideRoomCount = 0;
  let caveData = source.split('\n').map((line) =>
    line.split('').map((spot) => {
      if (spot === '.') {
        return {
          type: 'hallway',
          occupiedBy: spot,
        };
      }
      if (!!spot.match(/[A-Z]/)) {
        let spotObject = {
          type: 'sideRoom',
          sideRoomId: sideRoomCount,
          occupiedBy: spot,
        };
        sideRoomCount++;
        if (sideRoomCount === 4) sideRoomCount = 0;
        return spotObject;
      }
    })
  );
  console.log(caveData);
};

const isAtDesiredPlace = (x, y) => {};
