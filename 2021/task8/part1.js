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
  let entries = source.split("\n").map((a) => ({
    signalPatterns: a.split("|")[0].trim().split(" "),
    output: a.split("|")[1].trim().split(" "),
  }));

  let numberCounts = {
    one: 0,
    four: 0,
    seven: 0,
    eight: 0,
  };

  entries.forEach((entry) => {
    entry.output.forEach((digit) => {
      if (digit.length == 2) {
        numberCounts.one = numberCounts.one + 1;
      }
      if (digit.length == 4) {
        numberCounts.four = numberCounts.four + 1;
      }
      if (digit.length == 3) {
        numberCounts.seven = numberCounts.seven + 1;
      }
      if (digit.length == 7) {
        numberCounts.eight = numberCounts.eight + 1;
      }
    });
  });

  Object.keys(numberCounts).forEach((current) => {
    canvas.innerHTML +=
      "<br />" + "number " + current + ": " + numberCounts[current] + "<br />";
  });

  canvas.innerHTML +=
    "<br />" +
    "<br />" +
    "sum: " +
    Object.keys(numberCounts).reduce((acc, curr) => {
      return acc + numberCounts[curr];
    }, 0);
};
