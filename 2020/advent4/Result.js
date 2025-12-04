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

function processData(passportsRaw) {
  let passports = passportsRaw
    .split("\n")
    .map((line) => {
      if (line.length === 1) {
        return "[divide]";
      } else {
        return line;
      }
    })
    .join(" ")
    .split("[divide]");

  let processedPassports = [];
  passports.forEach((passport) => {
    processedPassports.push(
      passport
        .trim()
        .split(" ")
        .map((dataLine) => {
          return {
            fieldCode: dataLine.substring(0, dataLine.indexOf(":")).trim(),
            fieldData: dataLine.substring(dataLine.indexOf(":") + 1).trim(),
          };
        }),
    );
  });

  let validCount = 0;
  processedPassports.forEach((passport) => {
    if (validatePassport(passport)) {
      console.log("valid");
      validCount++;
    } else {
      console.log("not valid");
    }
  });

  console.log(validCount);
}

function validatePassport(passport) {
  console.log("testing: ", passport);
  let reqFields = [
    { code: "byr", checked: false },
    { code: "iyr", checked: false },
    { code: "eyr", checked: false },
    { code: "hgt", checked: false },
    { code: "hcl", checked: false },
    { code: "ecl", checked: false },
    { code: "pid", checked: false },
  ];
  passport.forEach((field) => {
    reqFields.forEach((req) => {
      if (field.fieldCode === req.code) {
        req.checked = true;
      }
    });
  });

  for (let i = 0; i < reqFields.length; i++) {
    if (!reqFields[i].checked) {
      console.log("-- does not have required fields --");
      return false;
    }
  }
  console.log("-- has all required fields --");
  let failCount = 0;
  passport.forEach((field) => {
    var match = [];
    switch (field.fieldCode) {
      case "byr":
        if (
          !(
            1920 <= parseInt(field.fieldData) &&
            parseInt(field.fieldData) <= 2002
          )
        ) {
          failCount++;
          console.log("byr FAILED");
        } else {
          console.log("byr PASSED");
        }
        break;
      case "iyr":
        if (
          !(
            2010 <= parseInt(field.fieldData) &&
            parseInt(field.fieldData) <= 2020
          )
        ) {
          failCount++;
          console.log("iyr FAILED");
        } else {
          console.log("iyr PASSED");
        }
        break;
      case "eyr":
        if (
          !(
            2020 <= parseInt(field.fieldData) &&
            parseInt(field.fieldData) <= 2030
          )
        ) {
          failCount++;
          console.log("eyr FAILED");
        } else {
          console.log("eyr PASSED");
        }
        break;
      case "hgt":
        let ending = field.fieldData.substring(
          field.fieldData.length - 2,
          field.fieldData.length,
        );
        let firstPart = field.fieldData.substring(
          0,
          field.fieldData.length - 2,
        );
        let result = false;
        if (
          ending === "cm" &&
          !isNaN(firstPart) &&
          parseInt(firstPart) >= 150 &&
          parseInt(firstPart) <= 193
        ) {
          result = true;
        }

        if (
          ending === "in" &&
          !isNaN(firstPart) &&
          parseInt(firstPart) >= 59 &&
          parseInt(firstPart) <= 76
        ) {
          result = true;
        }
        if (!result) {
          failCount++;
          console.log("hgt FAILED");
        } else {
          console.log("hgt PASSED");
        }
        break;
      case "hcl":
        match = field.fieldData.match(/^#[a-f0-9]{6}/);
        if (!match || match.input.trim() != match[0].trim()) {
          failCount++;
          console.log("hcl FAILED");
        } else {
          console.log("hcl PASSED");
        }
        break;
      case "ecl":
        match = field.fieldData.match(/^amb|blu|brn|gry|grn|hzl|oth/);
        if (!match || match.input.trim() !== match[0].trim()) {
          failCount++;
          console.log("ecl FAILED");
        } else {
          console.log("ecl PASSED");
        }
        break;
      case "pid":
        let check = failCount;
        if (field.fieldData.length !== 9) {
          failCount++;
        }
        field.fieldData.split("").forEach((char) => {
          if (isNaN(char)) {
            failCount++;
          }
        });
        if (check !== failCount) {
          console.log("pid FAILED");
        } else {
          console.log("pid PASSED");
        }
        break;

      default:
        break;
    }
  });

  return failCount === 0;
}
