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
  const seeds = source.split("\r\n\r\n")[0].split(':')[1].trim().split(' ').map(Number);
  const rangeMaps = source.split("\r\n\r\n")
    .slice(1)
    .map(mapDataBlock => {
      const lines = mapDataBlock.split("\r\n");
      return {
        from: lines[0].match(/^[a-z]+(?=-to-)/)[0],
        to: lines[0].match(/(?<=-to-)[a-z]+/)[0],
        ranges: lines.slice(1).map(line => {
          const nums = line.split(' ').map(Number);
          return {
            dest: nums[0],
            source: nums[1],
            length: nums[2],
          }
        }),
      }
    });

  // console.log("%cseeds: ", "color: green", seeds);
  // console.log("%crangeMaps: ", "color: cyan", rangeMaps);

  return Math.min(...seeds.map(seedNumber => {
    let currentMappedValue = seedNumber;
    for (let rMap of rangeMaps) {
      // console.log("currently mapping from:", rMap.from, " to: ", rMap.to);
      currentMappedValue = getMappedValue(currentMappedValue, rMap.ranges);
      // console.log("result is: ", currentMappedValue);
    }
    return currentMappedValue;
  }));

};

const getSolutionForPart2 = (source) => {
  const seeds = source.split("\r\n\r\n")[0].split(':')[1].trim().split(' ').map(Number);
  const seedRanges = [];
  for (let i = 0; i < seeds.length - 1; i = i + 2) {
    seedRanges.push({ from: seeds[i], to: seeds[i] + seeds[i + 1] })
  }

  const rangeMaps = source.split("\r\n\r\n")
    .slice(1)
    .map(mapDataBlock => {
      const lines = mapDataBlock.split("\r\n");
      return {
        from: lines[0].match(/^[a-z]+(?=-to-)/)[0],
        to: lines[0].match(/(?<=-to-)[a-z]+/)[0],
        ranges: lines.slice(1).map(line => {
          const nums = line.split(' ').map(Number);
          return {
            dest: nums[0],
            source: nums[1],
            length: nums[2],
          }
        }),
      }
    });

  console.log("A little patience is required...");

  const start = performance.now();

  let locationValue = 0;
  while (true) {
    let currentSourceValue = locationValue;
    for (let rMap of [...rangeMaps].reverse()) {
      currentSourceValue = getSourceValue(currentSourceValue, rMap.ranges);
    }
    if (isNumberWithinAnySeedRanges(currentSourceValue, seedRanges)) {
      return locationValue;
    }
    locationValue++;

    // to occupy the user
    if (locationValue % 10000000 === 0) {
      const end = performance.now();
      console.log("loc-", locationValue, "time elapsed: ", Math.round(end - start) + "ms");
    }
  }


}
// gets the mapped value from the source value
const getMappedValue = (value, ranges) => {
  for (let range of ranges) {
    if (value <= (range.source + range.length) && value >= range.source) {
      return range.dest + (value - range.source);
    }
  }
  return value;
}

// gets the source value from the mapped value
const getSourceValue = (mappedValue, ranges) => {
  for (let range of ranges) {
    if (mappedValue <= (range.dest + range.length) && mappedValue >= range.dest) {
      return range.source + (mappedValue - range.dest);
    }
  }
  return mappedValue;
}

const isNumberWithinAnySeedRanges = (number, seedRanges) => {
  return seedRanges.reduce((isWithinRange, range) => (number >= range.from && number <= range.to) || isWithinRange, false);
}


