if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log('File APIs are supported in your browser, you may proceed.');
} else {
  alert("The File APIs are not fully supported in this browser. The code won't work.");
}

const chooseFile = document.getElementById('choose-file');
const inputWrapper = document.getElementById('input-wrapper');
const canvasWrapper = document.getElementById('canvas-wrapper');
const canvas = document.getElementById('canvas');

const handleFileSelect = (event) => {
  const reader = new FileReader();
  reader.readAsText(event.target.files[0]);
  reader.onload = (e) => solution(e.target.result);
};

const swapToCanvas = () => {
  inputWrapper.style.display = 'none';
  chooseFile.style.display = 'none';
  canvasWrapper.style.display = 'block';
};

chooseFile.addEventListener('change', handleFileSelect, false);

const solution = (source) => {
  swapToCanvas();
  let nodes = source
    .split('\n')
    .map((line) =>
      line.split('').map((char) => ({ value: parseInt(char), visited: false, distance: Infinity, neighbours: [] }))
    );

  let nodeMap = {};
  let unvisitedNodeKeys = new Set();

  let destinationNodeKey = null;

  for (let x = 0; x < nodes.length; x++) {
    for (let y = 0; y < nodes[x].length; y++) {
      if (x + 1 < nodes.length) nodes[x][y].neighbours.push(x + 1 + ',' + y);
      if (x - 1 >= 0) nodes[x][y].neighbours.push(x - 1 + ',' + y);
      if (y + 1 < nodes[x].length) nodes[x][y].neighbours.push(x + ',' + (y + 1));
      if (y - 1 >= 0) nodes[x][y].neighbours.push(x + ',' + (y - 1));
      nodeMap[x + ',' + y] = nodes[x][y];
      unvisitedNodeKeys.add(x + ',' + y);
      if (x == nodes.length - 1 && y == nodes[x].length - 1) {
        destinationNodeKey = x + ',' + y;
      }
    }
  }

  console.log(destinationNodeKey);

  nodeMap['0,0'].distance = 0;
  let currentNodeKey = returnSmallestDistanceNodeKey(unvisitedNodeKeys, nodeMap);
  while (destinationNodeKey !== currentNodeKey && nodeMap[destinationNodeKey].visited === false) {
    nodeMap[currentNodeKey].neighbours.forEach((neighbour) => {
      if (unvisitedNodeKeys.has(neighbour)) {
        let currentDistance = currentNodeKey === '0,0' ? 0 : nodeMap[currentNodeKey].distance;
        let purposedNewValue = currentDistance + nodeMap[neighbour].value;
        let oldValue = nodeMap[neighbour].distance;
        nodeMap[neighbour].distance = Math.min(oldValue, purposedNewValue);
      }
    });
    nodeMap[currentNodeKey].visited = true;
    unvisitedNodeKeys.delete(currentNodeKey);
    currentNodeKey = returnSmallestDistanceNodeKey(unvisitedNodeKeys, nodeMap);
  }

  console.log(nodeMap[destinationNodeKey]);
};

const returnSmallestDistanceNodeKey = (univisitedKeys, nodeMap) => {
  let smallestNodeKey = null;
  univisitedKeys.forEach((coordinate) => {
    if (!nodeMap[smallestNodeKey] || nodeMap[smallestNodeKey].distance > nodeMap[coordinate].distance) {
      smallestNodeKey = coordinate;
    }
  });
  return smallestNodeKey;
};

/* 
Mark all nodes unvisited. Create a set of all the unvisited nodes called the unvisited set. - done

Assign to every node a tentative distance value: set it to zero for our initial node and to infinity for all other nodes. The tentative distance of a node v is the length of the shortest path discovered so far between the node v and the starting node. Since initially no path is known to any other vertex than the source itself (which is a path of length zero), all other tentative distances are initially set to infinity. Set the initial node as current. - done

For the current node, consider all of its unvisited neighbors and calculate their tentative distances through the current node. Compare the newly calculated tentative distance to the current assigned value and assign the smaller one. For example, if the current node A is marked with a distance of 6, and the edge connecting it with a neighbor B has length 2, then the distance to B through A will be 6 + 2 = 8. If B was previously marked with a distance greater than 8 then change it to 8. Otherwise, the current value will be kept.
When we are done considering all of the unvisited neighbors of the current node, mark the current node as visited and remove it from the unvisited set. A visited node will never be checked again.

If the destination node has been marked visited (when planning a route between two specific nodes) or if the smallest tentative distance among the nodes in the unvisited set is infinity (when planning a complete traversal; occurs when there is no connection between the initial node and remaining unvisited nodes), then stop. The algorithm has finished.
Otherwise, select the unvisited node that is marked with the smallest tentative distance, set it as the new current node, and go back to step

When planning a route, it is actually not necessary to wait until the destination node is "visited" as above: the algorithm can stop once the destination node has the smallest tentative distance among all "unvisited" nodes (and thus could be selected as the next "current"). */
