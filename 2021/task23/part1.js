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
  let amphipodEncounters = 0;

  const encounterToRoomMap = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
  };

  const xToRoomMap = {};
  let caveData = source.split("\r\n").map((line, y) =>
    line.split("").map((spot, x) => {
      if (spot === "#" || spot === " ") {
        return {
          type: "wall",
          occupant: null,
          x,
          y,
          room: null,
          isDoorway: false,
          locked: true,
        };
      }
      let amphipod = null;
      if (!!spot.match(/[A-Z]/g)) {
        amphipod = {
          type: spot,
          id: `${x},${y}`,
        };
        if (amphipodEncounters < Object.keys(encounterToRoomMap).length) {
          amphipodEncounters++;
          xToRoomMap[x] = encounterToRoomMap[amphipodEncounters];
        }
      }
      return {
        type: "floor",
        occupant: amphipod,
        x,
        y,
        room: amphipod ? xToRoomMap[x] : null,
        isDoorway: false,
        locked: false,
      };
    }),
  );

  for (let x = 0; x < caveData[0].length; x++) {
    for (let y = 0; y + 1 < Object.keys(caveData[0][0]).length; y++) {
      if (
        caveData[y][x] &&
        caveData[y][x].type === "floor" &&
        caveData[y][x].occupant === null &&
        !!caveData[y + 1][x].occupant
      ) {
        caveData[y][x].isDoorway = true;
      }
    }
  }
  console.log(caveData);
};

const isAtDesiredPlace = (x, y) => {};
