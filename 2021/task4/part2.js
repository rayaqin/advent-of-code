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
  let bingoData = source.split('\n');

  let numbersDrawn = bingoData[0].split(',').map((a) => parseInt(a));
  let boardLines = bingoData.slice(2);
  let boardLength = getIntArrayFromBoardLine(boardLines[0]).length;

  let bingoMatrix = [];
  let boards = boardLines.reduce((acc, current) => {
    let currentLine = getIntArrayFromBoardLine(current);
    let tempAcc = acc ?? [];
    currentLine.length === boardLength &&
      bingoMatrix.push(currentLine.map((a) => ({ number: a, marked: false })));
    if (bingoMatrix.length === boardLength) {
      tempAcc.push(bingoMatrix);
      bingoMatrix = [];
      return tempAcc;
    }
    return tempAcc;
  }, []);

  let lastWinnerBoardIndex = null;
  let lastNumberCalled = null;
  let winnerSet = new Set();
  let i = 0;

  while (
    lastWinnerBoardIndex === null &&
    lastNumberCalled !== numbersDrawn[numbersDrawn.length - 1]
  ) {
    lastNumberCalled = numbersDrawn[i];
    lastWinnerBoardIndex = markNumberOnBoards(
      numbersDrawn[i],
      boards,
      boardLength,
      winnerSet
    );
    i++;
  }
  let result = getWinnerMatrixValue(
    boards[lastWinnerBoardIndex],
    lastNumberCalled
  );
  canvas.innerHTML += canvas.innerHTML = (
    '<br />' +
    'result: ' +
    result +
    '<br />' +
    '<br />' +
    '<b>Bingo charts at the end</b>' +
    '<br />' +
    '<br />' +
    boards.map((b, index) => {
      let boardStr = '';
      if (lastWinnerBoardIndex === index)
        boardStr += '<br />' + '### Last winner below ###' + '<br />';
      b.forEach((line) => {
        line.forEach((n) => {
          boardStr += (n.marked ? '<b>[' + n.number + ']</b>' : n.number) + ' ';
        });
        boardStr += '<br />';
      });
      return boardStr + '<br />';
    })
  ).replace(',', '');
};

const getIntArrayFromBoardLine = (line) => {
  return line
    .split(' ')
    .filter((a) => a !== ' ' && !!a)
    .map((a) => parseInt(a.trim()));
};

const markNumberOnBoards = (number, boards, boardLength, winnerSet) => {
  for (let i = 0; i < boards.length; i++) {
    let columnMarkedCounts = Array.from(Array(boardLength).keys()).map(() => 0);
    for (let j = 0; j < boards[i].length; j++) {
      let line = boards[i][j];
      let markedInLine = 0;
      line.forEach((n, index) => {
        if (n.number == number || n.marked) {
          n.marked = true;
          markedInLine++;
          columnMarkedCounts[index]++;
        }
      });
      if (markedInLine === 5 && !winnerSet.has(i)) {
        winnerSet.add(i);
        if (winnerSet.size === boards.length) return i;
      }
    }
    if (columnMarkedCounts.includes(5) && !winnerSet.has(i)) {
      winnerSet.add(i);
      if (winnerSet.size === boards.length) return i;
    }
  }
  return null;
};

const getWinnerMatrixValue = (matrix, lastNumberCalled) => {
  let unmarkedSum = 0;
  matrix.forEach((line) => {
    line.forEach((n) => {
      if (n.marked === false) {
        unmarkedSum += n.number;
      }
    });
  });
  canvas.innerHTML +=
    '<br />' +
    'sum of unmarked numbers: ' +
    unmarkedSum +
    '<br />' +
    'last number drawn: ' +
    lastNumberCalled;
  return unmarkedSum * lastNumberCalled;
};
