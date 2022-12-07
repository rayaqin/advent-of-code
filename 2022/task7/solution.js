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

const getParsedLine = (line) => {
  if (line[0] === "$") {
    if (line.indexOf("ls") === 2) {
      return {
        type: "command",
        instruction: "list",
      };
    }
    return {
      type: "command",
      instruction: "change-directory",
      destination: line.split(" ")[2],
    };
  }
  if (line.indexOf("dir") === 0) {
    return {
      type: "directory",
      name: line.split(" ")[1],
    };
  }
  return {
    type: "file",
    name: line.split(" ")[1].split(".")[0],
    extension: line.split(" ")[1].split(".")[1],
    size: line.split(" ")[0],
  };
};

const getRootNodeBasedOnCmdLines = (cmdLines) => {
  const rootNode = {
    name: "/",
    extension: undefined,
    type: "directory",
    contains: [],
    containedBy: null,
    size: 0,
  };

  let currentNode = rootNode;

  let i = 0;
  while (cmdLines[i] !== undefined) {
    if (cmdLines[i].instruction === "change-directory") {
      if (cmdLines[i].destination === "/") {
        i++;
        continue;
      }
      if (cmdLines[i].destination === "..") {
        currentNode = currentNode.containedBy;
        i++;
        continue;
      }
      currentNode = currentNode.contains.find((node) => node.name === cmdLines[i].destination && node.type === "directory");
      i++;
      continue;
    }
    // now we know it is definitely a list command
    i++;
    while (cmdLines[i] && (cmdLines[i].type === "file" || cmdLines[i].type === "directory")) {
      if (cmdLines[i].type === "directory") {
        currentNode.contains.push({
          name: cmdLines[i].name,
          extension: undefined,
          type: cmdLines[i].type,
          contains: [],
          containedBy: currentNode,
          size: 0,
        });
      }
      // now we know it is definitely a file being listed
      else {
        currentNode.contains.push({
          name: cmdLines[i].name,
          extension: cmdLines[i].extension,
          type: cmdLines[i].type,
          contains: [],
          containedBy: currentNode,
          size: parseInt(cmdLines[i].size),
        });
        currentNode.size += parseInt(cmdLines[i].size);
        const storedCurrentNode = currentNode;
        while (currentNode.containedBy) {
          currentNode = currentNode.containedBy;
          currentNode.size += parseInt(cmdLines[i].size);
        }
        currentNode = storedCurrentNode;
      }
      i++;
    }
  }
  return rootNode;
};

const findDirectoriesWithMaxSize = (currentNode, maxSize, resultArray) => {
  if (currentNode.type === "directory" && currentNode.size <= maxSize) {
    resultArray.push(currentNode);
  }
  if (currentNode.contains.length) {
    currentNode.contains.forEach((node) => {
      findDirectoriesWithMaxSize(node, maxSize, resultArray);
    });
  }
  return;
};

const findDirectoriesWithMinSize = (currentNode, minSize, resultArray) => {
  if (currentNode.type === "directory" && currentNode.size >= minSize) {
    resultArray.push(currentNode);
  }
  if (currentNode.contains.length) {
    currentNode.contains.forEach((node) => {
      findDirectoriesWithMinSize(node, minSize, resultArray);
    });
  }
  return;
};

const getSolutionForPart1 = (source) => {
  const cmdLines = source.split("\r\n").map((line) => getParsedLine(line));
  const rootNode = getRootNodeBasedOnCmdLines(cmdLines);

  const smallDirectories = [];
  findDirectoriesWithMaxSize(rootNode, 100000, smallDirectories);

  const sum = smallDirectories.reduce((acc, curr) => acc + curr.size, 0);

  return sum;
};

const getSolutionForPart2 = (source) => {
  const cmdLines = source.split("\r\n").map((line) => getParsedLine(line));
  const rootNode = getRootNodeBasedOnCmdLines(cmdLines);

  const requiredFreeSpace = 30000000;
  const allSpace = 70000000;
  const freeSpaceStillNeeded = requiredFreeSpace - (allSpace - rootNode.size);

  const bigEnoughDirectories = [];
  findDirectoriesWithMinSize(rootNode, freeSpaceStillNeeded, bigEnoughDirectories);

  const directoryToDelete = bigEnoughDirectories.reduce((acc, curr) => (curr.size <= acc.size ? curr : acc), rootNode);

  return directoryToDelete.size;
};
