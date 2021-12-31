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
  let positions = source.split('\n').map((line) => +line.split(': ')[1]);
  let playerOnePosition = parseInt(source.split('\n')[0].split('').pop());
  let playerTwoPosition = parseInt(source.split('\n')[1].split('').pop());
  const rolls = [1, 2, 3];

  const wins = [0, 0];

  let gameCounts = {
    [`${playerOnePosition},${playerTwoPosition};0,0`]: 1,
  };

  while (Object.entries(gameCounts).length > 0) {
    for (let i = 0; i < 2; i++) {
      const nextGameCounts = {};
      for (let [state, gameCount] of Object.entries(gameCounts)) {
        [positions, scores] = state.split(';').map((s) => s.split(',').map((a) => parseInt(a)));

        for (let r1 of rolls) {
          for (let r2 of rolls) {
            for (let r3 of rolls) {
              const nextPositions = [positions[0], positions[1]];
              nextPositions[i] = ((positions[i] + r1 + r2 + r3 - 1) % 10) + 1; // bc 10 should not result in 0

              const nextScores = [scores[0], scores[1]];
              nextScores[i] += nextPositions[i];

              if (nextScores[i] >= 21) {
                wins[i] += gameCount;
                continue;
              }

              const nextState = `${nextPositions[0]},${nextPositions[1]};${nextScores[0]},${nextScores[1]}`;
              nextGameCounts[nextState] = (nextGameCounts[nextState] ?? 0) + gameCount;
            }
          }
        }
      }
      gameCounts = nextGameCounts;
    }
  }

  console.log(Math.max(wins[0], wins[1]));
};
