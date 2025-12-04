function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    var rawData = e.target.result;
    processData(rawData);
  };
  reader.readAsText(file);
}

document
  .getElementById("file-input")
  .addEventListener("change", readSingleFile, false);

function processData(data) {
  let countOne = 0;
  let countTwo = 0;
  data.split("\n").forEach((line) => {
    console.log(line);
    let password = line.substring(getPosition(line, " ", 2) + 1).trim();
    let rawRule = line.substring(0, getPosition(line, " ", 2)).trim();
    let min = parseInt(rawRule.match(/(\d+)/g)[0]);
    let max = parseInt(rawRule.match(/(\d+)/g)[1]);
    let character = rawRule.charAt(rawRule.length - 2);
    let rule = { min: min, max: max, character: character };

    if (checkPasswordValidityOne(password, rule)) {
      countOne++;
    }
    if (checkPasswordValidityTwo(password, rule)) {
      countTwo++;
    }
  });

  console.log(countOne, countTwo);
}

function checkPasswordValidityTwo(password, rule) {
  let count = 0;
  if (password.split("")[rule.min - 1] === rule.character) count++;
  if (password.split("")[rule.max - 1] === rule.character) count++;
  return count === 1;
}

function checkPasswordValidityOne(password, rule) {
  let charCount = 0;
  password.split("").forEach((charOfPass) => {
    if (charOfPass === rule.character) {
      charCount++;
    }
  });
  if (charCount >= rule.min && charCount <= rule.max) {
    console.log("charCount: ", charCount, "min: ", rule.min, "max: ", rule.max);
    console.log("verdict: ", charCount >= rule.min && charCount <= rule.max);
  }
  return charCount >= rule.min && charCount <= rule.max;
}

function getPosition(string, subString, count) {
  return string.split(subString, count).join(subString).length;
}
