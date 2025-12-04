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
  const commands = source.split("\n").map((line) => {
    let ranges = line.split(" ")[1].split(",");
    let x = {
      from: ranges[0].match(/(?<=[=])-?[0-9]+/)[0],
      to: ranges[0].match(/(?<=[.])-?[0-9]+/)[0],
    };
    let y = {
      from: ranges[1].match(/(?<=[=])-?[0-9]+/)[0],
      to: ranges[1].match(/(?<=[.])-?[0-9]+/)[0],
    };
    let z = {
      from: ranges[2].match(/(?<=[=])-?[0-9]+/)[0],
      to: ranges[2].match(/(?<=[.])-?[0-9]+/)[0],
    };

    return {
      commandType: line.split(" ")[0],
      minPoint: {
        x: parseInt(x.from),
        y: parseInt(y.from),
        z: parseInt(z.from),
      },
      maxPoint: {
        x: parseInt(x.to),
        y: parseInt(y.to),
        z: parseInt(z.to),
      },
    };
  });
  let resultCuboids = [];

  commands.forEach((commandCuboid) => {
    if (resultCuboids.length === 0) {
      resultCuboids.push({
        minPoint: commandCuboid.minPoint,
        maxPoint: commandCuboid.maxPoint,
      });
    } else {
      let currentResults = [];
      for (let i = 0; i < resultCuboids.length; i++) {
        let existingCuboid = resultCuboids[i];
        if (checkIfTwoCuboidDataIntersect(commandCuboid, existingCuboid)) {
          let remnantsOfExisting = getCuboidsAfterCommandExecution(
            commandCuboid,
            existingCuboid,
          );
          remnantsOfExisting.forEach((remnant) => {
            currentResults.push(remnant);
          });
          resultCuboids[i] = null;
        }
      }
      if (commandCuboid.commandType === "on") {
        currentResults.push({
          minPoint: commandCuboid.minPoint,
          maxPoint: commandCuboid.maxPoint,
        });
      }
      resultCuboids = resultCuboids.filter((a) => a !== null);
      currentResults.forEach((resultCuboid) => {
        resultCuboids.push(resultCuboid);
      });
    }
  });

  console.log(resultCuboids);
  console.log(calculateSumOfCuboidVolumes(resultCuboids));
};

const calculateSumOfCuboidVolumes = (listOfCuboids) => {
  return listOfCuboids.reduce(
    (acc, curr) =>
      (acc +=
        (curr.maxPoint.x + 1 - curr.minPoint.x) *
        (curr.maxPoint.y + 1 - curr.minPoint.y) *
        (curr.maxPoint.z + 1 - curr.minPoint.z)),
    0,
  );
};

const checkIfTwoCuboidDataIntersect = (cuboidData1, cuboidData2) =>
  cuboidData1.minPoint.x <= cuboidData2.maxPoint.x &&
  cuboidData1.maxPoint.x >= cuboidData2.minPoint.x &&
  cuboidData1.minPoint.y <= cuboidData2.maxPoint.y &&
  cuboidData1.maxPoint.y >= cuboidData2.minPoint.y &&
  cuboidData1.minPoint.z <= cuboidData2.maxPoint.z &&
  cuboidData1.maxPoint.z >= cuboidData2.minPoint.z;

const checkIfTwoCuboidDataIdentical = (cuboidData1, cuboidData2) =>
  cuboidData1.minPoint.x == cuboidData2.maxPoint.x &&
  cuboidData1.maxPoint.x == cuboidData2.minPoint.x &&
  cuboidData1.minPoint.y == cuboidData2.maxPoint.y &&
  cuboidData1.maxPoint.y == cuboidData2.minPoint.y &&
  cuboidData1.minPoint.z == cuboidData2.maxPoint.z &&
  cuboidData1.maxPoint.z == cuboidData2.minPoint.z;

const getCuboidsAfterCommandExecution = (commandCuboid, existingCuboid) => {
  let xRanges = getResultRanges(
    existingCuboid.minPoint.x,
    existingCuboid.maxPoint.x,
    commandCuboid.minPoint.x,
    commandCuboid.maxPoint.x,
  );
  let yRanges = getResultRanges(
    existingCuboid.minPoint.y,
    existingCuboid.maxPoint.y,
    commandCuboid.minPoint.y,
    commandCuboid.maxPoint.y,
  );
  let zRanges = getResultRanges(
    existingCuboid.minPoint.z,
    existingCuboid.maxPoint.z,
    commandCuboid.minPoint.z,
    commandCuboid.maxPoint.z,
  );

  let cuboidSlices = [];

  xRanges.forEach((xRange) => {
    cuboidSlices.push({
      minPoint: {
        x: xRange.min,
        y: existingCuboid.minPoint.y,
        z: existingCuboid.minPoint.z,
      },
      maxPoint: {
        x: xRange.max,
        y: existingCuboid.maxPoint.y,
        z: existingCuboid.maxPoint.z,
      },
    });
  });
  yRanges.forEach((yRange) => {
    cuboidSlices.push({
      minPoint: {
        x: existingCuboid.minPoint.x,
        y: yRange.min,
        z: existingCuboid.minPoint.z,
      },
      maxPoint: {
        x: existingCuboid.maxPoint.x,
        y: yRange.max,
        z: existingCuboid.maxPoint.z,
      },
    });
  });
  zRanges.forEach((zRange) => {
    cuboidSlices.push({
      minPoint: {
        x: existingCuboid.minPoint.x,
        y: existingCuboid.minPoint.y,
        z: zRange.min,
      },
      maxPoint: {
        x: existingCuboid.maxPoint.x,
        y: existingCuboid.maxPoint.y,
        z: zRange.max,
      },
    });
  });

  for (let i = 0; i < cuboidSlices.length; i++) {
    for (let j = i; j < cuboidSlices.length; j++) {
      if (
        i !== j &&
        !checkIfTwoCuboidDataIdentical(cuboidSlices[i], cuboidSlices[j]) &&
        checkIfTwoCuboidDataIntersect(cuboidSlices[i], cuboidSlices[j])
      ) {
        cuboidSlices[i] = avoidOverlapByReduction(
          cuboidSlices[i],
          cuboidSlices[j],
        );
      }
    }
  }

  return cuboidSlices;
};

const getResultRanges = (existingMin, existingMax, commandMin, commandMax) => {
  if (commandMin <= existingMin && commandMax >= existingMax) {
    return [];
  }
  if (
    commandMin <= existingMin &&
    commandMax < existingMax &&
    commandMax >= existingMin
  ) {
    return [{ min: commandMax + 1, max: existingMax }];
  }
  if (
    commandMin >= existingMin &&
    commandMin <= existingMax &&
    commandMax >= existingMax
  ) {
    return [{ min: existingMin, max: commandMin - 1 }];
  }
  if (commandMin > existingMin && commandMax < existingMax) {
    return [
      { min: existingMin, max: commandMin - 1 },
      { min: commandMax + 1, max: existingMax },
    ];
  }
  return ["wtf"];
};

// only run this if slices intersect
const avoidOverlapByReduction = (sliceA, sliceB) => {
  return getCuboidsAfterCommandExecution(
    { ...sliceB, commandType: "off" },
    sliceA,
  )[0];
};
