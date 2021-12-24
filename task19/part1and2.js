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
  let scannerData = source.split('\n\n').map((scannerBlock) =>
    scannerBlock
      .split('\n')
      .filter((line) => line.indexOf('---') < 0)
      .map((line) => line.split(',').map((x) => parseInt(x)))
  );
  const results = [];
  const foundScanners = new Map(); //map scanner-N indexes to pairs of beacon-triangle data with scanner-0
  let beacons = createBeaconDataObjects(scannerData);
  const uniqueBeacons = new Set(beacons.map((x) => x.checkSum));
  results[0] = uniqueBeacons.size;

  //part 2
  //loop til all scanners found
  while (foundScanners.size < scannerData.length - 1) {
    //match beacon data objects from scanner-0 and scanner-N
    for (const a of beacons.filter((x) => x.scannerIndex == 0)) {
      for (const b of beacons.filter((x) => x.scannerIndex > 0)) {
        if (foundScanners.has(b.scannerIndex)) continue;
        if (a.checkSum == b.checkSum) {
          const translations = findTranslation(a.tri, b.tri);
          foundScanners.set(b.scannerIndex, { a, b, translations });
        }
      }
    }

    //extend scanner-0 by adding new beacons relative to scanner-0
    for (const [idx, match] of foundScanners) {
      for (const beacon of scannerData[idx]) {
        const t = match.translations;
        const newBeacon = [
          t[0].v + beacon[t[0].c] * t[0].op, //x
          t[1].v + beacon[t[1].c] * t[1].op, //y
          t[2].v + beacon[t[2].c] * t[2].op, //z
        ];
        //avoid duplicate which confuse thumbprint calculation
        if (
          !scannerData[0].some(
            (existingBeacon) =>
              existingBeacon[0] == newBeacon[0] && existingBeacon[1] == newBeacon[1] && existingBeacon[2] == newBeacon[2]
          )
        )
          scannerData[0].push(newBeacon);
      }
    }

    //todo: instead regenerate all, do only for new joined beacons
    //redo thumbprint for new joined beacon
    beacons = createBeaconDataObjects(scannerData);
  }

  const scanners = [[0, 0, 0]];
  for (const [idx, match] of foundScanners) {
    const t = match.translations;
    scanners[idx] = [t[0].v, t[1].v, t[2].v];
  }

  let farthest = 0;
  for (const a of scanners) {
    for (const b of scanners) {
      let d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      farthest = Math.max(d, farthest);
    }
  }
  results[1] = farthest;

  console.log('Part1: ' + results[0] + '\nPart2: ' + results[1]);
};

const createBeaconDataObjects = (scanners) => {
  let beacons = [];
  scanners.forEach((scanner, scannerIndex) => {
    scanner.forEach((beacon, beaconIndex) => {
      let bc = { scannerIndex, beaconIndex, peers: [] };
      scanner.forEach((peerCandidate, indexWithinScanner) => {
        if (beaconIndex !== indexWithinScanner) {
          const distance = getDistance(beacon, peerCandidate);
          bc.peers.push({ peerIndex: indexWithinScanner, distance });
        }
      });

      bc.peers.sort((a, b) => a.distance - b.distance).splice(2);
      bc.sum = bc.peers.reduce((acc, curr) => acc + curr.distance, 0); // sum of distances from bc
      bc.peersDistance = getDistance(scanner[bc.peers[0].peerIndex], scanner[bc.peers[1].peerIndex]); // peers' distance from each other
      bc.checkSum = bc.sum * bc.peersDistance; // hopefully unique number created from triangle data
      bc.tri = [beacon, scanner[bc.peers[0].peerIndex], scanner[bc.peers[1].peerIndex]]; // store triangle points
      beacons.push(bc);
    });
  });
  return beacons;
};

//find xyz
function findTranslation(triangle1, triangle2) {
  let arr = [[], [], [], [], [], [], [], [], []];
  for (let i = 0; i < 3; i++) {
    //x translation
    arr[0].push({ c: 0, op: -1, v: triangle1[i][0] + triangle2[i][0] });
    arr[0].push({ c: 0, op: +1, v: triangle1[i][0] - triangle2[i][0] });
    arr[1].push({ c: 1, op: -1, v: triangle1[i][0] + triangle2[i][1] });
    arr[1].push({ c: 1, op: +1, v: triangle1[i][0] - triangle2[i][1] });
    arr[2].push({ c: 2, op: -1, v: triangle1[i][0] + triangle2[i][2] });
    arr[2].push({ c: 2, op: +1, v: triangle1[i][0] - triangle2[i][2] });
    //y translation
    arr[3].push({ c: 1, op: -1, v: triangle1[i][1] + triangle2[i][1] });
    arr[3].push({ c: 1, op: +1, v: triangle1[i][1] - triangle2[i][1] });
    arr[4].push({ c: 0, op: -1, v: triangle1[i][1] + triangle2[i][0] });
    arr[4].push({ c: 0, op: +1, v: triangle1[i][1] - triangle2[i][0] });
    arr[5].push({ c: 2, op: -1, v: triangle1[i][1] + triangle2[i][2] });
    arr[5].push({ c: 2, op: +1, v: triangle1[i][1] - triangle2[i][2] });
    //z translation
    arr[6].push({ c: 2, op: -1, v: triangle1[i][2] + triangle2[i][2] });
    arr[6].push({ c: 2, op: +1, v: triangle1[i][2] - triangle2[i][2] });
    arr[7].push({ c: 0, op: -1, v: triangle1[i][2] + triangle2[i][0] });
    arr[7].push({ c: 0, op: +1, v: triangle1[i][2] - triangle2[i][0] });
    arr[8].push({ c: 1, op: -1, v: triangle1[i][2] + triangle2[i][1] });
    arr[8].push({ c: 1, op: +1, v: triangle1[i][2] - triangle2[i][1] });
  }
  let xyz_translations = [];
  for (const mod of arr) {
    let most = findCommonModifier(mod);
    if (most.occur == 3) xyz_translations.push(most);
  }
  return xyz_translations;
}

//extract xyz
const findCommonModifier = (mod) => {
  // how many sorted 'v's are the same in a row at most
  let a = mod.slice(0);
  a.sort((x, y) => x.v - y.v);

  let mx = 1;
  let cur = 1;
  let res = a[0];

  for (let i = 1; i < a.length; i++) {
    if (a[i].v == a[i - 1].v) {
      cur++;
    } else {
      if (cur > mx) {
        mx = cur;
        res = a[i - 1];
      }
      cur = 1;
    }
  }
  if (cur > mx) {
    mx = cur;
    res = a[a.length - 1];
  }
  res.occur = mx;
  return res;
};

function getDistance(a, b) {
  let sum = 0;
  for (const i in a) {
    sum += Math.pow(a[i] - b[i], 2);
  }
  return sum;
}
