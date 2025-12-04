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

function processData(rawInstructionsData) {
  let instructions = rawInstructionsData.split("\n").map((instr) => {
    return {
      type: instr.trim().substring(0, 3),
      value: instr.substring(3).trim(),
    };
  });
  console.log(debug(instructions));
  console.log(instructions);
}

function debug(instructions) {
  let success = false;
  let instructionsClone = [...instructions];
  if (!runInstructions(instructionsClone)) {
    for (let i = 0; i < instructionsClone.length; i++) {
      if (
        instructionsClone[i].type === "nop" &&
        parseInt(instructionsClone[i].value) !== 0
      ) {
        instructionsClone[i].type = "jmp";
        if (runInstructions(instructionsClone)) {
          success = true;
          console.log("nop at ", i, "rewritten to jmp");
          break;
        } else {
          instructionsClone[i].type = "nop";
        }
      } else if (instructionsClone[i].type === "jmp") {
        instructionsClone[i].type = "nop";
        if (runInstructions(instructionsClone)) {
          success = true;
          console.log("jmp at ", i, "rewritten to nop");
          break;
        } else {
          instructionsClone[i].type = "jmp";
        }
      }
    }
  } else {
    success = true;
  }
  return success;
}

function runInstructions(instructions) {
  let acc = 0;
  let beenThere = new Set();
  let success = true;
  for (let i = 0; i < instructions.length; i++) {
    if (beenThere.has(i)) {
      console.log("looped back to step: ", i, "\nacc before loop: ", acc);
      success = false;
      break;
    } else {
      beenThere.add(i);
    }
    switch (instructions[i].type) {
      case "acc":
        acc += parseInt(instructions[i].value);
        break;
      case "jmp":
        if (i + parseInt(instructions[i].value) - 1 === 163) console.log(i);
        i += parseInt(instructions[i].value) - 1;

        break;
      default:
        break;
    }
  }
  if (success) console.log("Finished | acc: ", acc);
  return success;
}
