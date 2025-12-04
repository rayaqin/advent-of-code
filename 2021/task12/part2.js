if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log("File APIs are supported in your browser, you may proceed.");
} else {
  alert(
    "The File APIs are not fully supported in this browser. The code won't work.",
  );
}

const chooseFile = document.getElementById("choose-file");
const inputWrapper = document.getElementById("input-wrapper");
const canvasWrapper = document.getElementById("canvas-wrapper");
const canvas = document.getElementById("canvas");

let possibleRoutes = 0;

const handleFileSelect = (event) => {
  const reader = new FileReader();
  reader.readAsText(event.target.files[0]);
  reader.onload = (e) => solution(e.target.result);
};

const swapToCanvas = () => {
  inputWrapper.style.display = "none";
  chooseFile.style.display = "none";
  canvasWrapper.style.display = "block";
};

chooseFile.addEventListener("change", handleFileSelect, false);

const solution = (source) => {
  swapToCanvas();
  let caves = {};
  let caveSchema = {
    id: "",
    isBig: false,
    connections: [],
    isSpecial: false,
  };
  source.split("\n").forEach((caveConnection) => {
    let fromCaveId = caveConnection.split("-")[0];
    let toCaveId = caveConnection.split("-")[1];
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

  Object.values(caves).forEach((cave) => {
    if (!cave.isBig && cave.id !== "start" && cave.id !== "end") {
      cave.isSpecial = true;
      console.log("special cave: ", cave.id);
      visitAllConnections(caves["start"], [], routes);
      cave.isSpecial = false;
    }
  });

  visitAllConnections(caves["start"], [], routes);
  console.log(routes);
};

const visitAllConnections = (thisCave, currentRoute, routes) => {
  currentRoute.push(thisCave.id);
  if (thisCave.id === "end" && !isRouteInRoutes(currentRoute, routes)) {
    routes.push(currentRoute);
    return;
  }

  for (let i = 0; i < thisCave.connections.length; i++) {
    if (
      (thisCave.connections[i].isBig ||
        !currentRoute.includes(thisCave.connections[i].id) ||
        (thisCave.connections[i].isSpecial &&
          countIdInRoute(thisCave.connections[i].id, currentRoute) < 2)) &&
      (thisCave.isBig ||
        thisCave.connections[i].connections.length > 1 ||
        (thisCave.isSpecial && countIdInRoute(thisCave.id, currentRoute) < 2))
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

const isRouteInRoutes = (routeToCheck, routes) => {
  for (let i = 0; i < routes.length; i++) {
    if (routeToCheck.length !== routes[i].length) continue;
    let matchCount = 0;
    for (let j = 0; j < routeToCheck.length; j++) {
      if (routeToCheck[j] === routes[i][j]) matchCount++;
    }
    if (matchCount === routeToCheck.length) return true;
  }
  return false;
};

const countIdInRoute = (idToCount, route) => {
  let count = 0;
  route.forEach((id) => {
    if (id === idToCount) count++;
  });
  return count;
};
