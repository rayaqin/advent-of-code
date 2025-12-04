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

  let horizontalPosition = 0;
  let depth = 0;
  let aim = 0;

  console.log({ data: source });

  const instructions = source.split("\n").map((line) => {
    let splitLine = line.split(" ");
    let command = splitLine[0];
    let distance = parseInt(splitLine[1]);

    if (command === "forward") {
      horizontalPosition += distance;
      depth += aim * distance;
    } else if (command === "up") {
      aim -= distance;
    } else {
      aim += distance;
    }

    return {
      command: command,
      distance: distance,
    };
  });

  canvas.innerHTML =
    "<b>Commands with corresponding distance values: </b>" +
    "<br />" +
    instructions.map((i) => {
      return "<br />" + i.command + "  " + i.distance;
    }) +
    "<br />" +
    "<br />" +
    "horizontal position: " +
    horizontalPosition +
    "<br />" +
    "depth: " +
    depth +
    "<br />" +
    "horizontal position * depth: " +
    horizontalPosition * depth;
};
