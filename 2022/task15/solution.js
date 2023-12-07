if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log("File APIs are supported in your browser, you may proceed.");
} else {
  alert("The File APIs are not fully supported in this browser. The code won't work.");
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
  messageToUser.classList.contains("invisible") || messageToUser.classList.add("invisible");
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
  const solution = partId === 1 ? getSolutionForPart1(fileContent) : getSolutionForPart2(fileContent);
  console.log(`Solution for part ${partId}:`, solution);
};

const getSolutionForPart1 = (source) => {

};

const getSolutionForPart2 = (source) => {
  const SBPairs = source.split('\r\n').map(line => {
    const sensorData = /x=(-?\d+), y=(-?\d+).*?x=(-?\d+), y=(-?\d+)/g.exec(line).map(Number);
    const distance = Math.abs(sensorData[1] - sensorData[3]) + Math.abs(sensorData[2] - sensorData[4]);
    const sensorX = sensorData[1];
    const sensorY = sensorData[2];
    return {
      sensor: {
        x: sensorX,
        y: sensorY,
        // vetrices of scanner range + 1:
        points: {
          A: { x: sensorX, y: sensorY + distance + 1 },
          B: { x: sensorX + distance + 1, y: sensorY },
          C: { x: sensorX, y: sensorY - distance - 1 },
          D: { x: sensorX - distance - 1, y: sensorY },
        }
      },
      beacon: { x: sensorData[3], y: sensorData[4] },
      distance: distance,
    }
  })

  console.log(SBPairs[0].sensor, SBPairs[1].sensor);
  console.log(getSensorPlusOneIntersections(SBPairs[0].sensor, SBPairs[1].sensor));

  let allIntersections = [];
  for (let i = 0; i < SBPairs.length; i++) {
    for (let j = i + 1; j < SBPairs.length; j++) {
      const intersections = getSensorPlusOneIntersections(SBPairs[i].sensor, SBPairs[j].sensor);
      if (intersections.length) {
        allIntersections.push(intersections);
      }
    }
  }

  return allIntersections;


};

const getSensorPlusOneIntersections = (sensor1, sensor2) => [
  getIntersection(sensor1.points.A, sensor1.points.B, sensor2.points.D, sensor2.points.A),
  getIntersection(sensor1.points.A, sensor1.points.B, sensor2.points.C, sensor2.points.B),
  getIntersection(sensor1.points.D, sensor1.points.C, sensor2.points.D, sensor2.points.A),
  getIntersection(sensor1.points.D, sensor1.points.C, sensor2.points.C, sensor2.points.B),
  getIntersection(sensor1.points.D, sensor1.points.A, sensor2.points.A, sensor2.points.B),
  getIntersection(sensor1.points.D, sensor1.points.A, sensor2.points.D, sensor2.points.C),
  getIntersection(sensor1.points.C, sensor1.points.B, sensor2.points.D, sensor2.points.C),
  getIntersection(sensor1.points.C, sensor1.points.B, sensor2.points.A, sensor2.points.B),
].filter(a => a !== null);

const getIntersection = (sensorDiamondVertex1, sensorDiamondVertex2, sensorDiamondVertex3, sensorDiamondVertex4) => {
  let Ax = sensorDiamondVertex1.x;
  let Ay = sensorDiamondVertex1.y;
  let Bx = sensorDiamondVertex2.x;
  let By = sensorDiamondVertex2.y;
  let Cx = sensorDiamondVertex3.x;
  let Cy = sensorDiamondVertex3.y;
  let Dx = sensorDiamondVertex4.x;
  let Dy = sensorDiamondVertex4.y;

  /*
    Equation of a line:
    y = [slope of line] * x + [y where line intercepts the y axis]

    Each time we increment x by 1, y increases by [slope of line],
    and the yIntersept is where x is 0
  */

  const slopeAB = (By - Ay) / (Bx - Ax);
  const slopeCD = (Dy - Cy) / (Dx - Cx);

  // lines are parallel, no intersection or infinite intersections
  if (slopeAB === slopeCD) return null;

  /*
    If we take any x,y point of a line and step from it's y value
    x times, each time stepping as much as the slope of the line,
    then we trace the line back to where x is zero,
    and the line touches the y axis
  */
  const yInterceptAB = Ay - slopeAB * Ax;
  const yInterceptCD = Cy - slopeCD * Cx;

  /*
    If we set the equations of the two lines on opposite sides of an equal sign,
    and then solve for x, we see how intersectionX can be calculated from yIntercept values
    and slopes.
    slopeAB * x + yInterceptAB = slopeCD * x + yInterceptCD
  */
  const intersectionX = (yInterceptCD - yInterceptAB) / (slopeAB - slopeCD)

  /*
    Then we substitute this intersectX value to one of the y equations
    from earlier, in place of x.
  */
  const intersectionY = slopeAB * intersectionX + yInterceptAB;

  // Check if point is on the line segments and has integer coordinates
  if (
    isPointOnLineSegment(intersectionX, intersectionY, Ax, Ay, Bx, By) &&
    isPointOnLineSegment(intersectionX, intersectionY, Cx, Cy, Dx, Dy) &&
    intersectionX % 1 === 0 && intersectionY % 1 === 0
  ) {
    return { x: intersectionX, y: intersectionY }
  }

  // The intersection is outside of the line segments or between relevant integer points
  return null
}

function isPointOnLineSegment(x, y, Ax, Ay, Bx, By) {
  /*
  Check if the point is within the bounding xy box shape around the line segment.
  We don't have to check collinearity since we already know that.
  */
  return (
    (x >= Math.min(Ax, Bx) && x <= Math.max(Ax, Bx)) &&
    (y >= Math.min(Ay, By) && y <= Math.max(Ay, By))
  )

}
