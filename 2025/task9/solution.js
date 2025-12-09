if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log("File APIs are supported in your browser, you may proceed.");
} else {
  alert(
    "The File APIs are not fully supported in this browser. The code won't work."
  );
}

const chooseFile = document.getElementById("choose-file");
const inputLabel = document.getElementById("input-label");
const partSelection = document.getElementById("part-selection");
const messageToUser = document.getElementById("message-to-user");
let fileContent;

const handleFileSelect = (event) => {
  const reader = new FileReader();
  reader.readAsText(event.target.files[0]);
  reader.onload = (e) => {
    fileContent = e.target.result;
    addPartSelectionButtons();
  };
};

chooseFile.addEventListener("change", handleFileSelect, false);

const writeMessageToUser = (message) => {
  messageToUser.classList.contains("invisible") ||
    messageToUser.classList.add("invisible");
  messageToUser.innerHTML = message;
  setTimeout(() => {
    messageToUser.classList.remove("invisible");
  }, 2000);
};

const addPartSelectionButtons = () => {
  partSelection.style.visibility = "visible";
  writeMessageToUser("select which part's result you'd like to see");
};

const solveSelectedPart = (partId) => {
  writeMessageToUser("check the console");
  const solution =
    partId === 1
      ? getSolutionForPart1(fileContent)
      : getSolutionForPart2(fileContent);
  console.log(`Solution for part ${partId}:`, solution);
};

const getSolutionForPart1 = (source) => {
  const tilePositions = source.split("\n").map((tp) => ({
    x: Number(tp.split(",")[0]),
    y: Number(tp.split(",")[1]),
  }));

  const tilesMostFurtherApart = tilePositions.reduce(
    (resultArray, currentTile) => {
      let largestRectangle = 0;
      let tilePair = { a: null, b: null };
      for (let tp of tilePositions) {
        const rectangleSize = getRectangleSize(
          tp.x,
          tp.y,
          currentTile.x,
          currentTile.y
        );
        if (tp !== currentTile && rectangleSize > largestRectangle) {
          largestRectangle = rectangleSize;
          tilePair = {
            a: currentTile,
            b: tp,
          };
        }
      }

      return [
        ...resultArray,
        {
          tilePair,
          largestRectangle,
        },
      ];
    },
    []
  );

  const largestRectangleSize = tilesMostFurtherApart.sort(
    (a, b) => b.largestRectangle - a.largestRectangle
  )[0].largestRectangle;

  return largestRectangleSize;
};
const getSolutionForPart2 = (source) => {
  const tilePositions = source.split("\n").map((tp) => ({
    x: Number(tp.split(",")[0]),
    y: Number(tp.split(",")[1]),
  }));

  // note the edges of the area, put them in a set
  // make all rectangles, and while doing that check if all points on the vertices of the rectangle are within the edges of the area by:
  // keep stepping in every direction to see if u hit the edge of the grid in any direction, check each point to see if they are an edge

  let lowerXBound = Infinity;

  let edgePointsSet = new Set();
  for (let posIndex = 0; posIndex < tilePositions.length; posIndex++) {
    const { x: currX, y: currY } = tilePositions[posIndex];

    if (currX < lowerXBound) {
      lowerXBound = currX - 1;
    }

    if (posIndex === tilePositions.length - 1) {
      const { x: startX, y: startY } = tilePositions[0];
      edgePointsSet = new Set([
        ...edgePointsSet,
        ...getAllPointsBetweenTwoAlignedPoints(currX, currY, startX, startY),
      ]);
      continue;
    }

    const { x: nextX, y: nextY } = tilePositions[posIndex + 1];
    edgePointsSet = new Set([
      ...edgePointsSet,
      ...getAllPointsBetweenTwoAlignedPoints(currX, currY, nextX, nextY),
    ]);
  }

  console.log(edgePointsSet);

  const tilesFormingValidRectangles = tilePositions.reduce(
    (resultArray, currentTile) => {
      for (let tp of tilePositions) {
        const allRectangleEdgePoints = new Set(
          getAllPointsOfRectangleFromTwoOppositeCorners(
            currentTile.x,
            currentTile.y,
            tp.x,
            tp.y
          )
        );

        const cornerTwoX = currentTile.x;
        const cornerTwoY = tp.y;

        const cornerFourX = tp.x;
        const cornerFourY = currentTile.y;

        let isRectangleWithinShape = true;

        // console.log("cornerOne: ", currentTile);
        // console.log("cornerTwo: ", cornerTwoX, cornerTwoY);
        // console.log("cornerThree: ", tp);
        // console.log("cornerFour: ", cornerFourX, cornerFourY);

        if (
          !isPointWithinShape(
            cornerTwoX,
            cornerTwoY,
            lowerXBound,
            edgePointsSet
          ) ||
          !isPointWithinShape(
            cornerFourX,
            cornerFourY,
            lowerXBound,
            edgePointsSet
          )
        ) {
          isRectangleWithinShape = false;
          // console.log("one of two other corners outside of shape");
          continue;
        }
        console.log("all 4 vertices are within shape");
        if (isRectangleWithinShape) {
          for (let edgePointKey of allRectangleEdgePoints) {
            const edgePointX = Number(edgePointKey.split("-")[0]);
            const edgePointY = Number(edgePointKey.split("-")[1]);
            if (
              !isPointWithinShape(
                edgePointX,
                edgePointY,
                lowerXBound,
                edgePointsSet
              )
            ) {
              isRectangleWithinShape = false;
              console.log("a point on the edge is outside of shape");
              break;
            }
          }
        }

        if (isRectangleWithinShape) {
          console.log("valid rectangle found", { a: currentTile, b: tp });
          return [
            ...resultArray,
            {
              tilePair: { a: currentTile, b: tp },
              rectangleSize: getRectangleSize(
                currentTile.x,
                currentTile.y,
                tp.x,
                tp.y
              ),
            },
          ];
        }
      }
      return resultArray;
    },
    []
  );

  console.log(tilesFormingValidRectangles);

  return tilesFormingValidRectangles.toSorted(
    (a, b) => b.rectangleSize - a.rectangleSize
  )[0];
};

