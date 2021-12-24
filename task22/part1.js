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
  const commands = source.split('\n').map((line) => {
    let ranges = line.split(' ')[1].split(',');
    let x = { from: ranges[0].match(/(?<=[=])-?[0-9]+/)[0], to: ranges[0].match(/(?<=[.])-?[0-9]+/)[0] };
    let y = { from: ranges[1].match(/(?<=[=])-?[0-9]+/)[0], to: ranges[1].match(/(?<=[.])-?[0-9]+/)[0] };
    let z = { from: ranges[2].match(/(?<=[=])-?[0-9]+/)[0], to: ranges[2].match(/(?<=[.])-?[0-9]+/)[0] };

    return {
      commandType: line.split(' ')[0],
      minPoint: { x: parseInt(x.from), y: parseInt(y.from), z: parseInt(z.from) },
      maxPoint: { x: parseInt(x.to), y: parseInt(y.to), z: parseInt(z.to) },
    };
  });

  let resultCuboidsWithMatrixes = [];

  commands.forEach((commandCuboid) => {
    if (resultCuboidsWithMatrixes.length === 0) {
      resultCuboidsWithMatrixes.push(addFilledMatrixToCuboidData(commandCuboid, commandCuboid.commandType == 'on' ? 1 : 0));
    } else {
      resultCuboidsWithMatrixes.forEach((existingCuboid, index) => {
        if (checkIfTwoCuboidDataIntersect(existingCuboid, commandCuboid)) {
          resultCuboidsWithMatrixes.push(getEngulfingCuboidWithMatrix(existingCuboid, commandCuboid));
          resultCuboidsWithMatrixes[index] = null;
        } else if (commandCuboid.commandType === 'on') {
          resultCuboidsWithMatrixes.push(addFilledMatrixToCuboidData(commandCuboid, 1));
        }
      });
      resultCuboidsWithMatrixes = resultCuboidsWithMatrixes.filter((a) => a !== null);
    }
  });

  console.log(resultCuboidsWithMatrixes);
};

const addFilledMatrixToCuboidData = (commandCuboid, fillValue) => {
  return {
    ...commandCuboid,
    matrix: createMatrixFromCuboidData(commandCuboid, fillValue),
  };
};

const checkIfTwoCuboidDataIntersect = (cuboidData1, cuboidData2) =>
  cuboidData1.minPoint.x <= cuboidData2.maxPoint.x &&
  cuboidData1.maxPoint.x >= cuboidData2.minPoint.x &&
  cuboidData1.minPoint.y <= cuboidData2.maxPoint.y &&
  cuboidData1.maxPoint.y >= cuboidData2.minPoint.y &&
  cuboidData1.minPoint.z <= cuboidData2.maxPoint.z &&
  cuboidData1.maxPoint.z >= cuboidData2.minPoint.z;

const getEngulfingCuboidMinMax = (cuboidData1, cuboidData2) => {
  return {
    minPoint: {
      x: Math.min(cuboidData1.minPoint.x, cuboidData2.minPoint.x),
      y: Math.min(cuboidData1.minPoint.y, cuboidData2.minPoint.y),
      z: Math.min(cuboidData1.minPoint.z, cuboidData2.minPoint.z),
    },
    maxPoint: {
      x: Math.max(cuboidData1.maxPoint.x, cuboidData2.maxPoint.x),
      y: Math.max(cuboidData1.maxPoint.y, cuboidData2.maxPoint.y),
      z: Math.max(cuboidData1.maxPoint.z, cuboidData2.maxPoint.z),
    },
  };
};

const createMatrixFromCuboidData = (cuboidData, fillValue) => {
  let matrix = [];

  for (let x = 0; x <= cuboidData.maxPoint.x - cuboidData.minPoint.x; x++) {
    matrix.push([]);
    for (let y = 0; y <= cuboidData.maxPoint.y - cuboidData.minPoint.y; y++) {
      matrix[x] ? matrix[x].push([]) : (matrix[x] = []);
      for (let z = 0; z <= cuboidData.maxPoint.z - cuboidData.minPoint.z; z++) {
        matrix[x][y] ? matrix[x][y].push(fillValue) : (matrix[x][y] = [fillValue]);
      }
    }
  }
  return matrix;
};

