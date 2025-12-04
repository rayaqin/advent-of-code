function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    var rawData = e.target.result;
    processData(rawData);
  };
  reader.readAsText(file);
}

document
  .getElementById("file-input")
  .addEventListener("change", readSingleFile, false);

function processData(rawData) {
  let seatData = [];
  let highestSeatId = 0;
  let seatMatrix = createArray(128, 8);
  count = 0;
  for (let i = 0; i < 128; i++) {
    for (let j = 0; j < 8; j++) {
      seatMatrix[i][j] = "O";
    }
  }
  rawData.split("\n").forEach((passData) => {
    let rowData = processSteps(passData.substring(0, 7).trim(), {
      min: 0,
      max: 127,
    });
    let columnData = processSteps(passData.substring(7).trim(), {
      min: 0,
      max: 7,
    });
    let seatIdData = rowData * 8 + columnData;
    seatData.push({ row: rowData, column: columnData, seatId: seatIdData });

    seatMatrix[rowData][columnData] = "X";

    if (seatIdData > highestSeatId) {
      highestSeatId = seatIdData;
    }
  });
  let ownSeat = { row: 0, column: 0, id: 0 };
  for (let i = 0; i < 128; i++) {
    for (let j = 0; j < 8; j++) {
      if (seatMatrix[i][j] === "O" && j === 0 && i !== 0) {
        if (seatMatrix[i - 1][7] === "X" && seatMatrix[i][j + 1] === "X") {
          ownSeat.row = i;
          ownSeat.column = j;
          ownSeat.id = i * 8 + j;
        }
      } else if (seatMatrix[i][j] === "O" && j !== 0) {
        if (seatMatrix[i][j - 1] === "X" && seatMatrix[i][j + 1] === "X") {
          ownSeat.row = i;
          ownSeat.column = j;
          ownSeat.id = i * 8 + j;
        }
      }
    }
  }
  console.log("Highest seat ID: ", highestSeatId);
  console.log("Own seat: ", ownSeat);
}

function processSteps(steps, minMax) {
  steps.split("").forEach((step) => {
    if (["F", "L"].includes(step)) {
      minMax.max = minMax.min + Math.floor((minMax.max - minMax.min) / 2);
    } else if (["B", "R"].includes(step)) {
      minMax.min = minMax.min + Math.ceil((minMax.max - minMax.min) / 2);
    }
  });
  if (minMax.min === minMax.max) {
    return minMax.min;
  } else {
    console.log("ERROR");
  }
}

function createArray(length) {
  var arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }

  return arr;
}