const getRectangleSize = (x1, x2, y1, y2) =>
  (Math.abs(x1 - y1) + 1) * (Math.abs(x2 - y2) + 1);

const isPointOnEdge = (
  pointX,
  pointY,
  edgeStartX,
  edgeStartY,
  edgeEndX,
  edgeEndY
) => {
  if (
    edgeStartY === edgeEndY &&
    pointY === edgeStartY &&
    ((pointX >= edgeStartX && pointX <= edgeEndX) ||
      (pointX <= edgeStartX && pointX >= edgeEndX))
  ) {
    return true;
  }

  if (
    edgeStartX === edgeEndX &&
    pointX === edgeStartX &&
    ((pointY >= edgeStartY && pointY <= edgeEndY) ||
      (pointY <= edgeStartY && pointY >= edgeEndY))
  ) {
    return true;
  }

  return false;
};

const getAllPointsBetweenTwoAlignedPoints = (
  edgeStartX,
  edgeStartY,
  edgeEndX,
  edgeEndY
) => {
  let points = [];
  if (edgeStartX === edgeEndX) {
    if (edgeStartY <= edgeEndY) {
      for (let y = edgeStartY; y <= edgeEndY; y++) {
        points.push(`${edgeStartX}-${y}`);
      }
    } else {
      for (let y = edgeStartY; y >= edgeEndY; y--) {
        points.push(`${edgeStartX}-${y}`);
      }
    }
  } else if (edgeStartY === edgeEndY) {
    if (edgeStartX <= edgeEndX) {
      for (let x = edgeStartX; x <= edgeEndX; x++) {
        points.push(`${x}-${edgeStartY}`);
      }
    } else {
      for (let x = edgeStartX; x >= edgeEndX; x--) {
        points.push(`${x}-${edgeStartY}`);
      }
    }
  }
  return points;
};

const getAllPointsOfRectangleFromTwoOppositeCorners = (
  cornerOneX,
  cornerOneY,
  cornerThreeX,
  cornerThreeY
) => {
  const cornerTwoX = cornerOneX;
  const cornerTwoY = cornerThreeY;
  const cornerFourX = cornerOneY;
  const cornerFourY = cornerThreeX;

  return [
    ...getAllPointsBetweenTwoAlignedPoints(
      cornerOneX,
      cornerOneY,
      cornerTwoX,
      cornerTwoY
    ),
    ...getAllPointsBetweenTwoAlignedPoints(
      cornerTwoX,
      cornerTwoY,
      cornerThreeX,
      cornerThreeY
    ),
    ...getAllPointsBetweenTwoAlignedPoints(
      cornerThreeX,
      cornerThreeY,
      cornerFourX,
      cornerFourY
    ),
    ...getAllPointsBetweenTwoAlignedPoints(
      cornerFourX,
      cornerFourY,
      cornerOneX,
      cornerOneY
    ),
  ];
};

const isPointWithinShape = (
  pointX,
  pointY,
  lowerXBound,
  shapeEdgePointsSet
) => {
  const pointKey = `${pointX}-${pointY}`;
  // console.log("checking: ", pointKey);
  if (shapeEdgePointsSet.has(pointKey)) return true;
  // console.log("point not directly in edge key set");

  let edgeCollisions = 0;
  let previousTileIsOnEdge = false;

  for (let x = pointX - 1; x >= lowerXBound; x--) {
    const currentKey = `${x}-${pointY}`;

    if (shapeEdgePointsSet.has(currentKey) && previousTileIsOnEdge === false) {
      previousTileIsOnEdge = true;
      edgeCollisions++;
    }

    if (!shapeEdgePointsSet.has(currentKey)) {
      previousTileIsOnEdge = false;
    }
  }

  return edgeCollisions % 2 === 1;
};