const getEngulfingCuboidWithMatrix = (existingCuboid, commandCuboid) => {
  let newEngulfingCuboidData = getEngulfingCuboidMinMax(existingCuboid, commandCuboid);
  newEngulfingCuboidData.matrix = createMatrixFromCuboidData(newEngulfingCuboidData, 0);
  overWriteBigMatrixValuesWithSmall(newEngulfingCuboidData, existingCuboid);
  overWriteBigMatrixValuesWithSmall(newEngulfingCuboidData, commandCuboid);
  return newEngulfingCuboidData;
};

const overWriteBigMatrixValuesWithSmall = (big, small) => {
  debugger;
  for (let x = big.minPoint.x; x <= big.maxPoint.x; x++) {
    for (let y = big.minPoint.y; y <= big.maxPoint.y; y++) {
      for (let z = big.minPoint.z; z <= big.maxPoint.z; z++) {
        if (
          x >= small.minPoint.x &&
          x <= small.maxPoint.x &&
          y >= small.minPoint.y &&
          y <= small.maxPoint.y &&
          z >= small.minPoint.z &&
          z <= small.maxPoint.z
        ) {
          if (small.matrix) {
            debugger;
            big.matrix[x - big.minPoint.x][y - big.minPoint.y][z - big.minPoint.z] =
              small.matrix[x - small.minPoint.x][y - small.minPoint.y][z - small.minPoint.z];
          } else {
            big.matrix[x - big.minPoint.x][y - big.minPoint.y][z - big.minPoint.z] = small.commandType == 'on' ? 1 : 0;
          }
        }
      }
    }
  }
};

/*   let newRelativeXMin1 = cuboidData1.minPoint.x - bigCuboidData.minPoint.x;
  let newRelativeYMin1 = cuboidData1.minPoint.y - bigCuboidData.minPoint.y;
  let newRelativeZMin1 = cuboidData1.minPoint.z - bigCuboidData.minPoint.z;

  let newRelativeXMax1 = bigCuboidData.maxPoint.x - cuboidData1.maxPoint.x;
  let newRelativeYMax1 = bigCuboidData.maxPoint.y - cuboidData1.maxPoint.y;
  let newRelativeZMax1 = bigCuboidData.maxPoint.z - cuboidData1.maxPoint.z;

  let newRelativeXMin2 = cuboidData2.minPoint.x - bigCuboidData.minPoint.x;
  let newRelativeYMin2 = cuboidData2.minPoint.y - bigCuboidData.minPoint.y;
  let newRelativeZMin2 = cuboidData2.minPoint.z - bigCuboidData.minPoint.z;

  let newRelativeXMax2 = bigCuboidData.maxPoint.x - cuboidData2.maxPoint.x;
  let newRelativeYMax2 = bigCuboidData.maxPoint.y - cuboidData2.maxPoint.y;
  let newRelativeZMax2 = bigCuboidData.maxPoint.z - cuboidData2.maxPoint.z;

  debugger;

  for (let x = 0; x < bigCuboidData.matrix.length; x++) {
    for (let y = 0; y < bigCuboidData.matrix[x].length; y++) {
      for (let z = 0; z < bigCuboidData.matrix[y].length; z++) {
        if (
          x >= newRelativeXMin1 &&
          x <= newRelativeXMax1 &&
          y >= newRelativeYMin1 &&
          y <= newRelativeYMax1 &&
          z >= newRelativeZMin1 &&
          z <= newRelativeZMax1 &&
          cuboidData1.commandType == 'on'
        ) {
          debugger;
          bigCuboidData.matrix[x][y][z] = 1;
        }
        if (
          x >= newRelativeXMin2 &&
          x <= newRelativeXMax2 &&
          y >= newRelativeYMin2 &&
          y <= newRelativeYMax2 &&
          z >= newRelativeZMin2 &&
          z <= newRelativeZMax2 &&
          cuboidData2.commandType == 'on'
        ) {
          debugger;
          bigCuboidData.matrix[x][y][z] = 1;
        }
      }
    }
  } */
