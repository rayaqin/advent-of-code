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
  let results = source.split("\n");

  console.log(getMagnitude(results[0]));
};

const getMagnitude = (line) => {
  const regexp = /\[[0-9]+,[0-9]+]/g;
  while ([...line.matchAll(regexp)].length > 0) {
    let pairs = [...line.matchAll(regexp)].map((a) => a[0]);
    pairs.forEach((pair) => {
      let leftNumber = parseInt(pair.slice(1, pair.indexOf(",")));
      let rightNumber = parseInt(pair.slice(pair.indexOf(",") + 1));
      line = line.replaceAll(pair, leftNumber * 3 + rightNumber * 2);
    });
  }
  return line;
};
