if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log('File APIs are supported in your browser, you may proceed.');
} else {
  alert("The File APIs are not fully supported in this browser. The code won't work.");
}

const chooseFile = document.getElementById('choose-file');
const inputWrapper = document.getElementById('input-wrapper');
const canvasWrapper = document.getElementById('canvas-wrapper');
const canvas = document.getElementById('canvas');

let possibleRoutes = 0;

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
  let caves = {};
  let caveSchema = { id: '', isBig: false, connections: [], usedConnections: [] };
  source.split('\n').forEach((caveConnection) => {
    let fromCaveId = caveConnection.split('-')[0];
    let toCaveId = caveConnection.split('-')[1];
    if (!caves[fromCaveId]) {
      caves[fromCaveId] = {
        ...JSON.parse(JSON.stringify(caveSchema)),
        id: fromCaveId,
        isBig: fromCaveId.toUpperCase() === fromCaveId,
      };
    }
    if (!caves[toCaveId]) {
      caves[toCaveId] = {
        ...JSON.parse(JSON.stringify(caveSchema)),
        id: toCaveId,
        isBig: toCaveId.toUpperCase() === toCaveId,
      };
    }
    caves[fromCaveId].connections.push(caves[toCaveId]);
    caves[toCaveId].connections.push(caves[fromCaveId]);
  });
  let routes = [];
  visitAllConnections(caves['start'], [], routes);
  console.log(routes);
};

const visitAllConnections = (thisCave, currentRoute, routes) => {
  currentRoute.push(thisCave.id);
  debugger;
  if (thisCave.id === 'end') {
    routes.push(currentRoute);
    return;
  }

  for (let i = 0; i < thisCave.connections.length; i++) {
    if (
      (thisCave.connections[i].isBig || !currentRoute.includes(thisCave.connections[i].id)) &&
      (thisCave.isBig || thisCave.connections[i].connections.length > 1)
    ) {
      visitAllConnections(thisCave.connections[i], [...currentRoute], routes);
    }
  }
  return;
};

const doesCaveIncludeId = (caveArray, caveId) => {
  caveArray.forEach((cave) => {
    if (cave.id === caveId) {
      return true;
    }
  });
  return false;
};
