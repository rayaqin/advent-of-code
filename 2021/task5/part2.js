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
  let largestX = 0;
  let largestY = 0;
  const cloudData = source.split("\n").map((line) => {
    const startPoint = line.split("->")[0].trim().split(",");
    const endPoint = line.split("->")[1].trim().split(",");
    const x1 = parseInt(startPoint[0]);
    const y1 = parseInt(startPoint[1]);
    const x2 = parseInt(endPoint[0]);
    const y2 = parseInt(endPoint[1]);

    if (x1 > largestX || x2 > largestX) {
      largestX = x1 > x2 ? x1 : x2;
    }
    if (y1 > largestY || y2 > largestY) {
      largestY = y1 > y2 ? y1 : y2;
    }

    canvas.innerHTML +=
      "<br />" + "x1: " + x1 + "y1: " + y1 + "x2: " + x2 + "y2: " + y2;

    return {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
    };
  });

  let diagram = Array(largestX + 1)
    .fill()
    .map(() => Array(largestY + 1).fill("."));

  cloudData.forEach((vector) => {
    for (
      let x = Math.min(vector.x1, vector.x2);
      x <= Math.max(vector.x1, vector.x2);
      x++
    ) {
      for (
        let y = Math.min(vector.y1, vector.y2);
        y <= Math.max(vector.y1, vector.y2);
        y++
      ) {
        if (vector.x1 === vector.x2 || vector.y1 === vector.y2) {
          if (diagram[x][y] === ".") {
            diagram[x][y] = 1;
          } else {
            diagram[x][y] += 1;
          }
        } else if (
          Math.abs(vector.x1 - x) === Math.abs(vector.y1 - y) &&
          Math.abs(vector.x2 - x) === Math.abs(vector.y2 - y)
        ) {
          if (diagram[x][y] === ".") {
            diagram[x][y] = 1;
          } else {
            diagram[x][y] += 1;
          }
        }
      }
    }
  });
  let dangerCount = 0;
  diagram.forEach((line) => {
    canvas.innerHTML += "<br />";

    line.forEach((pos) => {
      canvas.innerHTML += pos;

      if (pos >= 2) {
        dangerCount++;
      }
    });
  });
  canvas.innerHTML += "<br />" + "dangerous points: " + dangerCount;
};
