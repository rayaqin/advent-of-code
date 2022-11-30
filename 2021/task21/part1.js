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
  let playerOnePosition = parseInt(source.split('\n')[0].split('').pop());
  let playerTwoPosition = parseInt(source.split('\n')[1].split('').pop());

  let playerOneScore = 0;
  let playerTwoScore = 0;

  let currentPlayer = 1;

  let diceValue = 1;

  let rollCount = 0;

  while (playerOneScore < 1000 && playerTwoScore < 1000) {
    let roll = diceValue + diceValue + 1 + diceValue + 2;
    rollCount += 3;
    if (currentPlayer === 1) {
      playerOnePosition = (playerOnePosition + roll) % 10;
      playerOneScore += playerOnePosition === 0 ? 10 : playerOnePosition;
    } else {
      playerTwoPosition = (playerTwoPosition + roll) % 10;
      playerTwoScore += playerTwoPosition === 0 ? 10 : playerTwoPosition;
    }
    diceValue += 3;
    currentPlayer = currentPlayer === 1 ? 0 : 1;
  }

  console.log('winning player: ', playerOneScore > playerTwoScore ? 'player one' : 'player two');
  console.log("loser's points: ", playerOneScore < playerTwoScore ? playerOneScore : playerTwoScore);
  console.log('diceRollCount: ', rollCount);
  console.log('result: ', rollCount * (playerOneScore < playerTwoScore ? playerOneScore : playerTwoScore));
};
